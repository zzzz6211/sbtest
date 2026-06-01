/**
 * 承认吧，你就是_____ — 适配度引擎
 * 16种人格 × 15组配对 = 120组关系
 * 维度距离 + 特殊规则 → 5级适配度
 */
(function () {
  'use strict';

  // 手机检测：给 body 加 class（替代 @media，微信浏览器兼容性更好）
  var IS_MOBILE = window.innerWidth < 600;
  if (IS_MOBILE) {
    document.documentElement.classList.add('is-mobile');
  }

  // ==========================================
  // 16人格数据（同 result.js）
  // ==========================================
  var PERSONAS = {
    '血包': {
      id: 1, name: '血包',
      knife: '别人的情绪垃圾桶，自己的电量永远1%。',
      portrait: '治愈系但自己没人治',
      profile: { A: 85, E: 70, S: 50, D: 18, O: 28, I: 18 }
    },
    '五秒真男(女)人': {
      id: 2, name: '五秒真男(女)人',
      knife: '你的后悔频率，比你愿意承认的高得多。',
      portrait: '说到不一定做到',
      profile: { A: 28, E: 90, S: 62, D: 10, O: 50, I: 90 }
    },
    '电子蝴蝶': {
      id: 3, name: '电子蝴蝶',
      knife: '赛博世界翩翩飞舞，一关屏幕就碎成像素。',
      portrait: '线上线下两个人',
      profile: { A: 10, E: 70, S: 10, D: 95, O: 48, I: 48 }
    },
    '傻波一': {
      id: 4, name: '傻波一',
      knife: '有时候是看透了懒得说，有时候是真没看懂。',
      portrait: '松弛还是麻木说不清',
      profile: { A: 52, E: 24, S: 24, D: 22, O: 80, I: 24 }
    },
    '雀食者': {
      id: 5, name: '雀食者',
      knife: '你说的"都行"里面，没有一个是真的都行。',
      portrait: '糊弄学满级选手',
      profile: { A: 60, E: 24, S: 64, D: 22, O: 36, I: 24 }
    },
    '补兑者': {
      id: 6, name: '补兑者',
      knife: '你不是在讲道理，你就是不想让对方赢。',
      portrait: '反驳型人格本格',
      profile: { A: 15, E: 48, S: 50, D: 12, O: 17, I: 55 }
    },
    '法师': {
      id: 7, name: '法师',
      knife: '你没有在克制，你只是还没找到足够大的出口。',
      portrait: '定时炸弹本弹',
      profile: { A: 20, E: 78, S: 22, D: 50, O: 24, I: 72 }
    },
    '豪士': {
      id: 8, name: '豪士',
      knife: '天塌了？这是好事儿啊。',
      portrait: '乐观悍匪',
      profile: { A: 50, E: 52, S: 50, D: 18, O: 85, I: 50 }
    },
    '朱之文': {
      id: 9, name: '朱之文',
      knife: '我是老实，不是傻。',
      portrait: '善良有锋芒',
      isEasterEgg: true,
      profile: { A: 92, E: 22, S: 50, D: 20, O: 72, I: 8 }
    },
    '玻璃': {
      id: 10, name: '玻璃',
      knife: '别碰我，会碎。但不碰我，会冷。',
      portrait: '高敏感体质',
      profile: { A: 50, E: 85, S: 18, D: 50, O: 12, I: 18 }
    },
    '嘉豪': {
      id: 11, name: '嘉豪',
      knife: '你以为你是全场焦点，你确实是——因为大家都在看你出丑。',
      portrait: '存在感是命',
      profile: { A: 15, E: 90, S: 90, D: 50, O: 62, I: 72 }
    },
    '万人迷': {
      id: 12, name: '万人迷',
      knife: '你什么都不用做，站着就是吸引力法则。',
      portrait: '亲和力爆表',
      profile: { A: 58, E: 35, S: 68, D: 25, O: 65, I: 20 }
    },
    '天使': {
      id: 13, name: '天使',
      knife: '下凡是来渡劫，任务是救苦救难。',
      portrait: '行走的治愈剂',
      profile: { A: 72, E: 53, S: 52, D: 32, O: 64, I: 30 }
    },
    '隐身玩家': {
      id: 14, name: '隐身玩家',
      knife: '游戏里的隐身技能，我活成了日常。',
      portrait: '人间观察家',
      profile: { A: 62, E: 5, S: 5, D: 62, O: 55, I: 5 }
    },
    '独美选手': {
      id: 15, name: '独美选手',
      knife: '不是孤独，是选择性的独美。',
      portrait: '一人即世界',
      profile: { A: 20, E: 20, S: 5, D: 18, O: 75, I: 50 }
    },
    '乐子人': {
      id: 16, name: '乐子人',
      knife: '我不是在找乐子，我就是乐子本身。',
      portrait: '快乐批发商',
      profile: { A: 37, E: 72, S: 72, D: 38, O: 82, I: 72 }
    }
  };

  var DIMS = ['A', 'E', 'S', 'D', 'O', 'I'];
  var DIM_NAMES = { A: '利他', E: '外显', S: '社交', D: '数字', O: '乐观', I: '烈度' };

  // ==========================================
  // 适配度计算引擎（纯算法驱动，无人为覆盖）
  // ==========================================
  function classifyCategory(score) {
    if (score <= 30) return 'L';
    if (score >= 70) return 'H';
    return 'M';
  }

  function calcBaseScore(a, b) {
    // Euclidean distance → similarity score 0-100
    var sumSq = 0;
    for (var i = 0; i < DIMS.length; i++) {
      var d = a.profile[DIMS[i]] - b.profile[DIMS[i]];
      sumSq += d * d;
    }
    var dist = Math.sqrt(sumSq);
    var raw = Math.max(0, 100 - dist * 0.43);

    // === MBTI式分类匹配bonus (每共享维度类别+3, 最多+18) ===
    for (var j = 0; j < DIMS.length; j++) {
      if (classifyCategory(a.profile[DIMS[j]]) === classifyCategory(b.profile[DIMS[j]])) {
        raw += 2;
      }
    }

    // === 连续维度互动修正（替代旧阈值规则） ===
    // I 烈度交互：双方I越高越易冲突
    raw -= (a.profile.I / 100) * (b.profile.I / 100) * 18;
    // I 烈度落差：≥25分差距 → 高烈度方压制低烈度方；极端差距（>45）加倍惩罚
    var iGap = Math.abs(a.profile.I - b.profile.I);
    if (iGap >= 25) raw -= (iGap - 20) * 0.25;
    if (iGap > 45) raw -= (iGap - 45) * 0.5;
    // I-A 复合：高烈度+低利他 = 易怒且不包容 → 双向计算
    raw -= ((a.profile.I/100) * (1 - a.profile.A/100) + (b.profile.I/100) * (1 - b.profile.A/100)) * 10;
    // A 利他共鸣：双高加分，落差>35扣分
    raw += (a.profile.A / 100) * (b.profile.A / 100) * 10;
    var aGap = Math.abs(a.profile.A - b.profile.A);
    if (aGap >= 35) raw -= (aGap - 30) * 0.2;
    // O 乐观叠加
    raw += (a.profile.O / 100) * (b.profile.O / 100) * 8;
    var oGap = Math.abs(a.profile.O - b.profile.O);
    if (oGap >= 40) raw -= (oGap - 35) * 0.15;
    // S 社交共鸣
    raw += (1 - Math.abs(a.profile.S - b.profile.S) / 100) * 5;
    // E 外显共鸣
    raw += (1 - Math.abs(a.profile.E - b.profile.E) / 100) * 4;

    // 朱之文对所有非补兑者/非法师 +6 (淳朴力量)
    if (a.isEasterEgg && !['补兑者', '法师'].includes(b.name)) raw += 6;
    if (b.isEasterEgg && !['补兑者', '法师'].includes(a.name)) raw += 6;

    return Math.max(0, Math.min(100, Math.round(raw)));
  }

  function scoreToLevel(score) {
    if (score >= 82) return 5; // 💞绝配
    if (score >= 66) return 4; // ⭐⭐⭐很合
    if (score >= 46) return 3; // ⭐⭐随缘
    if (score >= 28) return 2; // ⚡有摩擦
    return 1;                   // 💥高危
  }

  var LEVEL_CONFIG = {
    5: { emoji: '💞', label: '绝配', cls: 'lvl-perfect' },
    4: { emoji: '⭐⭐⭐', label: '很合', cls: 'lvl-great' },
    3: { emoji: '⭐⭐', label: '随缘', cls: 'lvl-okay' },
    2: { emoji: '⚡', label: '有摩擦', cls: 'lvl-meh' },
    1: { emoji: '💥', label: '高危', cls: 'lvl-danger' }
  };

  // ==========================================
  // 自动生成描述（确定性的，基于配对哈希，不会重复）
  // "你" = 答题者, "ta" = 目标人格
  // ==========================================
  function generateDesc(a, b, level, score) {
    // 按 ID 排序取哈希，保证同一对总是同一描述
    var ids = [a.id, b.id].sort(function(x,y){return x-y;});
    var hash = (ids[0] * 31 + ids[1]) % 7;

    // 找出最大差异和最大相似的维度
    var maxDiffDim = '', maxDiffVal = 0;
    var maxSimDim = '', maxSimVal = 100;
    var dims = DIMS;
    for (var i = 0; i < dims.length; i++) {
      var d = Math.abs(a.profile[dims[i]] - b.profile[dims[i]]);
      if (d > maxDiffVal) { maxDiffVal = d; maxDiffDim = dims[i]; }
      if (d < maxSimVal) { maxSimVal = d; maxSimDim = dims[i]; }
    }

    var diffName = DIM_NAMES[maxDiffDim];
    var simName = DIM_NAMES[maxSimDim];
    var targetName = b.name;

    // 找出你在哪些维度明显高于/低于 ta
    var youHigher = [], youLower = [];
    for (var j = 0; j < dims.length; j++) {
      var gap = a.profile[dims[j]] - b.profile[dims[j]];
      if (gap >= 25) youHigher.push(DIM_NAMES[dims[j]]);
      else if (gap <= -25) youLower.push(DIM_NAMES[dims[j]]);
    }
    var highStr = youHigher.length > 0 ? '你在「' + youHigher.join('」「') + '」上比ta突出' : '';
    var lowStr = youLower.length > 0 ? 'ta在「' + youLower.join('」「') + '」上比你明显' : '';

    // 每级7个模板，hash 决定选哪个
    var templates = {
      5: [
        '你和' + targetName + '在「' + simName + '」维度惊人同频，哪怕在「' + diffName + '」上的差异也只是加分项。你们的关系不费力气——两人站在一起，就已经是最好的状态。',
        '灵魂级别的默契。你们在「' + simName + '」的频率完全一致，很多事不需要开口就已经懂了。' + (highStr || lowStr ? (highStr || lowStr) + '，但这反而让你们更完整。' : '认识没多久却像认识了很多年。'),
        targetName + '和你共享「' + simName + '」的底层频率。沉默不尴尬，分歧不伤感情。你发现跟ta相处，做自己就够了。',
        '你们是「' + simName + '」上的同频者。和' + targetName + '在一起时，你发现自己不用解释太多——ta就是能懂。' + (highStr ? highStr + '，ta恰好补上了你需要的部分。' : '这种默契可遇不可求。'),
        '在「' + simName + '」上你们一拍即合，在「' + diffName + '」上你们恰到好处地互补。' + targetName + '是你不需要费劲就能相处融洽的那类人。',
        '你遇到' + targetName + '就像找到了某个频率的知音。你们的「' + simName + '」高度共振，其他差异反而成了让关系更立体的调味料。',
        '和' + targetName + '在一起，你体会到什么叫"省力"的关系。' + simName + '上的一致让你们天然亲近，' + diffName + '上的差异则恰好互补——谁也不勉强谁。'
      ],
      4: [
        '你和' + targetName + '在「' + simName + '」上很有共鸣，处得舒服聊得来。在「' + diffName + '」上你们有些差异，但正是这些差异让你们互相补位，大部分时候ta是你的加分项。',
        '很合拍的组合。「' + simName + '」让你们在一起轻松开心，「' + diffName + '」的不同反而让彼此看到了不一样的视角。和' + targetName + '相处，总体是很舒服的。',
        '可以长期相处的关系。你和' + targetName + '在「' + simName + '」上的默契省了很多解释，而「' + diffName + '」的不同只需要一点主动理解就能跨过去。',
        '你发现和' + targetName + '在一起的大部分时候，节奏是对的。' + simName + '上你们在一个频道，' + diffName + '上虽然不同，但都在可以接受的范围内。',
        + (highStr ? highStr + '。' : '') + targetName + '在「' + simName + '」上跟你很合拍，偶尔的小摩擦都算不上事儿。一段不需要太费心维护的关系。',
        '你们在「' + simName + '」上的默契是这段关系的基石。哪怕「' + diffName + '」上看法不同，也不会影响核心的舒适感。和' + targetName + '在一起，整体是加分。',
        targetName + '是那种你不需要时刻绷着的人。你们的「' + simName + '」让对话自然流动，「' + diffName + '」的差异则让你们的关系不至于太单调。'
      ],
      3: [
        '你和' + targetName + '在「' + simName + '」上没什么矛盾，基本相处不成问题。但「' + diffName + '」上的差异意味着你们有时需要在脑回路上多对齐一步。不算差，看缘分。',
        '中规中矩的关系。「' + simName + '」能让你们和平共处，至于「' + diffName + '」——尊重差异也是一种相处之道。和' + targetName + '在一起，不勉强。',
        '能做朋友的关系。"' + simName + '"让你和' + targetName + '有共同语言，但"' + diffName + '"上的距离让你们有时候像在两个频道。不是谁的问题，就是频道不同。',
        '你和' + targetName + '的相处比较轻松——没什么大矛盾，也没什么特别来电。你们的「' + simName + '」维度是稳定器，「' + diffName + '」则需要多一份耐心和理解。',
        '一段看缘分的关系。你感觉和' + targetName + '可以和平共处，但也不会刻意靠近。' + simName + '上的共鸣够用，' + diffName + '上的差距也在可容忍范围。',
        + (lowStr ? lowStr + '。不过你们在「' + simName + '」上的交集足够维持基本的舒适，这样也挺好。' : targetName + '跟你在「' + simName + '」上的交集让你们至少不会互相讨厌，至于其他的——随缘。'),
        '不咸不淡，不近不远。你和' + targetName + '的关系大概就是这样——「' + simName + '」够你们维持表面的融洽，但「' + diffName + '」让你们不会走得太深。'
      ],
      2: [
        '你和' + targetName + '在「' + diffName + '」上的差异比较大，大到偶尔会互相踩到对方看不见的线。好在「' + simName + '」上你们还能撑住，但这个支撑点不够多。维持这段关系需要额外耐心。',
        '不太省心的组合。"' + diffName + '"的错位让你和' + targetName + '容易误解对方的意图，而"' + simName + '"的共同点不足以完全弥补。如果双方都有心可以磨合——但磨合本身就不轻松。',
        '你们的「' + diffName + '」维度几乎处于两个方向，这让你的本能反应和' + targetName + '的经常撞车。' + simName + '上仅存的共识需要被珍视，相处需要双方都愿意多走一步。',
        '你可能会发现，和' + targetName + '相处需要处理比平常更多的摩擦。' + diffName + '上的分歧让你们看事情的角度差很多，' + simName + '上的共鸣是你维系这段关系的理由。',
        + (highStr ? highStr + '，' : '') + (lowStr ? lowStr + '。' : '') + '这些落差让你们的互动需要更多润滑。和' + targetName + '的关系不是不行，但确实需要双方多花心思。',
        '你们像两台出厂设置不同的机器——在「' + diffName + '」上尤其明显。你想的ta不一定理解，ta做的你不一定认可。不过' + simName + '上的共识至少让你们还有对话的基础。',
        '和' + targetName + '的关系需要"翻译"。你们的核心分歧在「' + diffName + '」——你觉得理所当然的事，对ta来说可能不在同一套坐标系里。这需要耐心，但也未必不可调和。'
      ],
      1: [
        '在「' + diffName + '」上，你和' + targetName + '几乎位于两极。你们的本能反应互相刺激——一个向左一个向右，双方都很难理解对方为什么那么选。相处成本很高。',
        '火星撞地球的组合。你和' + targetName + '在「' + diffName + '」维度上完全相反，每一次互动都可能踩雷。不是谁错了，而是你们的出厂设置在这个维度上互斥。慎重。',
        '你们的核心矛盾在「' + diffName + '」——你觉得理所当然的事，对' + targetName + '来说可能完全无法理解。这不是光靠沟通能解决的，因为你们从"什么是正常的"开始就不一样。',
        '和' + targetName + '的关系需要你有极大的包容度。你们的「' + diffName + '」差距太大，大到日常互动都可能变成消耗战。' + simName + '上的一点点共识是你的救命稻草。',
        '你面对' + targetName + '时可能会发现，自己从未遇到过这么难"对齐"的人。' + diffName + '上的极端差异让你们在每个岔路口都往相反方向走。如果一定要维持，需要双方极强意愿。',
        '这是那种"费力不讨好"的组合。你和' + targetName + '在「' + diffName + '」上的根本差异，让每一次沟通都像在翻译一门你不太会的语言。珍惜' + simName + '上那点仅存的交集吧。',
        targetName + '可能是你最需要心理准备的那种关系。' + diffName + '上的冲突几乎无法避免，别指望时间能自动抹平——需要双方都做出实质性的调整才可能平稳。'
      ]
    };

    var pool = templates[level] || templates[3];
    return pool[hash % pool.length];
  }

  // ==========================================
  // 获取配对数据（优先自定义）
  // ==========================================
  function getPairData(a, b) {
    var score = calcBaseScore(a, b);
    var level = scoreToLevel(score);
    var desc = generateDesc(a, b, level, score);
    return { level: level, score: score, desc: desc };
  }

  // ==========================================
  // 渲染
  // ==========================================
  var currentUserPersona = null;

  function render(userPersona) {
    currentUserPersona = userPersona;

    // 用户卡片
    document.getElementById('userName').textContent = userPersona.name;
    document.getElementById('userKnife').textContent = userPersona.knife;
    var userCard = document.getElementById('userCard');
    if (userPersona.isEasterEgg) {
      userCard.classList.add('rare');
    } else {
      userCard.classList.remove('rare');
    }

    // 计算与其他15人的适配度
    var others = [];
    for (var key in PERSONAS) {
      if (!PERSONAS.hasOwnProperty(key)) continue;
      if (PERSONAS[key].name === userPersona.name) continue;
      var pairData = getPairData(userPersona, PERSONAS[key]);
      others.push({
        persona: PERSONAS[key],
        level: pairData.level,
        score: pairData.score || 0,
        desc: pairData.desc
      });
    }

    // 按适配度降序
    others.sort(function (x, y) { return y.level * 100 + y.score - (x.level * 100 + x.score); });

    // 渲染卡片网格
    var listEl = document.getElementById('compList');
    var html = '';
    for (var i = 0; i < others.length; i++) {
      var o = others[i];
      var cfg = LEVEL_CONFIG[o.level];
      var cls = cfg.cls;
      html +=
        '<div class="comp-card ' + cls + '" style="animation-delay:' + (i * 0.03) + 's" data-idx="' + i + '">' +
        '<img class="comp-portrait" src="人格画像/' + encodeURIComponent(o.persona.name) + '.jpg" alt="' + o.persona.name + '" loading="lazy">' +
        '<div class="comp-body">' +
        '<div class="comp-rank">' +
        '<span class="rank-emoji">' + cfg.emoji + '</span>' +
        '<span class="rank-label">' + cfg.label + '</span>' +
        '<span class="comp-score-badge">' + (o.score || '--') + '%</span>' +
        '</div>' +
        '<div class="comp-target-name">' + o.persona.name + '</div>' +
        '<div class="comp-desc">' + o.persona.knife + '</div>' +
        '</div>' +
        '<div class="comp-detail">' + o.desc + '</div>' +
        '</div>';
    }
    listEl.innerHTML = html;

    // 绑定点击 — 手机弹窗 / 桌面展开
    var cards = listEl.querySelectorAll('.comp-card');
    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener('click', function () {
        if (IS_MOBILE) {
          showDetailModal(this);
        } else {
          this.classList.toggle('expanded');
        }
      });
      cards[j].addEventListener('touchend', function(e) {
        e.preventDefault();
        if (IS_MOBILE) {
          showDetailModal(this);
        } else {
          this.classList.toggle('expanded');
        }
      });
    }
  }

  // 手机端：详情弹窗
  function showDetailModal(card) {
    var name = card.querySelector('.comp-target-name').textContent;
    var imgSrc = card.querySelector('.comp-portrait').src;
    var rankHTML = card.querySelector('.comp-rank').innerHTML;
    var detail = card.querySelector('.comp-detail').textContent;

    var overlay = document.createElement('div');
    overlay.className = 'comp-modal-overlay';
    overlay.innerHTML =
      '<div class="comp-modal-card">' +
      '<button class="comp-modal-close">&times;</button>' +
      '<img class="comp-modal-portrait" src="' + imgSrc + '" alt="' + name + '">' +
      '<h3 class="comp-modal-name">' + name + '</h3>' +
      '<div class="comp-modal-rank">' + rankHTML + '</div>' +
      '<div class="comp-modal-detail">' + detail + '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    requestAnimationFrame(function () {
      overlay.classList.add('active');
    });

    function close() {
      overlay.classList.remove('active');
      overlay.addEventListener('transitionend', function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      });
    }
    overlay.querySelector('.comp-modal-close').addEventListener('click', close);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) close();
    });
    overlay.addEventListener('touchend', function(e) {
      if (e.target === overlay) { e.preventDefault(); close(); }
    });
  }

  // ==========================================
  // 启动
  // ==========================================
  function init() {
    console.log('[适配度页] init() 开始');

    // 安全读取 localStorage
    var answersJson = null;
    try { answersJson = localStorage.getItem('sbtest_answers'); } catch(e) { console.error('[适配度页] localStorage 读取失败:', e); }
    console.log('[适配度页] localStorage 数据:', answersJson ? '有(' + answersJson.length + '字符)' : '空');

    var personaName = null;

    if (answersJson) {
      // 复用 result.js 的匹配逻辑（简化版）
      var answers;
      try { answers = JSON.parse(answersJson); console.log('[适配度页] JSON解析成功, 答案数:', answers.length); }
      catch(e) { console.error('[适配度页] JSON解析失败:', e); answers = null; }

      if (answers && Array.isArray(answers) && answers.length > 0) {
        try {
          var SCORE_MATRIX = [
        [{A:3,S:2}, {A:2,E:2}, {E:2,O:1}, {A:1,I:-2}],
        [{E:2,O:-2}, {O:2,I:1}, {E:2,O:2}, {E:2,O:-2}],
        [{E:-2,A:-2}, {E:2,S:2,I:1}, {O:2,E:1}, {I:2,E:1}],
        [{S:2,A:1}, {D:2,E:1}, {S:-2,I:-2}, {E:2,S:2}],
        [{S:-2,I:-2}, {A:2,S:1}, {E:2,O:2}, {S:-2,O:2}],
        [{O:2,I:0}, {E:2,O:-2}, {I:1,O:2}, {D:2,E:2}],
        [{O:2,I:-2}, {O:-2}, {A:2,O:2}, {I:2}],
        [{D:3,E:2}, {D:1,I:-2}, {D:2,E:-2}, {D:-3}],
        [{S:3,I:2}, {S:-2,I:-2}, {S:1,A:1}, {D:2,S:-2}],
        [{E:2,O:-2}, {D:3}, {S:2,E:2}, {O:2,I:-2}],
        [{A:1,E:1,I:-2}, {I:2,E:2}, {A:-2,I:1}, {A:2,O:2}],
        [{S:2,E:2}, {S:-2,A:-2}, {D:2,E:2}, {O:1,I:1}],
        [{I:2}, {A:1,S:1}, {I:-2,S:-2}, {I:0,A:-2}],
        [{I:3,E:2}, {I:1,A:1}, {I:-2,E:-2}, {I:2,O:2}],
        [{E:2,S:2}, {E:-2,I:-2}, {E:-2,S:-2}, {D:1,E:1}],
        [{A:1,O:1,I:1}, {O:2,I:2,S:-2}, {S:3,I:2}, {S:-2,I:-2}],
        [{I:2,S:2}, {O:2,I:1}, {I:-2,E:1}, {I:-2,E:2}],
        [{O:2}, {O:0}, {I:2}, {O:-2}],
        [{D:2,E:2,O:-2}, {S:2,E:1}, {I:2,E:1}, {I:-2,O:2}],
        [{S:-2,I:1}, {S:1,I:2}, {D:2,E:2,I:1}, {O:-2,I:-2}],
        [{O:2,I:2}, {O:-2,I:-2}, {D:2,S:-2}, {E:1,O:-2}],
        [{E:2,S:2}, {S:-2,I:-2}, {E:1,O:2}, {I:-2,E:1}],
        [{S:2,E:2}, {S:-2,D:2}],
        [{A:2,O:2}, {A:-2,I:2}],
        [{E:2,I:-2}, {I:2,E:2}],
        [{A:2,E:2,O:-2}, {S:2,E:2}, {S:-2,I:-2}, {D:1,O:-2}],
        [{A:2,I:1}, {I:2,E:2}, {O:1,I:1}, {E:2,O:-2}],
        [{E:2,D:1,O:-2}, {O:2,I:-2}, {E:2,S:1}, {O:2,S:-2}],
        [{E:2,S:2}, {A:2,E:2}, {I:-2,S:-2}, {O:2,I:-2}],
        [{A:2,E:1}, {E:2,O:2}, {I:-2,S:-2,O:1}, {S:-2,O:2,I:1}]
      ];

      var raw = { A: 0, E: 0, S: 0, D: 0, O: 0, I: 0 };
      for (var q = 0; q < answers.length; q++) {
        var opt = answers[q];
        if (opt == null) continue;
        var map = SCORE_MATRIX[q][opt];
        if (!map) continue;
        var mult = 1;
        if (q >= 27 && q <= 29) mult = 1.5;
        for (var dim in map) {
          if (raw.hasOwnProperty(dim)) raw[dim] += map[dim] * mult;
        }
      }

      var stdDevs = { A: 3.7, E: 5.1, S: 5.9, D: 3.7, O: 5.6, I: 6.6 };
      var centers = { A: 4.5, E: 17.9, S: -0.3, D: 6.5, O: 6.5, I: -3.2 };
      var scores = {};
      for (var d in raw) {
        var z = (raw[d] - centers[d]) / stdDevs[d];
        scores[d] = Math.round((1 / (1 + Math.exp(-z))) * 100);
      }

      // 朱之文检测
      if (scores.A >= 70 && scores.I <= 30 && answers[23] === 0 && answers[10] === 3 && answers[24] === 0) {
        personaName = '朱之文';
      } else {
        // MBTI+Euclidean混合匹配（与result.js一致）
        var dims = ['A','E','S','D','O','I'];
        var bestScore = -Infinity, bestKey = null;
        for (var k in PERSONAS) {
          if (!PERSONAS.hasOwnProperty(k)) continue;
          var p = PERSONAS[k];
          if (p.isEasterEgg) continue;
          // Euclidean相似度
          var sumSq = 0;
          for (var ii = 0; ii < dims.length; ii++) {
            sumSq += Math.pow(scores[dims[ii]] - p.profile[dims[ii]], 2);
          }
          var euclidSim = Math.max(0, 100 - Math.sqrt(sumSq) * 0.43);
          // 分类匹配bonus
          var catBonus = 0;
          for (var jj = 0; jj < dims.length; jj++) {
            if (classifyCategory(scores[dims[jj]]) === classifyCategory(p.profile[dims[jj]])) {
              catBonus += 2;
            }
          }
          var totalScore = euclidSim + catBonus;
          if (totalScore > bestScore) { bestScore = totalScore; bestKey = k; }
        }
          personaName = bestKey || '血包';
          console.log('[适配度页] 匹配人格:', personaName);
        }
        } catch(e) { console.error('[适配度页] 计算/匹配失败:', e); personaName = null; }
      }
    }

    if (!personaName) { console.warn('[适配度页] 无有效答案，使用兜底人格'); personaName = '血包'; }
    var userPersona = PERSONAS[personaName] || PERSONAS['血包'];
    try { render(userPersona); console.log('[适配度页] render() 成功'); } catch(e) { console.error('[适配度页] render() 失败:', e); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
