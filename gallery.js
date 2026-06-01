/**
 * 承认吧，你就是_____ — 全人格图鉴
 * 16 种人格卡片网格 + 详情弹窗
 */
(function () {
  'use strict';

  var DIM_LABELS = { A: '利他', E: '外显', S: '社交', D: '数字', O: '乐观', I: '烈度' };
  var DIM_COLORS = { A: '#c084fc', E: '#f9a8d4', S: '#7ec8c0', D: '#a78bfa', O: '#67e8f9', I: '#f472b6' };

  var PERSONAS = {
    '血包': {
      id: 1, name: '血包',
      knife: '别人的情绪垃圾桶，自己的电量永远1%。',
      desc: '你有一种本能，叫"见不得别人难过"。朋友深夜说"好烦"，你能陪到天亮；同事情绪不对，你会主动问"怎么了"。你不是没有脾气，你是把脾气都咽回去给了自己。大家叫你小太阳，但太阳也有耗尽的时候，只是你不说而已。你最常做的事，是在别人崩溃之后，独自收拾自己的情绪残局。你知道你在讨好，你只是停不下来。',
      emotion: '你对他人情绪的感知力接近雷达级别，却对自己的情绪近乎麻木。你的共情是一种本能而非选择——你无法对他人的痛苦视而不见，即使你自己已经空了。你的情绪能量几乎全部向外输出，很少向内补给。危险在于：当所有人都习惯被你的光照亮，没有人注意到灯本身已经快没油了。',
      tags: ['讨好型人格晚期', '治愈系但自己没人治', '最后一个崩溃的人'],
      fun: '打野别吃我血包啊！！',
      profile: { A: 85, E: 70, S: 50, D: 18, O: 28, I: 18 }
    },
    '五秒真男(女)人': {
      id: 2, name: '五秒真男(女)人',
      knife: '你的后悔频率，比你愿意承认的高得多。',
      desc: '你说话的时候是认真的，五秒后反悔也是真的。你说过"绝对不可能"的事，你做了；你说过"这辈子不联系"的人，你发消息了；你说过"我不在乎"，然后在乎得睡不着。你把这叫做活得真实，也行。只是你身边的人已经不太当真你说的话了，包括那些"我爱你"。',
      emotion: '你的情绪没有中间档，要么全开要么全关。高兴是真的高兴，愤怒是真的愤怒，后悔也是真的后悔——每一次都像第一次。你不是善变，是你的情绪反应速度远超你的理性刹车系统。后悔是你最熟悉的情绪之一，但你很少从中提取教训，因为下一次情绪来了，你还是会再走一遍同样的路。',
      tags: ['真香定律受害者', '狠话打折出售', '说到不一定做到'],
      fun: '5s，就5s？！？！',
      profile: { A: 28, E: 90, S: 62, D: 10, O: 50, I: 90 }
    },
    '电子蝴蝶': {
      id: 3, name: '电子蝴蝶',
      knife: '赛博世界翩翩飞舞，一关屏幕就碎成像素。',
      desc: '你的灵魂有一半活在数字世界里。你的朋友圈是精心策划的艺术展，你的深夜文字打动了很多人，你网上的状态和现实有一种奇妙的割裂——网上的你美得像蝴蝶，现实里的你脆得像玻璃。你在屏幕后面说得出口的话，当面一个字都说不出来。你不是双面人，你只是在现实里还没找到安全的落脚点。',
      emotion: '线上情绪饱满而丰富，线下情绪被静音——这就是你的分裂日常。你在键盘上能写出最精准的感受，但面对面时你的情绪像被冻结了一样。数字空间是你情绪的防弹衣，脱下它你就不会表达了。这不是虚伪，是你在现实世界里还没有找到足够安全的表达方式。',
      tags: ['深夜艺术家', '赛博脆弱', '线上线下两个人'],
      fun: '怎么都飞不出~花花的世界',
      profile: { A: 10, E: 70, S: 10, D: 95, O: 48, I: 48 }
    },
    '傻波一': {
      id: 4, name: '傻波一',
      knife: '有时候是看透了懒得说，有时候是真没看懂，你自己也分不清。',
      desc: '你喜欢说自己是看透了所以懒得参与，但说实话，有几次你是真没看懂，只是懒得暴露。这两种情况你自己也分不清楚，反正结果都是什么都没做，还挺心安理得的。别人焦虑的事你觉得没必要，别人努力的事你觉得没意思。这是松弛，还是麻木，你也不确定。但你确实睡得着，所以就这样吧。',
      emotion: '你的情绪波动曲线几乎是平的——不是没有情绪，是你对大多数事情真的不在乎。别人觉得你在压抑，其实你是真的看开了；别人觉得你麻木，其实你是真的觉得没必要。但"看开"和"麻木"之间的那条线，你自己也不太确定在哪里。你确实不焦虑，但你也确实不太兴奋。这是一种天赋，还是某种丧失？你不确定，你也不是很在意。',
      tags: ['大智若愚or纯纯摆烂', '自己也说不清', '反正睡得着'],
      fun: '不是说傻人有傻福吗我都快成傻波一了',
      profile: { A: 52, E: 24, S: 24, D: 22, O: 80, I: 24 }
    },
    '雀食者': {
      id: 5, name: '雀食者',
      knife: '你说的"都行"里面，没有一个是真的都行。',
      desc: '你太擅长让所有人觉得你认同他们了。"确实"、"有道理"、"你说得对"，每一句都说得真诚，每一句都不是真心话。你不是高情商，你只是觉得解释太麻烦，争论太耗能，不如糊弄过去。嘴上全部答应，私下全部按自己来。有时候你自己也不确定，这是圆滑，还是你已经懒得和任何人真正沟通了。',
      emotion: '你的情绪有一套高效的"对外过滤器"——输出的是"都行"、"确实"、"有道理"，内部的真实感受只有你自己知道，而且你也不太常去看。你把情绪管理做成了糊弄学，省掉了所有的解释成本。但久了以后，你开始分不清：你是真的不在乎，还是已经习惯了对所有人撒谎，包括对自己。',
      tags: ['糊弄学满级', '嘴甜心硬', '没人知道你在想什么'],
      fun: '雀巢不如确实啊',
      profile: { A: 60, E: 24, S: 64, D: 22, O: 36, I: 24 }
    },
    '补兑者': {
      id: 6, name: '补兑者',
      knife: '你不是在讲道理，你就是不想让对方赢。',
      desc: '你反驳是本能，不过脑子的那种。有人说"今天天气不错"，你嘴已经在找哪里不对了。更绝的是，有人拿你自己说过的话堵你，你也能面不改色地反驳回去——因为你当时说那话，其实也没过脑子。你不在乎谁对谁错，你在乎的是这场对话谁收了尾。你叫它批判性思维，你朋友叫它"和你说话好累"。',
      emotion: '你的情绪出口几乎只有一个：辩论。愤怒、不满、焦虑、委屈——全部经过理性化包装，转化成"你说的不对"。你不是在交流，你是在用反驳来排解情绪。问题在于，你自己都信了这个包装——你以为你真的是在讨论问题，其实你只是在找一个出口。而你身边的人，已经不太想当这个出口了。',
      tags: ['杠到自己也不放过', '反驳型人格本格', '朋友私下劝你闭嘴'],
      fun: '不对，你这句话是对的',
      profile: { A: 15, E: 48, S: 50, D: 12, O: 17, I: 55 }
    },
    '法师': {
      id: 7, name: '法师',
      knife: '你没有在克制，你只是还没找到足够大的出口。',
      desc: '你说你是暴躁但克制，但你克制的方式是把火气吞回去，然后以内耗的方式烧自己。你心里骂这个世界的频率比任何人都高，但你对真正让你崩溃的人一个字都没说。你写的那些愤怒全删了，但气还在。你以为时间会消化它，实际上你只是在攒，攒到某次突然炸。那次炸的规模，和导火索完全不成比例。',
      emotion: '你的情绪是一座活火山——外表看起来可能是平静的，内部岩浆在持续翻滚。你把压抑当成克制，把吞咽当成消化。但情绪不是食物，吞下去不会消失，只会堆积。你心里有一个记仇账本，你以为自己在原谅，其实只是在延期。爆发的那一刻，你自己也吓了一跳——但被你波及的人，更吓一跳。',
      tags: ['憋着不等于解决了', '定时炸弹本弹', '内耗冠军'],
      fun: '法死这个世界！',
      profile: { A: 20, E: 78, S: 22, D: 50, O: 24, I: 72 }
    },
    '豪士': {
      id: 8, name: '豪士',
      knife: '天塌了？这是好事儿啊。',
      desc: '你的字典里没有"倒霉"，只有"这不正好是个机会吗"。别人眼里的烂摊子，在你眼里是隐藏关卡。失业了是自由了，被拒绝了是筛掉不合适的，项目黄了是提前止损。你不是盲目乐观，你只是对"坏事"的定义和别人不一样。但有时候你的乐观也会让人觉得——你是不是没有认真在听我说话。',
      emotion: '你的大脑装了一个"乐观即时代谢器"——负面情绪进入你的系统，会被自动转化成"这是好事儿啊"然后排出。这不是否认，是你的认知框架真的和别人不一样。你能在别人崩溃的地方看到机会，这是你的超能力。但副作用是：当别人只是需要一句"我懂，这确实很糟"的时候，你的"没事的"会让他们更加孤独。',
      tags: ['乐观悍匪', '这不是好事吗', '精神打不倒'],
      fun: '这是好事儿啊',
      profile: { A: 50, E: 52, S: 50, D: 18, O: 85, I: 50 }
    },
    '朱之文': {
      id: 9, name: '朱之文',
      knife: '我是老实，不是傻。',
      desc: '你是这个时代的稀有品种。真诚、淳朴，心胸宽得让人有点不敢相信。别人觉得你好欺负，其实你只是觉得没必要计较——你见过更大的事，这些不算什么。你的善良不是懦弱，是大智慧。但你的善良也有底线，那条线平时看不见，一旦被触碰，所有人才意识到你不是软的。别把老实人逼急了。',
      emotion: '你的情绪稳定得像一块磐石。你的善良不是情绪化的冲动，而是一种稳定的内在选择——你选择对这个世界温柔，不是因为你不懂恶，而是因为你见过之后依然选了善。你很少有剧烈的情绪波动，你的温暖是持续的、可预测的。但别误会，你的平静不是软弱，是一种力量。那条线平时看不见，但它在。',
      tags: ['老实人但不好惹', '善良有锋芒', '大智若愚Pro'],
      fun: 'hello everyone',
      isEasterEgg: true,
      profile: { A: 92, E: 22, S: 50, D: 20, O: 72, I: 8 }
    },
    '玻璃': {
      id: 10, name: '玻璃',
      knife: '别碰我，会碎。但不碰我，会冷。',
      desc: '你的心思像蜘蛛网，最轻的触碰都会引起连锁反应。别人随口一句话，你能想三天；一个没回的消息，你能演出三个剧本。你不是矫情，你是真真切切感受到了别人感受不到的震动。你的敏感有时候是天赋，更多时候只是让你更累。你为这种敏感痛苦，但它同时也让你成为最能感知细节的人——就看它今天以哪种方式出现。',
      emotion: '你的情绪是一张高精度的蛛网——最轻的触碰都会引起全网的连锁反应。别人感受不到的细微变化，在你这里是四级地震。你的共情深度是常人难以企及的，但代价是你几乎没有情绪免疫系统。外界的信息进来很容易，出去很难。你为这种敏感痛苦，但它也是你的天赋——你是人间测震仪，能感知别人感知不到的世界。',
      tags: ['高敏感体质', '人间测震仪', '易碎但珍贵'],
      fun: '爱的很透明像是玻璃',
      profile: { A: 50, E: 85, S: 18, D: 50, O: 12, I: 18 }
    },
    '嘉豪': {
      id: 11, name: '嘉豪',
      knife: '你以为你是全场焦点，你确实是——因为大家都在看你出丑。',
      desc: '你走进一个房间，第一件事是确认有没有人注意到你，第二件事是确保他们继续注意你。你觉得你很帅，你觉得你很有魅力，你说的话很好笑——最后那个是真的，但原因不是你以为的那种。大家记住你了，记住你是那个很搞笑的。你提供了全场80%的笑点，换来的评价是"他好逗"，不是"他很酷"。你想要的那个，你没得到。',
      emotion: '你的情绪是舞台上的聚光灯——必须有观众。快乐需要被看见，悲伤也需要被见证。没人注意的时候，你的情绪会迅速贬值，因为你不太确定一个人感受一件事有什么意义。你把存在感当成安全感的替代品，但存在感是别人给的，安全感只能自己给。你提供的快乐是真实的，但你想要的是被认真对待，而不是被当成气氛组。',
      tags: ['存在感是命', '小丑本丑', '自我感觉良好系'],
      fun: '豪到我了',
      profile: { A: 15, E: 90, S: 90, D: 50, O: 62, I: 72 }
    },
    '万人迷': {
      id: 12, name: '万人迷',
      knife: '你什么都不用做，站着就是吸引力法则。',
      desc: '你的魅力不靠技巧，靠天生的亲和力。小猫小狗、小朋友，还有所有年龄段的成年人，都忍不住靠近你。你不是故意的，但你就是有一种让人放下防备的磁场。你也因此承接了很多人的倾诉——他们觉得你安全。但你偶尔也会想：他们喜欢的到底是我，还是在我身边的那种舒适感？',
      emotion: '你的情绪像一块磁铁——你不主动发出信号，但别人会主动把他们的情绪交给你。你承接了太多不属于你的重量，而你自己的情绪很少有人主动问起。别人觉得你"没事"，因为你看起来太好了。你习惯了被当成安全的树洞，但有的时候，你也想当那个倾诉的人。你的磁场是天赋，但天赋也有代价。',
      tags: ['人间吸铁石', '亲和力爆表', '团宠本宠'],
      fun: '好感圣体',
      profile: { A: 58, E: 35, S: 68, D: 25, O: 65, I: 20 }
    },
    '天使': {
      id: 13, name: '天使',
      knife: '下凡是来渡劫，任务是救苦救难。',
      desc: '你有一种天生的使命感，叫"让世界再温柔一点点"。给陌生人指路，给哭泣的人递纸，给迷茫的人当灯塔。你不是圣母，你做这些也不是表演，你就是控制不住地对这个世界温柔。但你和万人迷不同——你是主动出击，是你选择去靠近、去帮、去给。只是有时候你帮的那个人并不想被帮，这件事你还没完全想通。',
      emotion: '你的情绪是一道光——你是主动把光照向别人的人。你不是被动地被需要，你是主动去寻找需要被帮助的人。这种使命感是你最核心的驱动力，但它的代价是：你很少给自己留光。你的情绪能量几乎全部流向外部，你觉得帮助别人就是帮助自己。但有时候，你需要帮助的那个人，恰好是你自己。而当有人想帮你的时候，你反而不知道怎么办。',
      tags: ['行走的治愈剂', '善良是本能', '但有时候用力过猛'],
      fun: '完全天堂下凡来的',
      profile: { A: 72, E: 53, S: 52, D: 32, O: 64, I: 30 }
    },
    '隐身玩家': {
      id: 14, name: '隐身玩家',
      knife: '游戏里的隐身技能，我活成了日常。',
      desc: '你在人生这场游戏里选择了潜行模式。不组队、不开麦、不抢人头，但地图上每个角落你都去过。你什么都知道，什么都不说，默默发育，等到结算的时候，你活得最久。你不是社恐，你是太清醒——你知道大多数热闹都和你没什么关系，所以你选择旁观。你的存在感是0，但你的影响力往往在你离开以后才显现。',
      emotion: '你的情绪是一座无人岛——什么都有，但没有人来访。你的内心世界丰富而完整，但它是完全内向的。你不是没有情绪，你只是觉得没必要把它们展示出来。你什么都知道，什么都不说。这种沉默不是压抑，是一种选择——你选择了旁观，因为你发现大多数热闹确实和自己没什么关系。你的存在感是0，但你的感受力是满分。',
      tags: ['人间观察家', '潜行模式', '闷声过得好'],
      fun: '潜水证10级',
      profile: { A: 62, E: 5, S: 5, D: 62, O: 55, I: 5 }
    },
    '独美选手': {
      id: 15, name: '独美选手',
      knife: '不是孤独，是选择性的独美。',
      desc: '你享受独处，不是因为没有朋友，而是因为自己就足够有意思。你可以一个人吃完一顿好饭，一个人看完一场电影，一个人旅行还能玩得很精彩。你把时间花在经营自己身上，花开好了，蝴蝶爱来不来。但偶尔，你也会在深夜问自己：我是真的享受独处，还是只是习惯了？',
      emotion: '你的情绪是自给自足的闭环系统。你不太需要别人的情绪输入，也不太输出情绪给别人。你不是冷漠，你是真的不需要太多外部情绪交换。你享受这种独立，你的快乐不依赖任何人。但在某个深夜，你可能会有一瞬间想：如果有一天我真的需要一个人，我还会打电话吗？——然后你忘了这件事，继续你的独美生活。',
      tags: ['独处艺术家', '自给自足', '一人即世界'],
      fun: '哪怕世界毁灭，我独自美丽~',
      profile: { A: 20, E: 20, S: 5, D: 18, O: 75, I: 50 }
    },
    '乐子人': {
      id: 16, name: '乐子人',
      knife: '我不是在找乐子，我就是乐子本身。',
      desc: '你来人间一趟，主要任务是收集快乐素材。什么梗都逃不过你的眼睛，什么幽默的边角料你都能接住。你是朋友圈的快乐批发商，永远站在吃瓜和造梗的第一线。但你找乐子找得这么努力，有时候只是因为安静下来有点可怕。笑声停了，你不确定剩下的是什么。所以你继续找，继续笑，继续是那个让所有人快乐的人。',
      emotion: '你的情绪表面上是快乐的批发市场——笑是你最熟悉的情绪，因为它比哭容易。你找乐子找得这么努力，有时候只是因为安静下来有点可怕。笑声停了之后，你不确定剩下的是什么，所以你继续找下一个笑点。你把快乐做成了永不停歇的生产线，但当工厂停电的时候，那些被你用笑声压住的东西，会一起涌上来。你的快乐是真的，但它也是你的盾牌。',
      tags: ['快乐批发商', '梗界扛把子', '笑是最好的盾'],
      fun: '奖池还在叠加，求你住嘴吧，笑到一定程度已经是痛苦了',
      profile: { A: 37, E: 72, S: 72, D: 38, O: 82, I: 72 }
    }
  };

  // ID 排序
  var personaList = [];
  for (var key in PERSONAS) {
    if (PERSONAS.hasOwnProperty(key)) personaList.push(PERSONAS[key]);
  }
  personaList.sort(function (a, b) { return a.id - b.id; });

  // ==========================================
  // 渲染卡片网格
  // ==========================================
  function renderGrid() {
    var grid = document.getElementById('galleryGrid');
    var html = '';
    for (var i = 0; i < personaList.length; i++) {
      var p = personaList[i];
      var cardClass = p.isEasterEgg ? 'persona-card rare-card' : 'persona-card';
      var badgeHtml = p.isEasterEgg ? '<span class="card-badge">稀有</span>' : '';

      var tagsHtml = '';
      for (var j = 0; j < p.tags.length; j++) {
        tagsHtml += '<span class="card-tag">#' + p.tags[j] + '</span>';
      }

      html +=
        '<div class="' + cardClass + '" data-key="' + p.name + '" style="animation-delay:' + (i * 0.04) + 's">' +
        badgeHtml +
        '<img class="card-portrait" src="人格画像/' + encodeURIComponent(p.name) + '.jpg" alt="' + p.name + '" loading="lazy">' +
        '<div class="card-id">NO.' + String(p.id).padStart(2, '0') + '</div>' +
        '<div class="card-name">' + p.name + '</div>' +
        '<div class="card-knife">' + p.knife + '</div>' +
        '<div class="card-tags">' + tagsHtml + '</div>' +
        '</div>';
    }
    grid.innerHTML = html;

    // 绑定点击（click + touchend 兼容移动端）
    var cards = grid.querySelectorAll('.persona-card');
    for (var k = 0; k < cards.length; k++) {
      cards[k].addEventListener('click', function () {
        var key = this.getAttribute('data-key');
        openModal(PERSONAS[key]);
      });
      cards[k].addEventListener('touchend', function(e) {
        e.preventDefault();
        var key = this.getAttribute('data-key');
        openModal(PERSONAS[key]);
      });
    }
  }

  // ==========================================
  // 详情弹窗
  // ==========================================
  function openModal(persona) {
    var overlay = document.getElementById('modalOverlay');
    var card = document.getElementById('modalCard');
    var inner = document.getElementById('modalInner');

    if (persona.isEasterEgg) {
      card.className = 'modal-card rare-modal';
    } else {
      card.className = 'modal-card';
    }

    var rareBadge = persona.isEasterEgg
      ? '<div class="modal-rare-badge">🌟 稀有人格 · 触发概率 &lt;5%</div>' : '';

    // 维度条
    var barsHtml = '';
    var order = ['E', 'A', 'S', 'O', 'I', 'D'];
    for (var i = 0; i < order.length; i++) {
      var dim = order[i];
      var val = persona.profile[dim];
      var color = DIM_COLORS[dim];
      var label = DIM_LABELS[dim];
      barsHtml +=
        '<div class="modal-bar-row">' +
        '<span class="modal-bar-label">' + label + '</span>' +
        '<div class="modal-bar-track">' +
        '<div class="modal-bar-fill" style="width:' + val + '%;background:' + color +
        ';box-shadow:0 0 8px ' + color + ';"></div>' +
        '</div>' +
        '</div>';
    }

    var tagsHtml = '';
    for (var j = 0; j < persona.tags.length; j++) {
      tagsHtml += '<span class="modal-tag">#' + persona.tags[j] + '</span>';
    }

    inner.innerHTML =
      rareBadge +
      '<img class="modal-portrait" src="人格画像/' + encodeURIComponent(persona.name) + '.jpg" alt="' + persona.name + '">' +
      '<div class="modal-name">' + persona.name + '</div>' +
      '<div class="modal-knife">🔪 ' + persona.knife + '</div>' +
      '<div class="modal-section">' +
      '<div class="modal-section-title">📖 人格画像</div>' +
      '<div class="modal-desc">' + persona.desc + '</div>' +
      '</div>' +
      '<div class="modal-section">' +
      '<div class="modal-section-title">🧠 情绪模式</div>' +
      '<div class="modal-emotion">' + persona.emotion + '</div>' +
      '</div>' +
      '<div class="modal-bars">' + barsHtml + '</div>' +
      '<div class="modal-tags">' + tagsHtml + '</div>' +
      '<div class="modal-fun">' + persona.fun + '</div>';

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // 延迟触发维度条动画
    setTimeout(function () {
      var fills = inner.querySelectorAll('.modal-bar-fill');
      for (var k = 0; k < fills.length; k++) {
        fills[k].style.width = fills[k].style.width;
      }
    }, 100);
  }

  function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  // ==========================================
  // 启动
  // ==========================================
  function init() {
    renderGrid();

    var modalClose = document.getElementById('modalClose');
    modalClose.addEventListener('click', closeModal);
    modalClose.addEventListener('touchend', function(e) { e.preventDefault(); closeModal(); });

    var overlay = document.getElementById('modalOverlay');
    overlay.addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });
    overlay.addEventListener('touchend', function(e) {
      if (e.target === this || !e.target.closest('#modalCard')) { e.preventDefault(); closeModal(); }
    });

    // ESC 关闭
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
