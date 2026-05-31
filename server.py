"""
承认吧，你就是_____ — 数据收集后端
Flask + SQLite，同时提供 API 和静态文件服务
启动: python server.py (默认端口 8080)
"""
import os
import sqlite3
import json
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, g, send_from_directory, make_response

# ---- 配置 ----
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
DATABASE = os.path.join(DATA_DIR, 'sbtest.db')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '0621')

app = Flask(__name__, static_folder=None)
app.secret_key = os.environ.get('SECRET_KEY', os.urandom(24).hex())

# ==========================================
# 数据库
# ==========================================

def get_db():
    if 'db' not in g:
        os.makedirs(DATA_DIR, exist_ok=True)
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
        g.db.execute("PRAGMA journal_mode=WAL")
    return g.db


@app.teardown_appcontext
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_db():
    db = get_db()
    db.execute('''
        CREATE TABLE IF NOT EXISTS test_results (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            answers         TEXT NOT NULL,
            score_a         INTEGER NOT NULL,
            score_e         INTEGER NOT NULL,
            score_s         INTEGER NOT NULL,
            score_d         INTEGER NOT NULL,
            score_o         INTEGER NOT NULL,
            score_i         INTEGER NOT NULL,
            persona         TEXT NOT NULL,
            is_easter_egg   INTEGER NOT NULL DEFAULT 0,
            match_dims      INTEGER NOT NULL DEFAULT 0,
            user_agent      TEXT DEFAULT '',
            screen_size     TEXT DEFAULT '',
            client_time     TEXT DEFAULT '',
            created_at      TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        )
    ''')
    db.execute('CREATE INDEX IF NOT EXISTS idx_persona ON test_results(persona)')
    db.execute('CREATE INDEX IF NOT EXISTS idx_created_at ON test_results(created_at)')
    db.commit()


with app.app_context():
    init_db()


# ==========================================
# 认证
# ==========================================

def check_auth():
    token = request.cookies.get('sbtest_token', '')
    return token == ADMIN_PASSWORD


def require_auth():
    if not check_auth():
        return jsonify({'error': 'unauthorized', 'need_password': True}), 401
    return None


# ==========================================
# 静态文件服务
# ==========================================

@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')


@app.route('/api/auth', methods=['POST'])
def api_auth():
    data = request.get_json(silent=True) or {}
    pwd = data.get('password', '')
    if pwd == ADMIN_PASSWORD:
        resp = make_response(jsonify({'ok': True}))
        resp.set_cookie('sbtest_token', ADMIN_PASSWORD, max_age=3600 * 24 * 30, httponly=True, samesite='Lax')
        return resp
    return jsonify({'ok': False, 'error': '密码错误'}), 403


@app.route('/admin')
@app.route('/admin.html')
def admin():
    if not check_auth():
        return send_from_directory(BASE_DIR, 'admin.html')
    return send_from_directory(BASE_DIR, 'admin.html')


@app.route('/<path:filename>')
def static_files(filename):
    if os.path.isfile(os.path.join(BASE_DIR, filename)):
        return send_from_directory(BASE_DIR, filename)
    return jsonify({'error': 'not found'}), 404


# ==========================================
# API — 提交答题数据
# ==========================================

