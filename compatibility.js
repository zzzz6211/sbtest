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
  // 手工定义的关键配对（覆盖距离算法）
  // 所有描述从"你"（答题者）视角出发，描述你与对方的关系
  // key = id小-id大，desc 为对称视角，无论谁是"你"都成立
  // ==========================================
  var CUSTOM_PAIRS = {
    // === 💞绝配 ===
    '1-13': { level: 5, desc: '两个治愈系灵魂相遇。你们互相懂得彼此的付出，也珍惜对方的善良。你们是彼此的充电器，也是彼此的防空洞。唯一要注意的是——两个人都不会求助，都怕给对方添麻烦。' },
    '1-9':  { level: 5, desc: '纯粹遇到纯粹，不需要防备。你们在「利他」维度高度共鸣，对方身上那种不设防的真诚让你觉得安心。彼此的稳定和细腻，恰好是对方最需要的温度。' },
    '4-8':  { level: 5, desc: '"天塌了关我什么事"遇上"这是好事儿啊"——你们的乐观叠加出了奇妙的化学反应。周围人觉得你们心太大，你们觉得周围人活得太紧。两个松弛灵魂的梦幻联动。' },
    '8-16': { level: 5, desc: '乐观悍匪遇上快乐批发商——你们不是互补，是共振。你们共享极高的「乐观」和「社交」能量，走到哪空气都在变轻。一起出现的时候，房间的快乐密度翻倍。' },
    '2-16': { level: 5, desc: '你们的「外显」和「乐观」维度高度匹配，像两台火力全开的快乐引擎。一个情绪来得快去得快，一个永远在找快乐素材——在一起就是连续剧，每天都有新剧情。' },
    '1-12': { level: 5, desc: '两个自带治愈光环的人。你们在「利他」维度心意相通，不刻意付出却恰好在给予，不刻意靠近却自然吸引。你们在一起形成了温暖的引力场，能量在彼此之间双向流动。' },

    // === ⭐⭐⭐很合 ===
    '5-14': { level: 4, desc: '一个嘴上说"都行"心里有本账，一个什么都看在眼里什么都不说。你们的默契在沉默里生长，不需要解释太多。唯一要留意的是——太舒服的沉默，偶尔会忘了主动沟通。' },
    '3-10': { level: 4, desc: '你们都能理解"线上和线下不是同一个人"的感觉。最好的深夜聊天搭子——白天各自面对现实，晚上在屏幕后找到完整的自己。这种互相理解不用多解释。' },
    '11-2': { level: 4, desc: '两个人都需要舞台。你们的「外显」能量互相激发，在一起永远不无聊——都能把一分钟的事演成一集。只是周围观众偶尔会觉得：这俩人怎么每件事都能演起来。' },
    '7-2':  { level: 4, desc: '两个情绪充沛的人。一个倾向于憋着，一个倾向于释放。奇妙的是，你们能帮对方踩到那个对方踩不到的刹车——帮对方找到出口，也让对方学会克制。你们理解那种"我也不想但我控制不住"。' },
    '12-16':{ level: 4, desc: '团宠和快乐源泉的组合。你们在「社交」维度上如鱼得水——你在的地方自然有人靠近，ta在的地方自然有笑声。你们在一起就是朋友圈的官方认证治愈站。' },
    '13-9': { level: 4, desc: '两个善良到骨子里的人。你们在「利他」和「乐观」上高度一致，彼此的善意互相印证——让对方相信，善良从来不是软弱。你们在一起的时候，世界都温柔了三个度。' },

    // === ⭐⭐随缘 ===
    '3-14': { level: 3, desc: '一个活在线上，一个习惯观察。你们互不妨碍——你在数字世界游刃有余，ta在旁边安静存在。关系像认识很久的网友，现实中碰面也不会尴尬，反而有种意料之外的舒服。' },
    '4-14': { level: 3, desc: '一个懒得参与，一个选择旁观。你们对热闹的态度出奇一致——都不太需要。在一起时空气是安静的，但这种安静是一种共谋般的舒适，不勉强，不尴尬。' },
    '6-7':  { level: 3, desc: '你们容易形成"吐槽联盟"——话题越骂越上头。有共同的发泄出口是好事，但骂完之后什么都没解决。挺爽的，偶尔来一下可以，别当日常。' },
    '10-12':{ level: 3, desc: '你的敏感能感知到ta的情绪微调，ta的亲和力让你觉得安全。你们之间有一种建立在脆弱之上的温柔连接——不用很多话，但很真实。' },

    // === ⚡有摩擦 ===
    '2-6':  { level: 2, desc: '你们的沟通方式容易互相触发。一个人放狠话但五秒就后悔，另一个人已经开始逐条分析你五秒前说的话。你们的「烈度」维度差异让每次争论都可能升级——需要双方都学会刹车。' },
    '1-7':  { level: 2, desc: '你把情绪吞回去内耗，ta把情绪积起来等爆发。你们处理情绪的方式几乎相反——你的隐忍在ta看来不够直接，ta的爆发在你看来不够克制。同样的痛苦，完全相反的出口。' },
    '11-14':{ level: 2, desc: '你需要观众，ta需要隐身。你的「外显」和ta的「社交」能量处于两个极端——你在前面发光，ta在角落观察。你们活在同一个空间但完全不同的频道，互相理解需要额外努力。' },
    '5-6':  { level: 2, desc: '你说"确实"的时候ta在想你说的哪里不对。你的糊弄在ta面前会失效——ta会追问你到底什么意思。而你真的不想解释，因为你也不知道。你们的沟通需要翻译器。' },

    // === 💥高危 ===
    '1-6':  { level: 1, desc: '你的「利他」和ta的「烈度」形成尖锐对比——你的善意在ta眼里可能被解读为别有用心。你付出时ta质疑动机，你沉默时ta觉得你在阴阳怪气。沟通成本极高，需要双方都有极强的意愿才可能平衡。' },
    '7-10': { level: 1, desc: '你们在「烈度」和「外显」上的错位是最危险的组合——ta的情绪爆发会震碎你的敏感神经，而你的脆弱在ta看来可能难以理解。你们的情绪频率完全错位，相处需要十二分的谨慎和意愿。' },
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
