/**
 * 承认吧，你就是_____ — 适配度引擎
 * 16种人格 × 15组配对 = 120组关系
 * 维度距离 + 特殊规则 → 5级适配度
 */
(function () {
  'use strict';

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
  // 手工定义的关键配对（覆盖距离算法）
  // key = id小-id大
  // ==========================================
  var CUSTOM_PAIRS = {
    // === 💞绝配 ===
    '1-13': { level: 5, desc: '两个治愈系灵魂相遇。你懂她的付出，她惜你的善良。你们是彼此的充电器，也是彼此的防空洞。唯一的风险是——两个人都不会求助，都以为对方不需要被照顾。' },
    '1-9':  { level: 5, desc: '纯善遇纯善，不需要防备。你是少数能真正理解他那种真诚的人。他的稳定是你最需要的港湾，而你的细腻是他从未体验过的温暖。' },
    '4-8':  { level: 5, desc: '一个什么都不在乎，一个什么都能转化成好事。你们在一起就是"天塌了关我什么事"×"这是好事儿啊"的梦幻组合。周围人觉得你们疯了，你们觉得周围人太紧。' },
    '8-16': { level: 5, desc: '乐观悍匪遇上快乐批发商——你们不是互补，你们是叠加。你负责把坏事转化成"这是好事儿"，她负责把好事转化成梗。一起出现的时候，房间的亮度翻倍。' },
    '2-16': { level: 5, desc: '一个情绪来得快去得快，一个永远在找快乐素材。你们之间不会有冷场——因为一个人的后悔正好是另一个人的梗。你们在一起就是连续剧，每天都有新剧情。' },
    '1-12': { level: 5, desc: '两个天生自带治愈光环的人。你不求回报地给予，她不经意地吸引。你们在一起形成了温暖的引力场——周围的人都能感受到，但你们彼此给予的能量是双向的。' },

    // === ⭐⭐⭐很合 ===
    '5-14': { level: 4, desc: '一个嘴上说都行心里有本账，一个什么都看见了什么都不说。你们互相不需要解释太多，默契在沉默里生长。但你们都需要提防——太舒服的沉默，可能会忘了沟通。' },
    '3-10': { level: 4, desc: '你在网上飞，她在现实里碎。你们互相理解那种"线上和线下不是同一个人"的感觉。你们是最好的深夜聊天搭子——白天各自破碎，晚上在屏幕后完整。' },
    '11-2': { level: 4, desc: '两个人都需要观众。你是聚光灯，她是即兴演员。你们在一起永远不无聊——因为两个人都能把一分钟演成一集。只是观众有时候会觉得有点累。' },
    '7-2':  { level: 4, desc: '两个人都容易被情绪带着走。你憋着，她发泄。她帮你找到出口，你让她学会刹车。你们理解彼此那种"我也不想这样但我控制不住"的感觉。' },
    '12-16':{ level: 4, desc: '团宠和快乐源泉的组合。你什么都不做就有人靠近，她什么都不做就能让人笑。你们在一起是朋友圈的官方指定治愈站。' },
    '13-9': { level: 4, desc: '两个善良到骨子里的人。你的使命感和他的淳朴互相印证——你们让对方相信，善良不是软弱。你们在一起，世界都温柔了三个度。' },

    // === ⭐⭐随缘 ===
    '3-14': { level: 3, desc: '一个活在线上，一个活在暗处。你们互相不妨碍——你发你的朋友圈，他默默点赞。你们的关系像网友，但现实中碰面的时候，其实也挺舒服。' },
    '4-14': { level: 3, desc: '一个懒得参与，一个选择旁观。你们对热闹的态度出奇一致——都不太需要。在一起的时候，空气是安静的，但这种安静不尴尬，是一种共谋般的舒适。' },
    '6-7':  { level: 3, desc: '一个在嘴上报复世界，一个在心里报复世界。你们在一起容易形成"吐槽联盟"——话题越骂越上头，但骂完之后，其实什么都没解决。挺爽的，但不太健康。' },
    '10-12':{ level: 3, desc: '她碎的时候你能接住。你的敏感让你能感知到她的情绪微调，而她的亲和力让你觉得安全。你们之间有一种脆弱但温柔的连接。' },

    // === ⚡有摩擦 ===
    '2-6':  { level: 2, desc: '你说狠话她当真，她反驳你你就更来劲。你们吵架的画风是：一个人放了狠话五秒后后悔，另一个人已经在逐条反驳你五秒前说的话。' },
    '1-7':  { level: 2, desc: '你把情绪吞回去烧自己，他把情绪积起来等爆发。你的隐忍在他看来是"不够真实"，他的爆发在你看来是"不懂得克制"。你们能为同一种痛苦找到完全相反的应对方式。' },
    '11-14':{ level: 2, desc: '你需要观众，他需要隐身。你在前面表演，他在后面观察。你觉得他不参与，他觉得你太吵闹。你们活在同一个空间，但完全不同的频道。' },
    '5-6':  { level: 2, desc: '你说"确实"的时候他在想你说的哪里不对。你的糊弄在他面前会失效——他会追问你到底什么意思。而你真的不想解释，因为你也不知道。' },

    // === 💥高危 ===
    '1-6':  { level: 1, desc: '你的善意在他眼里是"说清楚你想干嘛"。你付出，他质疑你的动机。你累了不会说，他觉得你阴阳怪气。你们的沟通需要翻译器——而且翻译器也在吵架。' },
    '7-10': { level: 1, desc: '你的爆发会把她震碎。她的敏感会被你的压抑误解为"太矫情"。你们是真正的危险组合——不是因为谁坏，而是你们的情绪频率完全错位。你炸的时候她在扫玻璃碴。' },
  };

  // 规范化配对 key
  function pairKey(a, b) {
    var ids = [a.id, b.id].sort(function (x, y) { return x - y; });
    return ids[0] + '-' + ids[1];
  }

  // ==========================================
  // 适配度计算引擎
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
    var raw = Math.max(0, 100 - dist * 0.41);

    // === MBTI式分类匹配bonus (每共享维度类别+3, 最多+18) ===
    for (var j = 0; j < DIMS.length; j++) {
      if (classifyCategory(a.profile[DIMS[j]]) === classifyCategory(b.profile[DIMS[j]])) {
        raw += 3;
      }
    }

    // === 维度互动修正 ===
    // 双高 A（都是付出型）：互相理解 +8
    if (a.profile.A > 65 && b.profile.A > 65) raw += 8;
    // 高A遇低A（付出 vs 索取）：张力 -10
    if ((a.profile.A > 70 && b.profile.A < 30) || (b.profile.A > 70 && a.profile.A < 30)) raw -= 10;
    // 双高 I（都是暴脾气）：互相点燃 -8
    if (a.profile.I > 65 && b.profile.I > 65) raw -= 8;
    // 双高 O（乐观叠加）：好上加好 +6
    if (a.profile.O > 65 && b.profile.O > 65) raw += 6;
    // 高低 O（乐观 vs 悲观）：理解成本 -5
    if ((a.profile.O > 70 && b.profile.O < 25) || (b.profile.O > 70 && a.profile.O < 25)) raw -= 5;
    // 双低 E（都内向）：舒适安静 +5
    if (a.profile.E < 30 && b.profile.E < 30) raw += 5;
    // 双高 S（都社交）：派对联动 +5
    if (a.profile.S > 65 && b.profile.S > 65) raw += 5;
    // 高低 S（社交 vs 社恐）：一方压力 -4
    if ((a.profile.S > 70 && b.profile.S < 25) || (b.profile.S > 70 && a.profile.S < 25)) raw -= 4;

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
  // 自动生成描述
  // ==========================================
  function generateDesc(a, b, level, score) {
    // 找出最大差异和最大相似
    var maxDiffDim = '', maxDiffVal = 0;
    var maxSimDim = '', maxSimVal = 100;
    for (var i = 0; i < DIMS.length; i++) {
      var d = Math.abs(a.profile[DIMS[i]] - b.profile[DIMS[i]]);
      if (d > maxDiffVal) { maxDiffVal = d; maxDiffDim = DIMS[i]; }
      if (d < maxSimVal) { maxSimVal = d; maxSimDim = DIMS[i]; }
    }

    var diffName = DIM_NAMES[maxDiffDim];
    var simName = DIM_NAMES[maxSimDim];

    // 根据维度和等级生成描述模板
    var templates = {
      5: [
        '你们在「' + simName + '」上惊人地同频，又在「' + diffName + '」上恰到好处地互补。这种关系不费力气——两个人站在一起，就已经是最好的状态。',
        '灵魂级别的默契。你们不需要解释太多，对方已经懂了。尤其是「' + simName + '」这个维度，你们的频率完全一致。这是那种"认识很久了吗？才三天"的关系。',
        '一个眼神就够。你们在「' + simName + '」维度高度一致，连沉默都是舒服的。哪怕在「' + diffName + '」上有些不同，也都成了加分项。'
      ],
      4: [
        '你们在「' + simName + '」上很有共鸣，聊得来、处得舒服。在「' + diffName + '」上的差异让你们互相补位。偶尔有点小摩擦，但都在"不算事儿"的范围内。',
        '很合拍的组合。你们共享的「' + simName + '」让你们在一起很开心，不同的「' + diffName + '」反而让彼此学到了对方的视角。大部分时候，你们是对方的加分项。',
        '可以长期相处的关系。「' + simName + '」上的默契让你们省了很多解释，而「' + diffName + '」的不同只需要一点理解就能跨过去。'
      ],
      3: [
        '你们在「' + simName + '」上没什么矛盾，这让基本相处不成问题。但「' + diffName + '」上的差异意味着你们可能需要多花一点时间理解对方的脑回路。不算差，看缘分。',
        '中规中矩的关系。不会特别来电，也不会特别难受。你们在「' + simName + '」上能和平共处，至于「' + diffName + '」——只能说，尊重差异也是一种相处之道。',
        '能做朋友。"' + simName + '"让你们有共同语言，但"' + diffName + '"上的距离让你们有时候像在两个频道。不是谁的问题，就是频道不一样。'
      ],
      2: [
        '你们在「' + diffName + '」上的差异太大了，大到偶尔会互相踩到对方看不见的线。在「' + simName + '」上你们还能撑住，但这个支撑点不够多。维持这段关系需要额外的耐心。',
        '不太省心的组合。"' + diffName + '"的错位让你们容易误解对方的意图，而"' + simName + '"的共同点不足以弥补。如果双方都有心，可以磨合——但磨合本身就不容易。',
        '你们看待世界的角度不太一样，尤其是「' + diffName + '」这一块。不是不能相处，但需要双方都愿意多走一步。如果只有一方在走，这段关系会很累。'
      ],
      1: [
        '在「' + diffName + '」上你们几乎位于两极。你们的本能反应会互相刺激——一个向左一个向右，而且双方都不是太理解对方为什么那么选。相处成本很高，需要双方都有极强的意愿才可能平衡。',
        '火星撞地球的组合。不是你们谁错了，而是你们的出厂设置在「' + diffName + '」这个维度上完全相反。每一次互动都可能踩雷，雷区比安全区大。慎重。',
        '你们的核心矛盾在「' + diffName + '」——一个觉得理所当然的事，对另一个来说可能完全无法理解。这不是沟通能解决的，因为你们从"什么是正常的"开始就不一样。'
      ]
    };

    var pool = templates[level] || templates[3];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ==========================================
  // 获取配对数据（优先自定义）
  // ==========================================
  function getPairData(a, b) {
    var key = pairKey(a, b);
    var custom = CUSTOM_PAIRS[key];
    if (custom) return custom;

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

    // 渲染列表
    var listEl = document.getElementById('compList');
    var html = '';
    for (var i = 0; i < others.length; i++) {
      var o = others[i];
      var cfg = LEVEL_CONFIG[o.level];
      var cls = cfg.cls;
      html +=
        '<div class="comp-card ' + cls + '" style="animation-delay:' + (i * 0.04) + 's" data-idx="' + i + '">' +
        '<div class="comp-rank">' +
        '<span class="rank-emoji">' + cfg.emoji + '</span>' +
        '<span class="rank-label">' + cfg.label + '</span>' +
        '</div>' +
        '<img class="comp-portrait" src="人格画像/' + encodeURIComponent(o.persona.name) + '.jpg" alt="' + o.persona.name + '">' +
        '<div class="comp-info">' +
        '<div class="comp-target-name">' + o.persona.name + '</div>' +
        '<div class="comp-desc">' + o.desc + '</div>' +
        '</div>' +
        '<div class="comp-score-badge">' + (o.score || '--') + '%</div>' +
        '</div>';
    }
    listEl.innerHTML = html;

    // 绑定点击展开（移动端）
    var cards = listEl.querySelectorAll('.comp-card');
    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener('click', function () {
        this.classList.toggle('expanded');
      });
      cards[j].addEventListener('touchend', function(e) {
        e.preventDefault();
        this.classList.toggle('expanded');
      });
    }
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
        [{E:-2,A:-2}, {E:2,S:2}, {O:2,E:1}, {I:-2,E:1}],
        [{S:2,A:1}, {D:2,E:1}, {S:-2,I:-2}, {E:2,S:2}],
        [{S:-2,I:-2}, {A:2,S:1}, {E:2,O:2}, {S:-2,O:2}],
        [{O:2,I:0}, {E:2,O:-2}, {I:1,O:2}, {D:2,E:2}],
        [{O:2,I:-2}, {E:2,O:-2}, {A:2,O:2}, {I:2,E:2}],
        [{D:3,E:2}, {D:1,I:-2}, {D:2,E:-2}, {D:-3}],
        [{S:3,I:2}, {S:-2,I:-2}, {S:1,A:1}, {D:2,S:-2}],
        [{E:2,O:-2}, {D:3}, {S:2,E:2}, {O:2,I:-2}],
        [{A:1,E:1,I:-2}, {I:2,E:2}, {A:-2,I:1}, {A:2,O:2}],
        [{S:2,E:2}, {S:-2,A:-2}, {D:2,E:2}, {O:1,I:1}],
        [{I:2,E:2}, {A:1,S:1}, {I:-2,S:-2}, {I:0,A:-2}],
        [{I:3,E:2}, {I:1,A:1}, {I:-2,E:-2}, {I:2,O:2}],
        [{E:2,S:2}, {E:-2,I:-2}, {E:-2,S:-2}, {D:1,E:1}],
        [{A:1,O:1}, {O:2,I:1,S:-2}, {S:3,I:1}, {S:-2,I:-2}],
        [{I:2,S:2}, {O:2,I:1}, {I:-2,E:1}, {I:-2,E:2}],
        [{O:2,E:-2}, {E:0,O:0}, {E:3,I:2}, {E:1,O:-2}],
        [{D:2,E:2,O:-2}, {S:2,E:1}, {I:2,E:1}, {I:-2,O:2}],
        [{S:-2,I:-2}, {S:1,I:1}, {D:2,E:2}, {O:-2,I:-2}],
        [{O:2,I:2}, {O:-2,I:-2}, {D:2,S:-2}, {E:1,O:-2}],
        [{E:2,S:2}, {S:-2,I:-2}, {E:1,O:2}, {I:-2,E:1}],
        [{S:3,E:3}, {S:-3,D:3}],
        [{A:3,O:3}, {A:3,I:3}],
        [{E:3,I:-3}, {I:3,E:3}],
        [{A:2,E:2,O:-2}, {S:2,E:2}, {S:-2,I:-2}, {D:1,O:-2}],
        [{A:2,I:-2}, {I:2,E:2}, {O:1,I:-2}, {E:2,O:-2}],
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
        if (q >= 22 && q <= 24) mult = 1.5;
        if (q >= 27 && q <= 29) mult = 1.5;
        for (var dim in map) {
          if (raw.hasOwnProperty(dim)) raw[dim] += map[dim] * mult;
        }
      }

      var stdDevs = { A: 2.0, E: 3.4, S: 4.2, D: 2.3, O: 3.6, I: 4.4 };
      var centers = { A: 9.5, E: 26.1, S: -0.9, D: 8.1, O: 9.1, I: -4.4 };
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
          var euclidSim = Math.max(0, 100 - Math.sqrt(sumSq) * 0.41);
          // 分类匹配bonus
          var catBonus = 0;
          for (var jj = 0; jj < dims.length; jj++) {
            if (classifyCategory(scores[dims[jj]]) === classifyCategory(p.profile[dims[jj]])) {
              catBonus += 4;
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
