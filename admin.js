/**
 * 承认吧，你就是_____ — 统计仪表盘
 * 从 Flask API 拉取数据，纯 CSS 图表渲染
 */
(function () {
  'use strict';

  var DIM_LABELS = { A: '利他', E: '外显', S: '社交', D: '数字', O: '乐观', I: '烈度' };
  var DIM_COLORS = { A: '#c084fc', E: '#f9a8d4', S: '#7ec8c0', D: '#a78bfa', O: '#67e8f9', I: '#f472b6' };

  // 30道题目文本（与 test.js 保持一致）
  var QUESTIONS = [
    { id: 1, text: '朋友半夜发来"好烦啊"，你第一反应是？', options: ['直接打电话，不管几点', '回"说来听听"，彻夜长谈ing', '先发个表情包再说', '打了很长一段话，发送前全删了，装已经入睡没看到消息'] },
    { id: 2, text: '你最近一次当众出丑，事后你是？', options: ['反复回想，脑子里循环播放，停不下来', '当时想死，但第二天真忘了', '当场转化成笑点，只要我不尴尬，那尴尬的就是别人', '太好了，又多了一个睡前专属折磨素材'] },
    { id: 3, text: '朋友问"你最近怎么样"，你的真实回答是？', options: ['"活人微死"（很久没好好过了，但解释太麻烦）', '"不好，你听我说——"', '"很好啊！"（是真的很好）', '"唉"，然后没有然后（说来话长）'] },
    { id: 4, text: '群里有人说了件没什么意思的事，你会？', options: ['随手发个"哈哈哈"，打个卡就走', '发个表情包，活跃但不表态', '已读，然后把群设成免打扰，顺便把通知也关了', '接梗，顺便把话题带到更有意思的方向'] },
    { id: 5, text: '你朋友私下最可能怎么评价你？', options: ['"他什么都知道，但什么都不说"', '"好说话，找他准没错"', '"他太好笑了"（不是夸你帅的那种好笑）', '"他一个人也行，不太需要人"'] },
    { id: 6, text: '你定了个计划，当天完全没执行，你会？', options: ['调整，今天没做明天补，不纠结', '翻来覆去内耗，觉得自己废了', '觉得这个计划本来就没必要，所以不算失败', '发个"下次一定"，发完继续摆'] },
    { id: 7, text: '有人当众指出你的错误，你第一反应是？', options: ['行，踢到我算是踢到棉花了', '当场表情管理撑住了，回家再死', '承认，谢谢，下次继续', '谁对谁错还没定论，高低跟你理论理论'] },
    { id: 8, text: '你的社交媒体/朋友圈状态是？', options: ['高频更新，吃饭出门心情全发', '偶尔发，发之前想很久要不要发', '基本不发，但每条都看', '不用，或者注册了从来没发过'] },
    { id: 9, text: '去一个认识人不多的聚会，你会？', options: ['主动找人搭话，聊起来停不下来', '找个角落待着，观察大家，等人来找我', '黏着唯一认识的那个人，他去厕所我都想跟着', '一直刷手机，礼貌性撑完这个晚上'] },
    { id: 10, text: '深夜睡不着，你大概率在干嘛？', options: ['反复回想今天某个细节，有时候是几年前的', '刷手机，刷到眼睛自己闭上', '找人聊天，哪怕说废话', '强迫自己闭眼，不让脑子转'] },
    { id: 11, text: '你帮了朋友一个大忙，对方没道谢，你会？', options: ['心里记着，嘴上不说，我记性一向很好（下次你等着）', '直接说：我帮了你这么多，就这？', '记在心里，下次他找我，我再想想', '真没所谓，帮完就帮完了'] },
    { id: 12, text: '你经历了一件很难过的事，你会？', options: ['找朋友倾诉，说很久', '一个人扛，不想麻烦别人，也不想解释', '发朋友圈或在网上小号写，说不出口的打出来', '赶快找点别的事，不给自己留难过的档期'] },
    { id: 13, text: '有人提出一个你认为不对的观点，你会？', options: ['立刻指出哪里不对', '说"确实有道理"，然后完全不按他说的来', '懒得争，点头，走', '反问他几个问题，让他自己把话说死'] },
    { id: 14, text: '你说过很狠的话，然后后悔过吗？', options: ['经常，属于先开枪再想有没有子弹那种', '有，后悔了会道歉，但不一定说清楚在道歉什么', '基本没有，我说话前会过一遍', '说过，不后悔，我就是那个意思'] },
    { id: 15, text: '你觉得朋友真正了解你几成？', options: ['九成以上，心事全在脸上', '五成左右，剩下的不必要说', '三成不到，真正了解我的没几个', '测完这题我开始怀疑了'] },
    { id: 16, text: '如果你的人生是一款游戏，你会选哪个模式？', options: ['剧情模式，跟着走，把故事看完', '自由模式，地图全跑，不走主线', '多人联机，没人一起玩就不想玩', '观战模式，先看别人打观察一手，我研究研究'] },
    { id: 17, text: '别想了，凭直觉选一个：', options: ['选我', '我好像是正确答案', '随便（但还是看了三遍）', '凭什么这道题也要我来决定'] },
    { id: 18, text: '如果你的情绪是今天的天气，是？', options: ['晴，偶尔有云，整体可以', '阴，不下雨，但说不好', '雷阵雨，不知道什么时候炸', '大雾，连我自己都不知道我在想什么'] },
    { id: 19, text: '你发了一条朋友圈，一小时后删了，为什么？', options: ['发完觉得太暴露了，不想别人知道当时状态，心想：应该没人看到吧', '没人点赞，当它从未存在过', '发完就后悔了，不知道当时在想什么', '我不删，删了说明我心虚'] },
    { id: 20, text: '你一个人吃饭，旁边有人突然吵起来，你会？', options: ['低头继续吃，假装什么都没发生别波及到我的饭就好', '忍不住偷听吃瓜，在心里分析谁有理', '掏出手机，这素材不用太可惜了必须记录生活一下', '感觉很不舒服，赶快吃完走'] },
    { id: 21, text: '不解释，选一个最接近你今天状态的：', options: ['刚充满电的手机', '开了一半没动的外卖', '没人打开过的草稿箱', '换季没来得及收的衣服'] },
    { id: 22, text: '便利店收银员突然问你"你今天过得好吗"，你会？', options: ['愣一下，然后真的开始说，就差说银行卡密码了', '"还行"，快速结束话题', '觉得这人挺有意思，但不知道怎么接', '礼貌地笑一下，内心：？'] },
    { id: 23, text: '深夜刷手机，你更容易？', options: ['看到好东西，马上转发给朋友', '一个人看完，关屏睡觉'] },
    { id: 24, text: '你更认同哪句？', options: ['善良不需要理由', '善良要留给值得的人'] },
    { id: 25, text: '地铁上有人大声外放视频，你会？', options: ['皱眉，忍着，啧一下。在心里把他骂了一百遍', '走过去说"能小声点吗"'] },
    { id: 26, text: '你最害怕哪种感觉？', options: ['想帮别人，但发现自己已经没有余力了', '消失了一段时间，没有人主动来找你，无人在意', '人太多太吵，找不到自己在哪', '一个人太久，脑子里开始空了'] },
    { id: 27, text: '你觉得自己最大的问题是什么？', options: ['太容易心软，知道在被拿捏，偏偏自己还就是软柿子', '嘴快，说完才想后果', '知道该做什么，但计划永远比执行精彩', '太敏感，别人一句随口的话，我能给它写一篇读后感'] },
    { id: 28, text: '现在最接近你的状态是？', options: ['表面没事，实际上不知道自己怎么了', '天大的事，先睡一觉明天再说', '也没什么特别的，就是想被看见一下', '不用管我，我自己能搞定，也不需要人搞定'] },
    { id: 29, text: '你觉得你身上最值钱的是什么？', options: ['能让所有人都开心的能力', '对别人感受的敏锐，细节都逃不过我', '什么都看得出来，但知道什么时候该闭嘴', '放到哪里都能活，不依赖任何环境'] },
    { id: 30, text: '最后一题，用一个词形容你自己？', options: ['温柔', '有趣', '清醒', '自由'] }
  ];

  // ====== 登录 ======
  function showLoginScreen() {
    var container = document.querySelector('.admin-container');
    container.innerHTML =
      '<div class="login-box glass">' +
      '<div class="login-icon">🔒</div>' +
      '<h2 class="login-title">身份验证</h2>' +
      '<p class="login-hint">请输入密码以查看统计仪表盘</p>' +
      '<input type="password" class="login-input" id="pwdInput" placeholder="输入密码" autofocus>' +
      '<button class="login-btn" id="pwdBtn">确认</button>' +
      '<p class="login-error" id="pwdError"></p>' +
      '</div>';

    document.getElementById('pwdBtn').addEventListener('click', doLogin);
    document.getElementById('pwdInput').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') doLogin();
    });
  }

  function doLogin() {
    var pwd = document.getElementById('pwdInput').value;
    var errEl = document.getElementById('pwdError');
    if (!pwd) { errEl.textContent = '请输入密码'; return; }

    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd })
    }).then(function(r) {
      if (!r.ok) throw new Error('wrong');
      location.reload();
    }).catch(function() {
      errEl.textContent = '密码错误';
      document.getElementById('pwdInput').value = '';
    });
  }

  // ====== 数据拉取 ======
  function fetchStats() {
    showAllLoading();
    Promise.all([
      fetch('/api/stats/overview').then(function(r) {
        if (r.status === 401) throw new Error('UNAUTHORIZED');
        return r.json();
      }),
      fetch('/api/stats/questions').then(function(r) { return r.json(); }),
      fetch('/api/stats/dimensions').then(function(r) { return r.json(); }),
      fetch('/api/stats/timeline').then(function(r) { return r.json(); })
    ]).then(function(results) {
      renderOverview(results[0]);
      renderPersonaDistribution(results[0]);
      renderQuestions(results[1]);
      renderDimensions(results[2]);
      renderTimeline(results[3]);
    }).catch(function(e) {
      if (e.message === 'UNAUTHORIZED') {
        showLoginScreen();
        return;
      }
      console.error('API error:', e);
      showError();
    });
  }

  function showAllLoading() {
    var sections = document.querySelectorAll('.chart-placeholder');
    for (var i = 0; i < sections.length; i++) {
      sections[i].style.display = 'block';
      sections[i].textContent = '加载中...';
    }
  }

  function showError() {
    var sections = document.querySelectorAll('.chart-placeholder');
    for (var i = 0; i < sections.length; i++) {
      sections[i].innerHTML = '<div class="error-state"><div class="error-icon">⚠️</div><div class="error-text">数据加载失败</div><div class="error-hint">请确认后端已启动 (python server.py)</div></div>';
    }
    var statCards = document.querySelectorAll('.stat-value');
    for (var j = 0; j < statCards.length; j++) { statCards[j].textContent = '--'; }
  }

  // ====== 概览卡片 ======
  function renderOverview(data) {
    document.getElementById('statTotal').textContent = (data.total_tests || 0).toLocaleString('zh-CN');
    document.getElementById('statToday').textContent = (data.today_count || 0).toLocaleString('zh-CN');
    document.getElementById('statEgg').textContent = (data.easter_egg_rate || 0).toFixed(1) + '%';
    document.getElementById('statMatch').textContent = (data.avg_match_dims || 0).toFixed(1) + '/6';
  }

  // ====== 人格分布柱状图 ======
  function renderPersonaDistribution(data) {
    var container = document.getElementById('personaChart');
    var dist = data.persona_distribution || [];
    var total = data.total_tests || 1;
    document.getElementById('personaHint').textContent = total.toLocaleString('zh-CN') + ' 份样本';

    if (dist.length === 0) {
      container.innerHTML = '<div class="chart-placeholder">暂无数据</div>';
      return;
    }

    var maxCount = dist[0].count || 1;
    var html = '';
    for (var i = 0; i < dist.length; i++) {
      var d = dist[i];
      var w = maxCount > 0 ? (d.count / maxCount * 100) : 0;
      var isRare = d.name === '朱之文';
      html += '<div class="bar-row' + (isRare ? ' rare-row' : '') + '" style="animation-delay:' + (i * 0.04) + 's">';
      html += '<span class="bar-label">' + d.name + '</span>';
      html += '<div class="bar-track"><div class="bar-fill" style="width:' + w + '%"></div></div>';
      html += '<span class="bar-value">' + d.count.toLocaleString('zh-CN') + ' (' + d.pct + '%)</span>';
      html += '</div>';
    }
    container.innerHTML = html;
  }

  // ====== 按题答案分布 ======
  function renderQuestions(data) {
    var container = document.getElementById('questionsChart');
    var questions = data.questions || [];
    var total = data.total || 0;
    document.getElementById('questionHint').textContent = total.toLocaleString('zh-CN') + ' 份样本';

    if (questions.length === 0) {
      container.innerHTML = '<div class="chart-placeholder">暂无数据</div>';
      return;
    }

    var labels = ['A', 'B', 'C', 'D'];
    var cssClasses = ['a', 'b', 'c', 'd'];
    var html = '';

    for (var q = 0; q < questions.length; q++) {
      var qd = questions[q];
      var qInfo = QUESTIONS[q] || { text: '题目 ' + (q + 1), options: ['', '', '', ''] };
      var qMax = Math.max.apply(null, qd.option_distribution) || 1;

      html += '<div class="question-item">';
      html += '<div class="question-text">Q' + qd.question_id + '. ' + qInfo.text + '</div>';
      html += '<div class="question-bars">';

      for (var o = 0; o < qd.option_distribution.length; o++) {
        var cnt = qd.option_distribution[o];
        var w = qMax > 0 ? (cnt / qMax * 100) : 0;
        var optText = qInfo.options[o] || '';
        html += '<div class="qbar-row">';
        html += '<span class="qbar-letter">' + labels[o] + '</span>';
        html += '<div class="qbar-track"><div class="qbar-fill ' + cssClasses[o] + '" style="width:' + w + '%" title="' + optText + '"></div></div>';
        html += '<span class="qbar-count">' + cnt.toLocaleString('zh-CN') + '</span>';
        html += '</div>';
      }

      html += '</div></div>';
    }
    container.innerHTML = html;
  }

  // ====== 六维分数直方图 ======
  function renderDimensions(data) {
    var container = document.getElementById('dimensionsChart');
    var dims = ['E', 'A', 'S', 'O', 'I', 'D'];
    var total = 0;

    for (var d = 0; d < dims.length; d++) {
      var dimData = data[dims[d]];
      if (dimData && dimData.count) total = dimData.count;
    }
    document.getElementById('dimHint').textContent = total.toLocaleString('zh-CN') + ' 份样本';

    if (total === 0) {
      container.innerHTML = '<div class="chart-placeholder">暂无数据</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < dims.length; i++) {
      var dim = dims[i];
      var dimData = data[dim];
      if (!dimData || !dimData.histogram) continue;

      var color = DIM_COLORS[dim];
      var label = DIM_LABELS[dim];
      var histMax = Math.max.apply(null, dimData.histogram) || 1;

      html += '<div class="dim-card">';
      html += '<div class="dim-header">';
      html += '<span class="dim-dot" style="background:' + color + ';box-shadow:0 0 6px ' + color + ';"></span>';
      html += '<span class="dim-name">' + label + '</span>';
      html += '<span class="dim-stats">μ=' + dimData.mean + ' 中=' + dimData.median + '</span>';
      html += '</div>';

      html += '<div class="dim-histo">';
      for (var b = 0; b < dimData.histogram.length; b++) {
        var h = histMax > 0 ? (dimData.histogram[b] / histMax * 56) : 0;
        html += '<div class="histo-bar" style="height:' + h + 'px;background:' + color + ';box-shadow:0 0 4px ' + color + ';" title="' + (b * 10) + '-' + (b * 10 + 9) + ': ' + dimData.histogram[b] + '"></div>';
      }
      html += '</div>';

      html += '<div class="dim-labels"><span>0</span><span>50</span><span>100</span></div>';
      html += '</div>';
    }
    container.innerHTML = html;
  }

  // ====== 每日趋势柱状图 ======
  function renderTimeline(data) {
    var container = document.getElementById('timelineChart');
    var items = data || [];

    if (items.length === 0) {
      container.innerHTML = '<div class="chart-placeholder">暂无数据</div>';
      return;
    }

    var maxCount = 1;
    for (var i = 0; i < items.length; i++) {
      if (items[i].count > maxCount) maxCount = items[i].count;
    }

    var html = '';
    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      var h = maxCount > 0 ? (item.count / maxCount * 100) : 0;
      var dateShort = item.date.slice(5); // MM-DD
      html += '<div class="timeline-bar-wrap">';
      html += '<span class="timeline-count">' + (item.count || '') + '</span>';
      html += '<div class="timeline-bar" style="height:' + h + 'px" title="' + item.date + ': ' + item.count + '"></div>';
      html += '<span class="timeline-date">' + dateShort + '</span>';
      html += '</div>';
    }
    container.innerHTML = html;
  }

  // ====== 刷新按钮 ======
  document.getElementById('btnRefresh').addEventListener('click', function() {
    fetchStats();
  });

  // ====== 启动 ======
  fetchStats();

})();