@app.route('/api/submit', methods=['POST'])
def api_submit():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'ok': False, 'error': 'invalid JSON'}), 400

    answers = data.get('answers')
    scores = data.get('scores', {})
    persona = data.get('persona', '')

    if not answers or len(answers) != 30:
        return jsonify({'ok': False, 'error': 'answers must be 30 elements'}), 400
    if not persona:
        return jsonify({'ok': False, 'error': 'persona required'}), 400

    try:
        db = get_db()
        db.execute('''
            INSERT INTO test_results
                (answers, score_a, score_e, score_s, score_d, score_o, score_i,
                 persona, is_easter_egg, match_dims, user_agent, screen_size, client_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            json.dumps(answers),
            int(scores.get('A', 0)), int(scores.get('E', 0)), int(scores.get('S', 0)),
            int(scores.get('D', 0)), int(scores.get('O', 0)), int(scores.get('I', 0)),
            str(persona),
            1 if data.get('is_easter_egg') else 0,
            int(data.get('match_dims', 0)),
            str(data.get('user_agent', '')),
            str(data.get('screen_size', '')),
            str(data.get('timestamp', '')),
        ))
        db.commit()
        new_id = db.execute('SELECT last_insert_rowid()').fetchone()[0]
        return jsonify({'ok': True, 'id': new_id})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500


# ==========================================
# API — 总览统计
# ==========================================

@app.route('/api/stats/overview')
def api_stats_overview():
    auth_err = require_auth()
    if auth_err: return auth_err
    db = get_db()

    total = db.execute('SELECT COUNT(*) FROM test_results').fetchone()[0] or 0

    today = db.execute(
        "SELECT COUNT(*) FROM test_results WHERE date(created_at) = date('now','localtime')"
    ).fetchone()[0] or 0

    # 人格分布
    dist_rows = db.execute('''
        SELECT persona, COUNT(*) as cnt FROM test_results
        GROUP BY persona ORDER BY cnt DESC
    ''').fetchall()
    persona_dist = []
    for row in dist_rows:
        persona_dist.append({
            'name': row['persona'],
            'count': row['cnt'],
            'pct': round(row['cnt'] / total * 100, 2) if total > 0 else 0
        })

    # 彩蛋率
    egg_rate = 0
    if total > 0:
        egg_count = db.execute(
            'SELECT COUNT(*) FROM test_results WHERE is_easter_egg = 1'
        ).fetchone()[0] or 0
        egg_rate = round(egg_count / total * 100, 2)

    # 平均匹配维度
    avg_match = db.execute(
        'SELECT AVG(match_dims) FROM test_results'
    ).fetchone()[0]
    avg_match = round(avg_match, 1) if avg_match else 0

    # 近7日趋势
    last7_rows = db.execute('''
        SELECT date(created_at) as dt, COUNT(*) as cnt
        FROM test_results
        WHERE created_at >= date('now', 'localtime', '-7 days')
        GROUP BY dt ORDER BY dt
    ''').fetchall()

    last7_map = {row['dt']: row['cnt'] for row in last7_rows}
    last_7_days = []
    for i in range(6, -1, -1):
        dt = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
        last_7_days.append({'date': dt, 'count': last7_map.get(dt, 0)})

    return jsonify({
        'total_tests': total,
        'today_count': today,
        'persona_distribution': persona_dist,
        'easter_egg_rate': egg_rate,
        'avg_match_dims': avg_match,
        'last_7_days': last_7_days,
    })


# ==========================================
# API — 按题答案分布
# ==========================================

@app.route('/api/stats/questions')
def api_stats_questions():
    auth_err = require_auth()
    if auth_err: return auth_err
    db = get_db()
    rows = db.execute('SELECT answers FROM test_results').fetchall()

    # 30题，每题4选项，初始化为0
    dist = [[0, 0, 0, 0] for _ in range(30)]
    total = 0

    for row in rows:
        try:
            ans = json.loads(row['answers'])
            for q in range(min(30, len(ans))):
                opt = ans[q]
                if isinstance(opt, int) and 0 <= opt < 4:
                    dist[q][opt] += 1
            total += 1
        except (json.JSONDecodeError, TypeError):
            pass

    return jsonify({
        'total': total,
        'questions': [{
            'question_id': q + 1,
            'option_distribution': dist[q],
            'total': total
        } for q in range(30)]
    })


# ==========================================
# API — 六维分数分布
# ==========================================

@app.route('/api/stats/dimensions')
def api_stats_dimensions():
    auth_err = require_auth()
    if auth_err: return auth_err
    db = get_db()
    dims = ['a', 'e', 's', 'd', 'o', 'i']
    result = {}

    for dim in dims:
        values = db.execute(
            f'SELECT score_{dim} FROM test_results WHERE score_{dim} IS NOT NULL ORDER BY score_{dim}'
        ).fetchall()
        vals = [r[0] for r in values]
        n = len(vals)
        if n == 0:
            result[dim.upper()] = {
                'mean': 0, 'median': 0, 'p5': 0, 'p95': 0,
                'min': 0, 'max': 0, 'histogram': [0] * 10, 'count': 0
            }
            continue

        mean_v = round(sum(vals) / n, 1)
        median_v = vals[n // 2]
        p5_v = vals[max(0, int(n * 0.05))]
        p95_v = vals[min(n - 1, int(n * 0.95))]

        # 10桶直方图 (0-9, 10-19, ..., 90-100)
        hist = [0] * 10
        for v in vals:
            bucket = min(9, v // 10)
            hist[bucket] += 1

        result[dim.upper()] = {
            'mean': mean_v,
            'median': median_v,
            'p5': p5_v,
            'p95': p95_v,
            'min': vals[0],
            'max': vals[-1],
            'histogram': hist,
            'count': n
        }

    return jsonify(result)


# ==========================================
# API — 每日趋势 (近30天)
# ==========================================

@app.route('/api/stats/timeline')
def api_stats_timeline():
    auth_err = require_auth()
    if auth_err: return auth_err
    db = get_db()
    rows = db.execute('''
        SELECT date(created_at) as dt, COUNT(*) as cnt
        FROM test_results
        WHERE created_at >= date('now', 'localtime', '-30 days')
        GROUP BY dt ORDER BY dt
    ''').fetchall()

    dt_map = {row['dt']: row['cnt'] for row in rows}
    timeline = []
    for i in range(29, -1, -1):
        dt = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
        timeline.append({'date': dt, 'count': dt_map.get(dt, 0)})

    return jsonify(timeline)


# ==========================================
# CORS (允许跨域 —— 本地开发友好)
# ==========================================

@app.after_request
def add_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response


# ==========================================
# 启动
# ==========================================

if __name__ == '__main__':
    print('')
    print('  ◆ 人格测试服务器已启动 ◆')
    print('  首页:   http://localhost:8080')
    print('  仪表盘: http://localhost:8080/admin')
    print('  数据文件: ' + DATABASE)
    print('  Ctrl+C 停止')
    print('')
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_DEBUG', '0') == '1')
