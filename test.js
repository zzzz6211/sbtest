/**
 * 承认吧，你就是_____ — 测试页逻辑
 * 30题数据 + 选项交互 + 淡入淡出切换
 */

(function () {
  'use strict';

  // ==========================================
  // 30 道题目数据
  // ==========================================
  var questions = [
    {
      id: 1,
      text: '朋友半夜发来"好烦啊"，你第一反应是？',
      options: [
        '直接打电话，不管几点',
        '回"说来听听"，彻夜长谈ing',
        '先发个表情包再说',
        '打了很长一段话，发送前全删了，装已经入睡没看到消息'
      ]
    },
    {
      id: 2,
      text: '你最近一次当众出丑，事后你是？',
      options: [
        '反复回想，脑子里循环播放，停不下来',
        '当时想死，但第二天真忘了',
        '当场转化成笑点，只要我不尴尬，那尴尬的就是别人',
        '太好了，又多了一个睡前专属折磨素材'
      ]
    },
    {
      id: 3,
      text: '朋友问"你最近怎么样"，你的真实回答是？',
      options: [
        '"活人微死"（很久没好好过了，但解释太麻烦）',
        '"不好，你听我说——"',
        '"很好啊！"（是真的很好）',
        '"唉"，然后没有然后（说来话长）'
      ]
    },
    {
      id: 4,
      text: '群里有人说了件没什么意思的事，你会？',
      options: [
        '随手发个"哈哈哈"，打个卡就走',
        '发个表情包，活跃但不表态',
        '已读，然后把群设成免打扰，顺便把通知也关了',
        '接梗，顺便把话题带到更有意思的方向'
      ]
    },
    {
      id: 5,
      text: '你朋友私下最可能怎么评价你？',
      options: [
        '"他什么都知道，但什么都不说"',
        '"好说话，找他准没错"',
        '"他太好笑了"（不是夸你帅的那种好笑）',
        '"他一个人也行，不太需要人"'
      ]
    },
    {
      id: 6,
      text: '你定了个计划，当天完全没执行，你会？',
      options: [
        '调整，今天没做明天补，不纠结',
        '翻来覆去内耗，觉得自己废了',
        '觉得这个计划本来就没必要，所以不算失败',
        '发个"下次一定"，发完继续摆'
      ]
    },
    {
      id: 7,
      text: '有人当众指出你的错误，你第一反应是？',
      options: [
        '行，踢到我算是踢到棉花了',
        '当场表情管理撑住了，回家再死',
        '承认，谢谢，下次继续',
        '谁对谁错还没定论，高低跟你理论理论'
      ]
    },
    {
      id: 8,
      text: '你的社交媒体/朋友圈状态是？',
      options: [
        '高频更新，吃饭出门心情全发',
        '偶尔发，发之前想很久要不要发',
        '基本不发，但每条都看',
        '不用，或者注册了从来没发过'
      ]
    },
    {
      id: 9,
      text: '去一个认识人不多的聚会，你会？',
      options: [
        '主动找人搭话，聊起来停不下来',
        '找个角落待着，观察大家，等人来找我',
        '黏着唯一认识的那个人，他去厕所我都想跟着',
        '一直刷手机，礼貌性撑完这个晚上'
      ]
    },
    {
      id: 10,
      text: '深夜睡不着，你大概率在干嘛？',
      options: [
        '反复回想今天某个细节，有时候是几年前的',
        '刷手机，刷到眼睛自己闭上',
        '找人聊天，哪怕说废话',
        '强迫自己闭眼，不让脑子转'
      ]
    },
    {
      id: 11,
      text: '你帮了朋友一个大忙，对方没道谢，你会？',
      options: [
        '心里记着，嘴上不说，我记性一向很好（下次你等着）',
        '直接说：我帮了你这么多，就这？',
        '记在心里，下次他找我，我再想想',
        '真没所谓，帮完就帮完了'
      ]
    },
    {
      id: 12,
      text: '你经历了一件很难过的事，你会？',
      options: [
        '找朋友倾诉，说很久',
        '一个人扛，不想麻烦别人，也不想解释',
        '发朋友圈或在网上小号写，说不出口的打出来',
        '赶快找点别的事，不给自己留难过的档期'
      ]
    },
    {
      id: 13,
      text: '有人提出一个你认为不对的观点，你会？',
      options: [
        '立刻指出哪里不对',
        '说"确实有道理"，然后完全不按他说的来',
        '懒得争，点头，走',
        '反问他几个问题，让他自己把话说死'
      ]
    },
    {
      id: 14,
      text: '你说过很狠的话，然后后悔过吗？',
      options: [
        '经常，属于先开枪再想有没有子弹那种',
        '有，后悔了会道歉，但不一定说清楚在道歉什么',
        '基本没有，我说话前会过一遍',
        '说过，不后悔，我就是那个意思'
      ]
    },
    {
      id: 15,
      text: '你觉得朋友真正了解你几成？',
      options: [
        '九成以上，心事全在脸上',
        '五成左右，剩下的不必要说',
        '三成不到，真正了解我的没几个',
        '测完这题我开始怀疑了'
      ]
    },
    {
      id: 16,
      text: '如果你的人生是一款游戏，你会选哪个模式？',
      options: [
        '剧情模式，跟着走，把故事看完',
        '自由模式，地图全跑，不走主线',
        '多人联机，没人一起玩就不想玩',
        '观战模式，先看别人打观察一手，我研究研究'
      ]
    },
    {
      id: 17,
      text: '别想了，凭直觉选一个：',
      options: [
        '选我',
        '我好像是正确答案',
        '随便（但还是看了三遍）',
        '凭什么这道题也要我来决定'
      ]
    },
    {
      id: 18,
      text: '如果你的情绪是今天的天气，是？',
      options: [
        '晴，偶尔有云，整体可以',
        '阴，不下雨，但说不好',
        '雷阵雨，不知道什么时候炸',
        '大雾，连我自己都不知道我在想什么'
      ]
    },
    {
      id: 19,
      text: '你发了一条朋友圈，一小时后删了，为什么？',
      options: [
        '发完觉得太暴露了，不想别人知道当时状态，心想：应该没人看到吧',
        '没人点赞，当它从未存在过',
        '发完就后悔了，不知道当时在想什么',
        '我不删，删了说明我心虚'
      ]
    },
    {
      id: 20,
      text: '你一个人吃饭，旁边有人突然吵起来，你会？',
      options: [
        '低头继续吃，假装什么都没发生别波及到我的饭就好',
        '忍不住偷听吃瓜，在心里分析谁有理',
        '掏出手机，这素材不用太可惜了必须记录生活一下',
        '感觉很不舒服，赶快吃完走'
      ]
    },
    {
      id: 21,
      text: '不解释，选一个最接近你今天状态的：',
      options: [
        '刚充满电的手机',
        '开了一半没动的外卖',
        '没人打开过的草稿箱',
        '换季没来得及收的衣服'
      ]
    },
    {
      id: 22,
      text: '便利店收银员突然问你"你今天过得好吗"，你会？',
      options: [
        '愣一下，然后真的开始说，就差说银行卡密码了',
        '"还行"，快速结束话题',
        '觉得这人挺有意思，但不知道怎么接',
        '礼貌地笑一下，内心：？'
      ]
    },
    {
      id: 23,
      text: '深夜刷手机，你更容易？',
      options: [
        '看到好东西，马上转发给朋友',
        '一个人看完，关屏睡觉'
      ]
    },
    {
      id: 24,
      text: '你更认同哪句？',
      options: [
        '善良不需要理由',
        '善良要留给值得的人'
      ]
    },
    {
      id: 25,
      text: '地铁上有人大声外放视频，你会？',
      options: [
        '皱眉，忍着，啧一下。在心里把他骂了一百遍',
        '走过去说"能小声点吗"'
      ]
    },
    {
      id: 26,
      text: '你最害怕哪种感觉？',
      options: [
        '想帮别人，但发现自己已经没有余力了',
        '消失了一段时间，没有人主动来找你，无人在意',
        '人太多太吵，找不到自己在哪',
        '一个人太久，脑子里开始空了'
      ]
    },
    {
      id: 27,
      text: '你觉得自己最大的问题是什么？',
      options: [
        '太容易心软，知道在被拿捏，偏偏自己还就是软柿子',
        '嘴快，说完才想后果',
        '知道该做什么，但计划永远比执行精彩',
        '太敏感，别人一句随口的话，我能给它写一篇读后感'
      ]
    },
    {
      id: 28,
      text: '现在最接近你的状态是？',
      options: [
        '表面没事，实际上不知道自己怎么了',
        '天大的事，先睡一觉明天再说',
        '也没什么特别的，就是想被看见一下',
        '不用管我，我自己能搞定，也不需要人搞定'
      ]
    },
    {
      id: 29,
      text: '你觉得你身上最值钱的是什么？',
      options: [
        '能让所有人都开心的能力',
        '对别人感受的敏锐，细节都逃不过我',
        '什么都看得出来，但知道什么时候该闭嘴',
        '放到哪里都能活，不依赖任何环境'
      ]
    },
    {
      id: 30,
      text: '最后一题，用一个词形容你自己？',
      options: [
        '温柔',
        '有趣',
        '清醒',
        '自由'
      ]
    }
  ];

  var totalQuestions = questions.length;
  var currentIndex = 0;
  var selectedOption = null;

  // DOM
  var stage = document.getElementById('questionStage');
  var questionNumber = document.getElementById('questionNumber');
  var questionText = document.getElementById('questionText');
  var optionsList = document.getElementById('optionsList');
  var btnNext = document.getElementById('btnNext');
  var progressFill = document.getElementById('progressFill');
  var progressNum = document.getElementById('progressNum');

  // ==========================================
  // 渲染题目
  // ==========================================
  function renderQuestion(index) {
    var q = questions[index];
    selectedOption = null;

    questionNumber.textContent = 'Q' + q.id;
    questionText.textContent = q.text;

    // 选项 HTML
    var labels = ['A', 'B', 'C', 'D'];
    var html = '';
    for (var i = 0; i < q.options.length; i++) {
      html +=
        '<button class="option-btn" data-index="' + i + '">' +
        '<span class="option-label">' + labels[i] + '</span>' +
        q.options[i] +
        '</button>';
    }
    optionsList.innerHTML = html;

    // 绑定选项点击（click + touchend 兼容移动端）
    var btns = optionsList.querySelectorAll('.option-btn');
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener('click', onOptionClick);
      btns[j].addEventListener('touchend', function(e) { e.preventDefault(); this.click(); });
    }

    // 更新进度条
    updateProgress(index);
    updateNextButton();
  }

  // ==========================================
  // 选项点击
  // ==========================================
  function onOptionClick(e) {
    var btn = e.currentTarget;
    var index = parseInt(btn.getAttribute('data-index'));

    // 取消旧选中
    var prev = optionsList.querySelector('.option-btn.selected');
    if (prev) { prev.classList.remove('selected'); }

    // 设置新选中
    btn.classList.add('selected');
    selectedOption = index;
    updateNextButton();
  }

  // ==========================================
  // 下一题按钮状态
  // ==========================================
  function updateNextButton() {
    if (selectedOption !== null) {
      btnNext.disabled = false;
      if (currentIndex === totalQuestions - 1) {
        btnNext.querySelector('.btn-next-text').textContent = '查看结果';
        btnNext.classList.add('is-last');
      }
    } else {
      btnNext.disabled = true;
    }
  }

  // ==========================================
  // 进度条
  // ==========================================
  function updateProgress(index) {
    var pct = ((index + 1) / totalQuestions) * 100;
    progressFill.style.width = pct + '%';
    progressNum.textContent = (index + 1) + '/' + totalQuestions;
  }

  // ==========================================
  // 切题动画
  // ==========================================
  function goToNext() {
    if (selectedOption === null) return;

    // 禁用所有选项
    var btns = optionsList.querySelectorAll('.option-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.add('disabled');
    }
    btnNext.disabled = true;

    // 记录答案（后续人格计算用）
    saveAnswer(currentIndex, selectedOption);

    // 如果是最后一题
    if (currentIndex >= totalQuestions - 1) {
      finishTest();
      return;
    }

    // 淡出 → 切换内容 → 淡入
    stage.classList.add('fade-out');

    setTimeout(function () {
      currentIndex++;
      renderQuestion(currentIndex);
      stage.classList.remove('fade-out');
      stage.classList.add('fade-in');
      setTimeout(function () {
        stage.classList.remove('fade-in');
      }, 400);
    }, 300);
  }

  // ==========================================
  // 保存答案
  // ==========================================
  var answers = [];
  function saveAnswer(qIndex, optIndex) {
    answers[qIndex] = optIndex;
  }

  // ==========================================
  // 完成测试
  // ==========================================
  function finishTest() {
    progressFill.style.width = '100%';
    progressNum.textContent = '30/30';

    // 保存答案到 localStorage
    localStorage.setItem('sbtest_answers', JSON.stringify(answers));

    // 显示过渡动画
    stage.classList.add('fade-out');
    setTimeout(function () {
      questionNumber.textContent = '';
      questionText.textContent = '正在分析你是个什么玩意儿……';
      questionText.style.textAlign = 'center';
      questionText.style.color = '#c084fc';
      questionText.style.fontSize = '1.2rem';
      optionsList.innerHTML = '';
      btnNext.style.display = 'none';
      stage.classList.remove('fade-out');
      stage.classList.add('fade-in');
      setTimeout(function () {
        stage.classList.remove('fade-in');
      }, 400);
    }, 300);

    // 1.5秒后跳转结果页
    setTimeout(function () {
      window.location.href = 'result.html';
    }, 2000);
  }

  // ==========================================
  // 按钮事件
  // ==========================================
  btnNext.addEventListener('click', goToNext);
  btnNext.addEventListener('touchend', function(e) { e.preventDefault(); this.click(); });

  // ==========================================
  // 网感特效层（搞笑抽象互联网风）
  // ==========================================
  var glitchCanvas = document.getElementById('glitchFx');
  var gctx = glitchCanvas.getContext('2d');
  var gw, gh;

  function glitchResize() {
    gw = glitchCanvas.width = window.innerWidth;
    gh = glitchCanvas.height = window.innerHeight;
  }

  // 漂浮符号池
  var floatingSymbols = [];
  var symbolPool = [
    '?', '!', '?!', '~', '*', '◇', '◆', '○', '●', '×',
    '→', '←', '↑', '↓', '…', '//', '=', '≈', '∞',
    ':)', ':(', ':P', ';)', '-_-', 'O_O', '>_<', 'T_T',
    '哈哈', '笑死', '草', '啊', '啧', '唉', '呃', '6', '绝了',
    '¿', '¡', '!!', '???', '...', '·', '· · ·'
  ];

  function spawnSymbol() {
    return {
      x: Math.random() * gw,
      y: gh + 30,
      text: symbolPool[Math.floor(Math.random() * symbolPool.length)],
      size: Math.random() * 16 + 10,
      speed: Math.random() * 0.4 + 0.2,
      opacity: Math.random() * 0.2 + 0.08,
      life: 0,
      maxLife: Math.random() * 400 + 300,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: (Math.random() - 0.5) * 0.02
    };
  }

  // 弹幕系统（网感热梗，右进左出）
  var danmakuList = [];
  var danmakuPool = [
    // —— 被看穿 / 被监视感 ——
    '谁在我家装摄像头了',
    '能不能别监视我的生活',
    '这道题是照着我出的吧',
    '怎么每道题都在说我',
    '被说中了有点烦',
    '你看我像高兴的样子吗',
    '你怎么什么都知道',
    '这测试是不是在我脑子里安了监控',
    '连这都知道？',
    '你不对劲',
    '你是不是偷看我聊天记录了',
    '谁把我的日记公开了',
    '为什么偷看我的人生',
    '这个测试有点恐怖',

    // —— 嘴硬 / 死不承认 ——
    '假如我绷住了呢',
    '我没有我不是别瞎说',
    '不可能绝对不可能',
    '我只是不想选而已',
    '我不是在逃避 我只是战略性撤退',
    '嘴硬但手已经选了',
    '我根本不这样 但这次先选这个',
    '纯属巧合',
    '这次不算',
    '我平时不这样的',
    '一定是题目有问题',
    '这不是我 只是刚好符合',
    '行吧 就这一次',

    // —— 找借口 / 转移话题 ——
    '我替我朋友先睡了',
    '我有个朋友不太舒服先下了',
    '突然不想测了',
    '这道题能不能跳过',
    '我想去喝口水',
    '手机没油了',
    '我先去冷静一下马上回来',
    '等一下我先缓缓',
    '突然有点事改天继续',
    '暂停一下我需要心理建设',
    '我CPU烧了让我重启一下',
    '大脑过载了',

    // —— 破防瞬间 ——
    '撤回 对我不好',
    '伤害性不大 侮辱性极强',
    '这道题伤到我了',
    '怎么有人把实话全说出来了',
    '你能不能不要这么直接',
    '被戳到了 但不承认',
    '请问你礼貌吗',
    '这也太真实了 能不能编一下',
    '我开始慌了',
    '怎么越往后越扎心',
    '第几题了 我已经累了',
    '救救我',

    // —— 内心慌张 / 暴露 ——
    '汗流浃背了',
    '已经开始出汗了',
    '怎么还没结束',
    '求放过',
    '我不选 我要想想',
    '每一个选项都是在说我',
    '完了 好像全中',
    '我朋友肯定说我选的不对',
    '选完就后悔了',
    '能不能重新选',

    // —— 弹幕互动 / 找同类 ——
    '有人也选了B吗',
    '选A的扣1',
    '前面的等等我',
    '有人和我一样纠结吗',
    '我以为只有我这样',
    '怎么大家都在选这个',
    '握手 和我一样',

    // —— 热梗轻量 ——
    '哈哈哈哈哈哈哈哈',
    '笑死',
    '尊嘟假嘟',
    '绷不住了',
    '太真实了',
    '主打一个真实',
    '好家伙',
    '那咋了',
    '包的',
    '没事哒没事哒',
    '精神状态短暂正常',
    '你说的都对',
    '还好吧 也就那样',

    // —— 测着测着的碎碎念 ——
    '怎么才第5题',
    '30题根本不够',
    '已经选了就不想了',
    '我已经在猜我是啥了',
    '结果不会太离谱吧',
    '希望测出来正常一点',
    '正在加载人格…',
    '应该不是傻波一吧',
    '测完就发朋友圈',
    '好想知道结果',
  ];

  function spawnDanmaku() {
    var colors = ['#c084fc','#d8b4fe','#7ec8c0','#f9a8d4','#fde68a','#a78bfa','#67e8f9','#e9d5ff'];
    return {
      text: danmakuPool[Math.floor(Math.random() * danmakuPool.length)],
      x: gw + Math.random() * 200,
      y: Math.random() * gh * 0.75 + gh * 0.05,
      speed: Math.random() * 0.6 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 7 + 11,
      opacity: Math.random() * 0.15 + 0.07,
      life: 0
    };
  }

  function drawDanmaku() {
    for (var i = danmakuList.length - 1; i >= 0; i--) {
      var d = danmakuList[i];
      d.x -= d.speed;
      d.life++;

      // 渐显渐隐
      var fadeIn = Math.min(1, d.life / 50);
      var fadeOut = d.x < 200 ? d.x / 200 : 1;
      var alpha = Math.max(0, Math.min(1, fadeIn * fadeOut)) * d.opacity;

      gctx.font = d.size + 'px "PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif';
      gctx.fillStyle = d.color.replace(')', ',' + alpha + ')').replace('rgb', 'rgba');
      if (d.color.startsWith('#')) {
        var r = parseInt(d.color.slice(1,3), 16);
        var g = parseInt(d.color.slice(3,5), 16);
        var b = parseInt(d.color.slice(5,7), 16);
        gctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
      }
      gctx.fillText(d.text, d.x, d.y);

      if (d.x < -300) danmakuList.splice(i, 1);
    }

    // 每帧概率生成弹幕
    if (Math.random() < 0.025) {
      danmakuList.push(spawnDanmaku());
    }
  }

  // 彩色闪点
  var sparkles = [];
  function spawnSparkle() {
    var colors = ['#c084fc','#7ec8c0','#f9a8d4','#fde68a','#a78bfa','#67e8f9'];
    return {
      x: Math.random() * gw,
      y: Math.random() * gh,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 3 + 0.5,
      opacity: 0,
      life: 0,
      maxLife: Math.random() * 150 + 80,
      phase: Math.random() * Math.PI * 2
    };
  }

  function drawGlitchFx() {
    gctx.clearRect(0, 0, gw, gh);

    var now = Date.now();

    // ---- 漂浮符号 ----
    for (var i = floatingSymbols.length - 1; i >= 0; i--) {
      var s = floatingSymbols[i];
      s.y -= s.speed;
      s.life++;
      s.wobble += s.wobbleSpeed;
      var wobX = Math.sin(s.wobble) * 15;
      var fade = s.life < 60 ? s.life / 60 : (s.maxLife - s.life) / 80;
      var alpha = Math.max(0, Math.min(1, fade)) * s.opacity;

      gctx.font = s.size + 'px "PingFang SC","Microsoft YaHei",sans-serif';
      gctx.fillStyle = 'rgba(192,132,252,' + alpha + ')';
      gctx.fillText(s.text, s.x + wobX, s.y);

      if (s.life > s.maxLife || s.y < -60) {
        floatingSymbols.splice(i, 1);
      }
    }

    // 定期生成新符号
    if (Math.random() < 0.04) {
      floatingSymbols.push(spawnSymbol());
    }

    // ---- 弹幕 ----
    drawDanmaku();

    // ---- 闪点 ----
    for (var k = sparkles.length - 1; k >= 0; k--) {
      var sp = sparkles[k];
      sp.life++;
      var spFade = Math.sin(sp.life / sp.maxLife * Math.PI);
      sp.opacity = Math.max(0, spFade * 0.7);

      gctx.beginPath();
      gctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      gctx.fillStyle = sp.color.replace(')', ',' + sp.opacity + ')').replace('rgb', 'rgba');
      if (sp.color.startsWith('#')) {
        // hex to rgba rough
        var r = parseInt(sp.color.slice(1,3), 16);
        var g = parseInt(sp.color.slice(3,5), 16);
        var b = parseInt(sp.color.slice(5,7), 16);
        gctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + sp.opacity + ')';
      }
      gctx.fill();

      // 十字光芒（大闪点）
      if (sp.size > 1.5 && sp.opacity > 0.3) {
        gctx.strokeStyle = gctx.fillStyle;
        gctx.lineWidth = 0.5;
        gctx.beginPath();
        gctx.moveTo(sp.x - sp.size * 3, sp.y);
        gctx.lineTo(sp.x + sp.size * 3, sp.y);
        gctx.moveTo(sp.x, sp.y - sp.size * 3);
        gctx.lineTo(sp.x, sp.y + sp.size * 3);
        gctx.stroke();
      }

      if (sp.life > sp.maxLife) sparkles.splice(k, 1);
    }

    if (Math.random() < 0.15) {
      sparkles.push(spawnSparkle());
    }

    requestAnimationFrame(drawGlitchFx);
  }

  // ==========================================
  // 启动
  // ==========================================
  glitchResize();
  window.addEventListener('resize', function () { glitchResize(); });
  drawGlitchFx();
  renderQuestion(0);
})();
