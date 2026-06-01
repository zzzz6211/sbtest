/**
 * 承认吧，你就是_____ — 结果页逻辑
 * v20260531 — MBTI+Euclidean混合匹配(L/M/H分类bonus+Euc距离,阈值30/70)
 */
(function () {
  'use strict';

  var DIM_LABELS = { A: '利他', E: '外显', S: '社交', D: '数字', O: '乐观', I: '烈度' };
  var DIM_COLORS = { A: '#c084fc', E: '#f9a8d4', S: '#7ec8c0', D: '#a78bfa', O: '#67e8f9', I: '#f472b6' };

  var PERSONAS = {
    '血包': {id:1,name:'血包',knife:'别人的情绪垃圾桶，自己的电量永远1%。',desc:'你有一种本能，叫"见不得别人难过"。朋友深夜说"好烦"，你能陪到天亮；同事情绪不对，你会主动问"怎么了"。你不是没有脾气，你是把脾气都咽回去给了自己。大家叫你小太阳，但太阳也有耗尽的时候，只是你不说而已。你最常做的事，是在别人崩溃之后，独自收拾自己的情绪残局。你知道你在讨好，你只是停不下来。',emotion:'你对他人情绪的感知力接近雷达级别，却对自己的情绪近乎麻木。你的共情是一种本能而非选择——你无法对他人的痛苦视而不见，即使你自己已经空了。你的情绪能量几乎全部向外输出，很少向内补给。危险在于：当所有人都习惯被你的光照亮，没有人注意到灯本身已经快没油了。',tags:['讨好型人格晚期','治愈系但自己没人治','最后一个崩溃的人'],fun:'打野别吃我血包啊！！',profile:{A:85,E:70,S:50,D:18,O:28,I:18}},
    '五秒真男(女)人': {id:2,name:'五秒真男(女)人',knife:'你的后悔频率，比你愿意承认的高得多。',desc:'你说话的时候是认真的，五秒后反悔也是真的。你说过"绝对不可能"的事，你做了；你说过"这辈子不联系"的人，你发消息了；你说过"我不在乎"，然后在乎得睡不着。你把这叫做活得真实，也行。只是你身边的人已经不太当真你说的话了，包括那些"我爱你"。',emotion:'你的情绪没有中间档，要么全开要么全关。高兴是真的高兴，愤怒是真的愤怒，后悔也是真的后悔——每一次都像第一次。你不是善变，是你的情绪反应速度远超你的理性刹车系统。后悔是你最熟悉的情绪之一，但你很少从中提取教训，因为下一次情绪来了，你还是会再走一遍同样的路。',tags:['真香定律受害者','狠话打折出售','说到不一定做到'],fun:'5s，就5s？！？！',profile:{A:28,E:90,S:62,D:10,O:50,I:90}},
    '电子蝴蝶': {id:3,name:'电子蝴蝶',knife:'赛博世界翩翩飞舞，一关屏幕就碎成像素。',desc:'你的灵魂有一半活在数字世界里。你的朋友圈是精心策划的艺术展，你的深夜文字打动了很多人，你网上的状态和现实有一种奇妙的割裂——网上的你美得像蝴蝶，现实里的你脆得像玻璃。你在屏幕后面说得出口的话，当面一个字都说不出来。你不是双面人，你只是在现实里还没找到安全的落脚点。',emotion:'线上情绪饱满而丰富，线下情绪被静音——这就是你的分裂日常。你在键盘上能写出最精准的感受，但面对面时你的情绪像被冻结了一样。数字空间是你情绪的防弹衣，脱下它你就不会表达了。这不是虚伪，是你在现实世界里还没有找到足够安全的表达方式。',tags:['深夜艺术家','赛博脆弱','线上线下两个人'],fun:'怎么都飞不出~花花的世界',profile:{A:10,E:70,S:10,D:95,O:48,I:48}},
    '傻波一': {id:4,name:'傻波一',knife:'有时候是看透了懒得说，有时候是真没看懂，你自己也分不清。',desc:'你喜欢说自己是看透了所以懒得参与，但说实话，有几次你是真没看懂，只是懒得暴露。这两种情况你自己也分不清楚，反正结果都是什么都没做，还挺心安理得的。别人焦虑的事你觉得没必要，别人努力的事你觉得没意思。这是松弛，还是麻木，你也不确定。但你确实睡得着，所以就这样吧。',emotion:'你的情绪波动曲线几乎是平的——不是没有情绪，是你对大多数事情真的不在乎。别人觉得你在压抑，其实你是真的看开了；别人觉得你麻木，其实你是真的觉得没必要。但"看开"和"麻木"之间的那条线，你自己也不太确定在哪里。你确实不焦虑，但你也确实不太兴奋。这是一种天赋，还是某种丧失？你不确定，你也不是很在意。',tags:['大智若愚or纯纯摆烂','自己也说不清','反正睡得着'],fun:'不是说傻人有傻福吗我都快成傻波一了',profile:{A:52,E:24,S:24,D:22,O:80,I:24}},
    '雀食者': {id:5,name:'雀食者',knife:'你说的"都行"里面，没有一个是真的都行。',desc:'你太擅长让所有人觉得你认同他们了。"确实"、"有道理"、"你说得对"，每一句都说得真诚，每一句都不是真心话。你不是高情商，你只是觉得解释太麻烦，争论太耗能，不如糊弄过去。嘴上全部答应，私下全部按自己来。有时候你自己也不确定，这是圆滑，还是你已经懒得和任何人真正沟通了。',emotion:'你的情绪有一套高效的"对外过滤器"——输出的是"都行"、"确实"、"有道理"，内部的真实感受只有你自己知道，而且你也不太常去看。你把情绪管理做成了糊弄学，省掉了所有的解释成本。但久了以后，你开始分不清：你是真的不在乎，还是已经习惯了对所有人撒谎，包括对自己。',tags:['糊弄学满级','嘴甜心硬','没人知道你在想什么'],fun:'雀巢不如确实啊',profile:{A:60,E:24,S:64,D:22,O:36,I:24}},
    '补兑者': {id:6,name:'补兑者',knife:'你不是在讲道理，你就是不想让对方赢。',desc:'你反驳是本能，不过脑子的那种。有人说"今天天气不错"，你嘴已经在找哪里不对了。更绝的是，有人拿你自己说过的话堵你，你也能面不改色地反驳回去——因为你当时说那话，其实也没过脑子。你不在乎谁对谁错，你在乎的是这场对话谁收了尾。你叫它批判性思维，你朋友叫它"和你说话好累"。',emotion:'你的情绪出口几乎只有一个：辩论。愤怒、不满、焦虑、委屈——全部经过理性化包装，转化成"你说的不对"。你不是在交流，你是在用反驳来排解情绪。问题在于，你自己都信了这个包装——你以为你真的是在讨论问题，其实你只是在找一个出口。而你身边的人，已经不太想当这个出口了。',tags:['杠到自己也不放过','反驳型人格本格','朋友私下劝你闭嘴'],fun:'不对，你这句话是对的',profile:{A:15,E:48,S:50,D:12,O:17,I:55}},
    '法师': {id:7,name:'法师',knife:'你没有在克制，你只是还没找到足够大的出口。',desc:'你说你是暴躁但克制，但你克制的方式是把火气吞回去，然后以内耗的方式烧自己。你心里骂这个世界的频率比任何人都高，但你对真正让你崩溃的人一个字都没说。你写的那些愤怒全删了，但气还在。你以为时间会消化它，实际上你只是在攒，攒到某次突然炸。那次炸的规模，和导火索完全不成比例。',emotion:'你的情绪是一座活火山——外表看起来可能是平静的，内部岩浆在持续翻滚。你把压抑当成克制，把吞咽当成消化。但情绪不是食物，吞下去不会消失，只会堆积。你心里有一个记仇账本，你以为自己在原谅，其实只是在延期。爆发的那一刻，你自己也吓了一跳——但被你波及的人，更吓一跳。',tags:['憋着不等于解决了','定时炸弹本弹','内耗冠军'],fun:'法死这个世界！',profile:{A:20,E:78,S:22,D:50,O:24,I:72}},
    '豪士': {id:8,name:'豪士',knife:'天塌了？这是好事儿啊。',desc:'你的字典里没有"倒霉"，只有"这不正好是个机会吗"。别人眼里的烂摊子，在你眼里是隐藏关卡。失业了是自由了，被拒绝了是筛掉不合适的，项目黄了是提前止损。你不是盲目乐观，你只是对"坏事"的定义和别人不一样。但有时候你的乐观也会让人觉得——你是不是没有认真在听我说话。',emotion:'你的大脑装了一个"乐观即时代谢器"——负面情绪进入你的系统，会被自动转化成"这是好事儿啊"然后排出。这不是否认，是你的认知框架真的和别人不一样。你能在别人崩溃的地方看到机会，这是你的超能力。但副作用是：当别人只是需要一句"我懂，这确实很糟"的时候，你的"没事的"会让他们更加孤独。',tags:['乐观悍匪','这不是好事吗','精神打不倒'],fun:'这是好事儿啊',profile:{A:50,E:52,S:50,D:18,O:85,I:50}},
    '朱之文': {id:9,name:'朱之文',knife:'我是老实，不是傻。',desc:'你是这个时代的稀有品种。真诚、淳朴，心胸宽得让人有点不敢相信。别人觉得你好欺负，其实你只是觉得没必要计较——你见过更大的事，这些不算什么。你的善良不是懦弱，是大智慧。但你的善良也有底线，那条线平时看不见，一旦被触碰，所有人才意识到你不是软的。别把老实人逼急了。',emotion:'你的情绪稳定得像一块磐石。你的善良不是情绪化的冲动，而是一种稳定的内在选择——你选择对这个世界温柔，不是因为你不懂恶，而是因为你见过之后依然选了善。你很少有剧烈的情绪波动，你的温暖是持续的、可预测的。但别误会，你的平静不是软弱，是一种力量。那条线平时看不见，但它在。',tags:['老实人但不好惹','善良有锋芒','大智若愚Pro'],fun:'hello everyone',isEasterEgg:true,profile:{A:92,E:22,S:50,D:20,O:72,I:8}},
    '玻璃': {id:10,name:'玻璃',knife:'别碰我，会碎。但不碰我，会冷。',desc:'你的心思像蜘蛛网，最轻的触碰都会引起连锁反应。别人随口一句话，你能想三天；一个没回的消息，你能演出三个剧本。你不是矫情，你是真真切切感受到了别人感受不到的震动。你的敏感有时候是天赋，更多时候只是让你更累。你为这种敏感痛苦，但它同时也让你成为最能感知细节的人——就看它今天以哪种方式出现。',emotion:'你的情绪是一张高精度的蛛网——最轻的触碰都会引起全网的连锁反应。别人感受不到的细微变化，在你这里是四级地震。你的共情深度是常人难以企及的，但代价是你几乎没有情绪免疫系统。外界的信息进来很容易，出去很难。你为这种敏感痛苦，但它也是你的天赋——你是人间测震仪，能感知别人感知不到的世界。',tags:['高敏感体质','人间测震仪','易碎但珍贵'],fun:'爱的很透明像是玻璃',profile:{A:50,E:85,S:18,D:50,O:12,I:18}},
    '嘉豪': {id:11,name:'嘉豪',knife:'你以为你是全场焦点，你确实是——因为大家都在看你出丑。',desc:'你走进一个房间，第一件事是确认有没有人注意到你，第二件事是确保他们继续注意你。你觉得你很帅，你觉得你很有魅力，你说的话很好笑——最后那个是真的，但原因不是你以为的那种。大家记住你了，记住你是那个很搞笑的。你提供了全场80%的笑点，换来的评价是"他好逗"，不是"他很酷"。你想要的那个，你没得到。',emotion:'你的情绪是舞台上的聚光灯——必须有观众。快乐需要被看见，悲伤也需要被见证。没人注意的时候，你的情绪会迅速贬值，因为你不太确定一个人感受一件事有什么意义。你把存在感当成安全感的替代品，但存在感是别人给的，安全感只能自己给。你提供的快乐是真实的，但你想要的是被认真对待，而不是被当成气氛组。',tags:['存在感是命','小丑本丑','自我感觉良好系'],fun:'豪到我了',profile:{A:15,E:90,S:90,D:50,O:62,I:72}},
    '万人迷': {id:12,name:'万人迷',knife:'你什么都不用做，站着就是吸引力法则。',desc:'你的魅力不靠技巧，靠天生的亲和力。小猫小狗、小朋友，还有所有年龄段的成年人，都忍不住靠近你。你不是故意的，但你就是有一种让人放下防备的磁场。你也因此承接了很多人的倾诉——他们觉得你安全。但你偶尔也会想：他们喜欢的到底是我，还是在我身边的那种舒适感？',emotion:'你的情绪像一块磁铁——你不主动发出信号，但别人会主动把他们的情绪交给你。你承接了太多不属于你的重量，而你自己的情绪很少有人主动问起。别人觉得你"没事"，因为你看起来太好了。你习惯了被当成安全的树洞，但有的时候，你也想当那个倾诉的人。你的磁场是天赋，但天赋也有代价。',tags:['人间吸铁石','亲和力爆表','团宠本宠'],fun:'好感圣体',profile:{A:58,E:35,S:68,D:25,O:65,I:20}},
    '天使': {id:13,name:'天使',knife:'下凡是来渡劫，任务是救苦救难。',desc:'你有一种天生的使命感，叫"让世界再温柔一点点"。给陌生人指路，给哭泣的人递纸，给迷茫的人当灯塔。你不是圣母，你做这些也不是表演，你就是控制不住地对这个世界温柔。但你和万人迷不同——你是主动出击，是你选择去靠近、去帮、去给。只是有时候你帮的那个人并不想被帮，这件事你还没完全想通。',emotion:'你的情绪是一道光——你是主动把光照向别人的人。你不是被动地被需要，你是主动去寻找需要被帮助的人。这种使命感是你最核心的驱动力，但它的代价是：你很少给自己留光。你的情绪能量几乎全部流向外部，你觉得帮助别人就是帮助自己。但有时候，你需要帮助的那个人，恰好是你自己。而当有人想帮你的时候，你反而不知道怎么办。',tags:['行走的治愈剂','善良是本能','但有时候用力过猛'],fun:'完全天堂下凡来的',profile:{A:72,E:53,S:52,D:32,O:64,I:30}},
    '隐身玩家': {id:14,name:'隐身玩家',knife:'游戏里的隐身技能，我活成了日常。',desc:'你在人生这场游戏里选择了潜行模式。不组队、不开麦、不抢人头，但地图上每个角落你都去过。你什么都知道，什么都不说，默默发育，等到结算的时候，你活得最久。你不是社恐，你是太清醒——你知道大多数热闹都和你没什么关系，所以你选择旁观。你的存在感是0，但你的影响力往往在你离开以后才显现。',emotion:'你的情绪是一座无人岛——什么都有，但没有人来访。你的内心世界丰富而完整，但它是完全内向的。你不是没有情绪，你只是觉得没必要把它们展示出来。你什么都知道，什么都不说。这种沉默不是压抑，是一种选择——你选择了旁观，因为你发现大多数热闹确实和自己没什么关系。你的存在感是0，但你的感受力是满分。',tags:['人间观察家','潜行模式','闷声过得好'],fun:'潜水证10级',profile:{A:62,E:5,S:5,D:62,O:55,I:5}},
    '独美选手': {id:15,name:'独美选手',knife:'不是孤独，是选择性的独美。',desc:'你享受独处，不是因为没有朋友，而是因为自己就足够有意思。你可以一个人吃完一顿好饭，一个人看完一场电影，一个人旅行还能玩得很精彩。你把时间花在经营自己身上，花开好了，蝴蝶爱来不来。但偶尔，你也会在深夜问自己：我是真的享受独处，还是只是习惯了？',emotion:'你的情绪是自给自足的闭环系统。你不太需要别人的情绪输入，也不太输出情绪给别人。你不是冷漠，你是真的不需要太多外部情绪交换。你享受这种独立，你的快乐不依赖任何人。但在某个深夜，你可能会有一瞬间想：如果有一天我真的需要一个人，我还会打电话吗？——然后你忘了这件事，继续你的独美生活。',tags:['独处艺术家','自给自足','一人即世界'],fun:'哪怕世界毁灭，我独自美丽~',profile:{A:20,E:20,S:5,D:18,O:75,I:50}},
    '乐子人': {id:16,name:'乐子人',knife:'我不是在找乐子，我就是乐子本身。',desc:'你来人间一趟，主要任务是收集快乐素材。什么梗都逃不过你的眼睛，什么幽默的边角料你都能接住。你是朋友圈的快乐批发商，永远站在吃瓜和造梗的第一线。但你找乐子找得这么努力，有时候只是因为安静下来有点可怕。笑声停了，你不确定剩下的是什么。所以你继续找，继续笑，继续是那个让所有人快乐的人。',emotion:'你的情绪表面上是快乐的批发市场——笑是你最熟悉的情绪，因为它比哭容易。你找乐子找得这么努力，有时候只是因为安静下来有点可怕。笑声停了之后，你不确定剩下的是什么，所以你继续找下一个笑点。你把快乐做成了永不停歇的生产线，但当工厂停电的时候，那些被你用笑声压住的东西，会一起涌上来。你的快乐是真的，但它也是你的盾牌。',tags:['快乐批发商','梗界扛把子','笑是最好的盾'],fun:'奖池还在叠加，求你住嘴吧，笑到一定程度已经是痛苦了',profile:{A:37,E:72,S:72,D:38,O:82,I:72}}
  };

  var SCORE_MATRIX = [
    [{A:3,S:2},{A:2,E:2},{E:2,O:1},{A:1,I:-2}],[{E:2,O:-2},{O:2,I:1},{E:2,O:2},{E:2,O:-2}],[{E:-2,A:-2},{E:2,S:2},{O:2,E:1},{I:-2,E:1}],[{S:2,A:1},{D:2,E:1},{S:-2,I:-2},{E:2,S:2}],[{S:-2,I:-2},{A:2,S:1},{E:2,O:2},{S:-2,O:2}],[{O:2,I:0},{E:2,O:-2},{I:1,O:2},{D:2,E:2}],[{O:2,I:-2},{E:2,O:-2},{A:2,O:2},{I:2,E:2}],[{D:3,E:2},{D:1,I:-2},{D:2,E:-2},{D:-3}],[{S:3,I:2},{S:-2,I:-2},{S:1,A:1},{D:2,S:-2}],[{E:2,O:-2},{D:3},{S:2,E:2},{O:2,I:-2}],[{A:1,E:1,I:-2},{I:2,E:2},{A:-2,I:1},{A:2,O:2}],[{S:2,E:2},{S:-2,A:-2},{D:2,E:2},{O:1,I:1}],[{I:2,E:2},{A:1,S:1},{I:-2,S:-2},{I:0,A:-2}],[{I:3,E:2},{I:1,A:1},{I:-2,E:-2},{I:2,O:2}],[{E:2,S:2},{E:-2,I:-2},{E:-2,S:-2},{D:1,E:1}],[{A:1,O:1},{O:2,I:1,S:-2},{S:3,I:1},{S:-2,I:-2}],[{I:2,S:2},{O:2,I:1},{I:-2,E:1},{I:-2,E:2}],[{O:2,E:-2},{E:0,O:0},{E:3,I:2},{E:1,O:-2}],[{D:2,E:2,O:-2},{S:2,E:1},{I:2,E:1},{I:-2,O:2}],[{S:-2,I:-2},{S:1,I:1},{D:2,E:2},{O:-2,I:-2}],[{O:2,I:2},{O:-2,I:-2},{D:2,S:-2},{E:1,O:-2}],[{E:2,S:2},{S:-2,I:-2},{E:1,O:2},{I:-2,E:1}],[{S:3,E:3},{S:-3,D:3}],[{A:3,O:3},{A:3,I:3}],[{E:3,I:-3},{I:3,E:3}],[{A:2,E:2,O:-2},{S:2,E:2},{S:-2,I:-2},{D:1,O:-2}],[{A:2,I:-2},{I:2,E:2},{O:1,I:-2},{E:2,O:-2}],[{E:2,D:1,O:-2},{O:2,I:-2},{E:2,S:1},{O:2,S:-2}],[{E:2,S:2},{A:2,E:2},{I:-2,S:-2},{O:2,I:-2}],[{A:2,E:1},{E:2,O:2},{I:-2,S:-2,O:1},{S:-2,O:2,I:1}]
  ];

  function calculateScores(answers) {
    var raw = {A:0,E:0,S:0,D:0,O:0,I:0};
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
    var stdDevs = {A:2.0,E:3.4,S:4.2,D:2.3,O:3.6,I:4.4};
    var centers = {A:9.5,E:26.1,S:-0.9,D:8.1,O:9.1,I:-4.4};
    var norm = {};
    for (var d in raw) {
      var z = (raw[d] - centers[d]) / stdDevs[d];
      norm[d] = Math.round((1/(1+Math.exp(-z)))*100);
    }
    return norm;
  }

  function isZhuZhiwen(scores, answers) {
    if (scores.A < 70) return false;
    if (scores.I > 30) return false;
    if (answers[23] !== 0) return false;
    if (answers[10] !== 3) return false;
    if (answers[24] !== 0) return false;
    return true;
  }

  // MBTI式维度分类 (L≤30 / M / H≥70)
  function classifyCategory(score) {
    if (score <= 30) return 'L';
    if (score >= 70) return 'H';
    return 'M';
  }

  // MBTI+Euclidean混合匹配
  // Euclidean相似度(保证均匀分布) + 分类匹配bonus(每维+4分, 最多+24)
  function findBestMatch(scores, answers) {
    if (isZhuZhiwen(scores, answers)) return {persona:PERSONAS['朱之文'], matchDims:6};

    var dims = ['A','E','S','D','O','I'];
    var bestScore = -Infinity, bestKey = null, bestMatchDims = 0;

    for (var key in PERSONAS) {
      if (!PERSONAS.hasOwnProperty(key)) continue;
      var p = PERSONAS[key];
      if (p.isEasterEgg) continue;

      // Euclidean相似度 (0-100)
      var sumSq = 0;
      for (var i = 0; i < dims.length; i++) {
        sumSq += Math.pow(scores[dims[i]] - p.profile[dims[i]], 2);
      }
      var euclidSim = Math.max(0, 100 - Math.sqrt(sumSq) * 0.41);

      // 分类匹配bonus (每维+4, 最多+24)
      var catBonus = 0;
      for (var j = 0; j < dims.length; j++) {
        if (classifyCategory(scores[dims[j]]) === classifyCategory(p.profile[dims[j]])) {
          catBonus += 4;
        }
      }
      var totalScore = euclidSim + catBonus;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestKey = key;
        bestMatchDims = catBonus / 4;
      }
    }
    return {
      persona: PERSONAS[bestKey] || PERSONAS['血包'],
      matchDims: bestMatchDims
    };
  }

  function render(persona, scores, matchDims) {
    // 守卫：关键 DOM 元素必须存在
    var nameCheck = document.getElementById('personaName');
    if (!nameCheck) { console.error('[结果页] render() 中止: personaName 元素不存在'); return; }

    document.getElementById('fileNo').textContent = '2026-' + String(persona.id).padStart(4, '0');

    // 画像
    var portraitEl = document.getElementById('portraitImg');
    if (portraitEl) {
      portraitEl.src = '人格画像/' + encodeURIComponent(persona.name) + '.jpg';
      portraitEl.alt = persona.name;
      if (persona.isEasterEgg) {
        portraitEl.style.borderColor = 'rgba(249,168,212,0.5)';
        portraitEl.style.boxShadow = '0 0 30px rgba(249,168,212,0.3), 0 0 60px rgba(249,168,212,0.1)';
      }
    }

    var nameEl = document.getElementById('personaName');
    nameEl.textContent = persona.name;
    if (persona.isEasterEgg) {
      nameEl.style.color = '#f9a8d4';
      nameEl.style.textShadow = '0 0 24px rgba(249,168,212,0.8), 0 0 60px rgba(249,168,212,0.5), 0 0 120px rgba(249,168,212,0.3)';
      var auraEl = document.querySelector('.name-aura');
      if (auraEl) auraEl.style.background = 'radial-gradient(circle, rgba(249,168,212,0.1) 0%, rgba(249,168,212,0.04) 30%, transparent 65%)';
    }
    // 显示维度契合度 (MBTI式)
    if (typeof matchDims === 'number') {
      var subtitleEl = document.querySelector('.name-subtitle');
      if (subtitleEl) {
        subtitleEl.textContent = '经系统判定，你的人格类型为（维度契合度 ' + matchDims + '/6）';
      }
    }
    document.getElementById('knifeText').textContent = persona.knife;
    document.getElementById('descText').textContent = persona.desc;
    document.getElementById('emotionText').textContent = persona.emotion;
    renderEmotionBars(scores);
    var tagsHtml = '';
    for (var i = 0; i < persona.tags.length; i++) tagsHtml += '<span class="tag">#' + persona.tags[i] + '</span>';
    if (persona.isEasterEgg) tagsHtml += '<span class="tag rare">稀有人格 <5%</span>';
    document.getElementById('verdictTags').innerHTML = tagsHtml;
    var eggEl = document.getElementById('verdictFun'), funEl = document.getElementById('funText');
    funEl.textContent = persona.fun;
    if (persona.isEasterEgg) { eggEl.classList.add('legendary'); funEl.textContent = '【彩蛋人格 · 触发概率<5%】 ' + persona.fun; }
  }

  function renderEmotionBars(scores) {
    var order = ['E','A','S','O','I','D'], html = '';
    for (var i = 0; i < order.length; i++) {
      var dim = order[i], val = scores[dim] || 50, color = DIM_COLORS[dim], label = DIM_LABELS[dim];
      html += '<div class="emotion-bar-row"><span class="emotion-bar-label">' + label + '</span><div class="emotion-bar-track"><div class="emotion-bar-fill" style="width:' + val + '%;color:' + color + ';background:' + color + ';box-shadow:0 0 10px ' + color + ';"></div></div></div>';
    }
    document.getElementById('emotionBars').innerHTML = html;
  }

  // ====== 特效 Canvas ======
  var fxCanvas, ctx, fw, fh, particles = [], burstList = [];
  function fxResize() {
    fxCanvas = document.getElementById('verdictFx');
    if (!fxCanvas) return;
    ctx = fxCanvas.getContext('2d');
    fw = fxCanvas.width = window.innerWidth;
    fh = fxCanvas.height = window.innerHeight;
  }
  function spawnParticle() {
    return {x:Math.random()*fw,y:fh+30,size:Math.random()*2.5+0.8,color:Math.random()<0.35?'#7ec8c0':'#c084fc',speed:Math.random()*0.5+0.15,opacity:Math.random()*0.3+0.05,life:0,maxLife:Math.random()*280+180,wobble:Math.random()*Math.PI*2,wobbleSpd:(Math.random()-0.5)*0.025};
  }
  function spawnBurst(x,y) {
    var a=Math.random()*Math.PI*2,s=Math.random()*3.5+2;
    return {x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,size:Math.random()*3.5+1.5,color:Math.random()<0.5?'#f9a8d4':'#c084fc',opacity:1,life:0,maxLife:Math.random()*70+50,gravity:0.025};
  }
  function burstAt(x,y,count) {for(var i=0;i<count;i++)burstList.push(spawnBurst(x,y));}
  function drawFx() {
    if(!ctx)return;
    ctx.clearRect(0,0,fw,fh);
    for(var i=particles.length-1;i>=0;i--){
      var p=particles[i];p.y-=p.speed;p.life++;p.wobble+=p.wobbleSpd;
      var fade=Math.min(1,p.life/50)*Math.min(1,(p.maxLife-p.life)/70),alpha=Math.max(0,fade*p.opacity),wx=Math.sin(p.wobble)*12;
      var rr=parseInt(p.color.slice(1,3),16),gg=parseInt(p.color.slice(3,5),16),bb=parseInt(p.color.slice(5,7),16);
      ctx.beginPath();ctx.arc(p.x+wx,p.y,p.size,0,Math.PI*2);ctx.fillStyle='rgba('+rr+','+gg+','+bb+','+alpha+')';ctx.fill();
      if(p.size>1.5&&alpha>0.1){ctx.beginPath();ctx.arc(p.x+wx,p.y,p.size*3,0,Math.PI*2);ctx.fillStyle='rgba('+rr+','+gg+','+bb+','+(alpha*0.12)+')';ctx.fill();}
      if(p.life>p.maxLife||p.y<-50)particles.splice(i,1);
    }
    for(var j=burstList.length-1;j>=0;j--){
      var bp=burstList[j];bp.x+=bp.vx;bp.y+=bp.vy;bp.vy+=bp.gravity;bp.life++;bp.opacity=Math.max(0,1-bp.life/bp.maxLife);
      var hr=parseInt(bp.color.slice(1,3),16),hg=parseInt(bp.color.slice(3,5),16),hb=parseInt(bp.color.slice(5,7),16);
      ctx.beginPath();ctx.arc(bp.x,bp.y,bp.size*(0.5+bp.opacity*0.5),0,Math.PI*2);ctx.fillStyle='rgba('+hr+','+hg+','+hb+','+bp.opacity+')';ctx.fill();
      if(bp.life>bp.maxLife)burstList.splice(j,1);
    }
    if(Math.random()<0.05&&particles.length<100)particles.push(spawnParticle());
    requestAnimationFrame(drawFx);
  }
  function initFx() {
    fxResize();window.addEventListener('resize',fxResize);
    for(var i=0;i<50;i++){var p=spawnParticle();p.y=Math.random()*fh;p.life=Math.floor(Math.random()*150);particles.push(p);}
    drawFx();
  }

  // ====== 按钮 ======
  function initButtons(personaName, persona) {
    var btnShare = document.getElementById('btnShare');
    var btnComp = document.getElementById('btnCompatibility');
    var linkAll = document.getElementById('linkAll');

    btnShare.addEventListener('click', function(){saveCard(persona);});
    btnShare.addEventListener('touchend', function(e){ e.preventDefault(); saveCard(persona); });

    btnComp.addEventListener('click', function(){window.location.href='compatibility.html';});
    btnComp.addEventListener('touchend', function(e){ e.preventDefault(); window.location.href='compatibility.html'; });

    linkAll.addEventListener('click', function(e){e.preventDefault();window.location.href='gallery.html';});
    linkAll.addEventListener('touchend', function(e){ e.preventDefault(); window.location.href='gallery.html'; });
  }

  // ====== 保存卡片 Canvas→PNG ======
  function saveCard(persona) {
    var s=2,W=420,H=600,c=document.createElement('canvas');
    c.width=W*s;c.height=H*s;var t=c.getContext('2d');t.scale(s,s);
    var g=t.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0e0b1a');g.addColorStop(0.5,'#100c20');g.addColorStop(1,'#080510');
    t.fillStyle=g;t.fillRect(0,0,W,H);
    t.fillStyle='rgba(168,85,247,0.03)';
    for(var x=0;x<W;x+=24)for(var y=0;y<H;y+=24){t.beginPath();t.arc(x,y,0.6,0,Math.PI*2);t.fill();}
    t.fillStyle='rgba(255,255,255,0.015)';for(var sy=0;sy<H;sy+=4)t.fillRect(0,sy,W,2);
    t.beginPath();t.arc(210,42,22,0,Math.PI*2);t.strokeStyle='rgba(168,85,247,0.3)';t.lineWidth=1;t.stroke();
    t.fillStyle='rgba(192,132,252,0.5)';t.font='700 11px "SF Mono","JetBrains Mono","Consolas",monospace';t.textAlign='center';
    t.fillText('机密档案',210,78);t.fillStyle='rgba(168,85,247,0.25)';t.font='400 8px "SF Mono","JetBrains Mono","Consolas",monospace';
    t.fillText('CONFIDENTIAL',210,92);t.fillStyle='rgba(126,200,192,0.32)';t.fillText('FILE NO. 2026-'+String(persona.id).padStart(4,'0'),210,108);
    t.strokeStyle='rgba(168,85,247,0.12)';t.lineWidth=0.5;t.beginPath();t.moveTo(60,135);t.lineTo(360,135);t.stroke();
    t.fillStyle='rgba(168,85,247,0.28)';t.font='400 9px "SF Mono","JetBrains Mono","Consolas",monospace';t.fillText('互联网人格审判书',210,128);
    t.fillStyle='rgba(180,170,200,0.35)';t.font='400 11px "SF Mono","JetBrains Mono","Consolas",monospace';t.fillText('经系统判定，你的人格类型为',210,180);
    var nc=persona.isEasterEgg?'#f9a8d4':'#f3f0f9',ng=persona.isEasterEgg?'rgba(249,168,212,0.6)':'rgba(192,132,252,0.6)';
    t.fillStyle=nc;t.font='900 52px -apple-system,"PingFang SC","Microsoft YaHei",sans-serif';
    t.shadowColor=ng;t.shadowBlur=16;t.fillText(persona.name,210,220);t.shadowColor=ng;t.shadowBlur=40;t.fillText(persona.name,210,220);
    t.shadowColor='transparent';t.shadowBlur=0;
    t.fillStyle='rgba(249,168,212,0.12)';t.fillRect(40,250,340,56);t.strokeStyle='rgba(249,168,212,0.25)';t.lineWidth=0.5;t.strokeRect(40,250,340,56);
    t.fillStyle='#f9a8d4';t.font='600 13px -apple-system,"PingFang SC","Microsoft YaHei",sans-serif';
    t.fillText(persona.knife,210,280);
    t.fillStyle='rgba(192,132,252,0.5)';t.font='700 10px "SF Mono","JetBrains Mono","Consolas",monospace';t.fillText('📖 人格画像',210,330);
    t.fillStyle='rgba(211,201,230,0.55)';t.font='400 10px -apple-system,"PingFang SC","Microsoft YaHei",sans-serif';
    var dl=persona.desc.substring(0,120);t.fillText(dl,210,346);
    var ord=['E','A','S','O','I','D'],dc={A:'#c084fc',E:'#f9a8d4',S:'#7ec8c0',D:'#a78bfa',O:'#67e8f9',I:'#f472b6'},dlbl={A:'利他',E:'外显',S:'社交',D:'数字',O:'乐观',I:'烈度'};
    for(var bi=0;bi<ord.length;bi++){
      var dm=ord[bi],v=persona.profile[dm]||50,cl=dc[dm],by=380+bi*22;
      t.fillStyle='rgba(192,132,252,0.45)';t.font='700 8px "SF Mono","JetBrains Mono","Consolas",monospace';t.textAlign='right';t.fillText(dlbl[dm],80,by+6);t.textAlign='center';
      t.fillStyle='rgba(255,255,255,0.04)';t.fillRect(88,by,260,5);t.fillStyle=cl;t.shadowColor=cl;t.shadowBlur=6;t.fillRect(88,by,260*v/100,5);
    }
    t.shadowColor='transparent';t.shadowBlur=0;
    t.fillStyle='rgba(216,180,254,0.6)';t.font='400 9px -apple-system,"PingFang SC","Microsoft YaHei",sans-serif';
    t.fillText(persona.tags.map(function(tt){return'#'+tt;}).join('  '),210,520);
    if(persona.isEasterEgg){t.fillStyle='#f9a8d4';t.font='700 10px -apple-system,"PingFang SC","Microsoft YaHei",sans-serif';t.fillText('🌟 稀有人格 · 触发概率 <5%',210,540);}
    t.fillStyle='rgba(192,165,230,0.4)';t.font='italic 400 9px -apple-system,"PingFang SC","Microsoft YaHei",sans-serif';t.fillText(persona.fun,210,persona.isEasterEgg?560:538);
    t.fillStyle='rgba(180,170,200,0.25)';t.font='400 8px -apple-system,"PingFang SC","Microsoft YaHei",sans-serif';
    t.fillText('承认吧，你就是_____',210,575);t.fillText('扫码让朋友也来测  ·  16种人格等你发现',210,591);
    c.toBlob(function(b){var u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='审判书_'+persona.name+'.png';document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(u);},'image/png',0.95);
  }

  // ====== 启动 ======
  function init() {
    console.log('[结果页] init() 开始');

    // 1. 启动特效 Canvas
    try { initFx(); console.log('[结果页] initFx() 成功'); } catch(e) { console.error('[结果页] initFx() 失败:', e); }

    // 2. 安全读取 localStorage
    var answersJson = null;
    try { answersJson = localStorage.getItem('sbtest_answers'); } catch(e) { console.error('[结果页] localStorage 读取失败:', e); }
    console.log('[结果页] localStorage 数据:', answersJson ? '有(' + answersJson.length + '字符)' : '空');

    // 3. 安全解析 JSON
    var answers = null;
    if (answersJson) {
      try { answers = JSON.parse(answersJson); console.log('[结果页] JSON解析成功, 答案数:', answers.length); }
      catch(e) { console.error('[结果页] JSON解析失败:', e); answers = null; }
    }

    // 4. 计算分数 + 匹配人格
    var persona = null, scores = null, matchDims = null;
    if (answers && Array.isArray(answers) && answers.length > 0) {
      try {
        scores = calculateScores(answers);
        var result = findBestMatch(scores, answers);
        persona = result.persona;
        matchDims = result.matchDims;
        console.log('[结果页] 匹配人格:', persona.name, '维度契合:', matchDims);
      } catch(e) { console.error('[结果页] 计算/匹配失败:', e); persona = null; }
    }

    // 5. 极端情况兜底（无答案时用默认人格，避免白屏）
    if (!persona) {
      console.warn('[结果页] 无有效答案，使用兜底人格');
      persona = PERSONAS['血包']; scores = persona.profile; matchDims = null;
    }

    // ★ 关键：先绑按钮（不依赖渲染成功），再渲染内容
    try { initButtons(persona.name, persona); console.log('[结果页] initButtons() 成功'); } catch(e) { console.error('[结果页] initButtons() 失败:', e); }

    try {
      render(persona, scores, matchDims);
      console.log('[结果页] render() 成功');
    } catch(e) {
      console.error('[结果页] render() 失败:', e);
      // 紧急：至少显示人格名
      var nameEl = document.getElementById('personaName');
      if (nameEl) { nameEl.textContent = persona.name; nameEl.style.opacity = '1'; nameEl.style.color = '#f3f0f9'; }
      var knifeEl = document.getElementById('knifeText');
      if (knifeEl) { knifeEl.textContent = persona.knife; knifeEl.style.opacity = '1'; }
    }

    // 6. CSS 可见性兜底：2.5 秒后强制显示所有区块（防止动画不执行导致内容不可见）
    setTimeout(function(){
      document.documentElement.classList.add('js-loaded');
      var sections = document.querySelectorAll('.verdict-dossier > *, .verdict-dossier .section-portrait, .verdict-dossier .section-emotion, .verdict-dossier .section-knife, .verdict-dossier .tag-cluster, .verdict-dossier .action-group, .verdict-dossier .dossier-footer');
      for (var i = 0; i < sections.length; i++) {
        sections[i].style.opacity = '1';
        sections[i].style.transform = 'translateY(0)';
      }
      console.log('[结果页] CSS 可见性兜底执行完毕');
    }, 2500);

    // 7. 彩蛋特效
    setTimeout(function(){
      if(persona && persona.isEasterEgg){
        try { burstAt(fw/2,fh*0.28,100); setTimeout(function(){burstAt(fw/2,fh*0.28,60);},600); console.log('[结果页] 彩蛋特效触发'); }
        catch(e){ console.error('[结果页] 彩蛋特效失败:', e); }
      }
    },1200);
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}
})();
