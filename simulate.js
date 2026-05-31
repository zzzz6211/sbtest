/**
 * 人格匹配 · 完整链路模拟 v2 (MBTI式分类匹配)
 * 10000次随机答题 → SCORE_MATRIX → raw → sigmoid → L/M/H分类 → 模式匹配 → 统计
 * 用法: node simulate.js [trialCount]
 */
const SCORE_MATRIX = [
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
const OPT = SCORE_MATRIX.map(function(r) { return r.length; });
function isW(q) { return (q >= 22 && q <= 24) || (q >= 27 && q <= 29); }
const DIMS = ['A','E','S','D','O','I'];
const DIM_NAMES = {A:'利他',E:'外显',S:'社交',D:'数字',O:'乐观',I:'烈度'};

// Sigmoid参数 (匹配实际raw score分布, logistic scale ≈ 0.55×std)
const CENTERS = {A:9.5, E:26.1, S:-0.9, D:8.1, O:9.1, I:-4.4};
const STDDEVS = {A:2.0, E:3.4, S:4.2, D:2.3, O:3.6, I:4.4};

// 经过百分位迭代优化的人格profiles (sigmoid兼容)
const PERSONAS = {
  '血包':   {name:'血包',profile:{A:85,E:70,S:50,D:18,O:28,I:18}},
  '五秒真男(女)人': {name:'五秒真男(女)人',profile:{A:28,E:90,S:62,D:10,O:50,I:90}},
  '电子蝴蝶': {name:'电子蝴蝶',profile:{A:10,E:70,S:10,D:95,O:48,I:48}},
  '傻波一': {name:'傻波一',profile:{A:52,E:24,S:24,D:22,O:80,I:24}},
  '雀食者': {name:'雀食者',profile:{A:60,E:24,S:64,D:22,O:36,I:24}},
  '补兑者': {name:'补兑者',profile:{A:15,E:48,S:50,D:12,O:17,I:55}},
  '法师':   {name:'法师',profile:{A:20,E:78,S:22,D:50,O:24,I:72}},
  '豪士':   {name:'豪士',profile:{A:50,E:52,S:50,D:18,O:85,I:50}},
  '玻璃':   {name:'玻璃',profile:{A:50,E:85,S:18,D:50,O:12,I:18}},
  '嘉豪':   {name:'嘉豪',profile:{A:15,E:90,S:90,D:50,O:62,I:72}},
  '万人迷': {name:'万人迷',profile:{A:58,E:35,S:68,D:25,O:65,I:20}},
  '天使':   {name:'天使',profile:{A:72,E:53,S:52,D:32,O:64,I:30}},
  '隐身玩家': {name:'隐身玩家',profile:{A:62,E:5,S:5,D:62,O:55,I:5}},
  '独美选手': {name:'独美选手',profile:{A:20,E:20,S:5,D:18,O:75,I:50}},
  '乐子人': {name:'乐子人',profile:{A:37,E:72,S:72,D:38,O:82,I:72}},
  '朱之文': {name:'朱之文',profile:{A:92,E:22,S:50,D:20,O:72,I:8},isEasterEgg:true}
};
const NAMES = Object.keys(PERSONAS).filter(function(k){return !PERSONAS[k].isEasterEgg;});

function calculateScores(answers) {
  var raw = {A:0,E:0,S:0,D:0,O:0,I:0};
  for (var q = 0; q < answers.length; q++) {
    var opt = answers[q];
    if (opt == null) continue;
    var map = SCORE_MATRIX[q][opt];
    if (!map) continue;
    var mult = isW(q) ? 1.5 : 1;
    for (var d in map) {
      if (raw.hasOwnProperty(d)) raw[d] += map[d] * mult;
    }
  }
  var norm = {};
  for (var d in raw) {
    var z = (raw[d] - CENTERS[d]) / STDDEVS[d];
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

// 维度分类阈值 (可调参以平衡分布)
var CAT_THRESH_LO = 30;  // ≤30 = L
var CAT_THRESH_HI = 70;  // ≥70 = H,  else M

function classifyCategory(score) {
  if (score <= CAT_THRESH_LO) return 'L';
  if (score >= CAT_THRESH_HI) return 'H';
  return 'M';
}

// 类别转数值 L=0, M=1, H=2 (用于计算邻近度)
function catVal(cat) { return cat === 'L' ? 0 : cat === 'H' ? 2 : 1; }

// MBTI+Euclidean混合匹配:
//   基础: Euclidean相似度(保证均匀分布)
//   加分: 分类匹配bonus(提供MBTI科学性, 每匹配1维度+4分, 最多+24)
//   总分 = euclideanSim + categoryBonus → 最高分匹配
var CAT_BONUS_PER_MATCH = 4;  // 每匹配1个维度类别+4分

function findBestMatch(scores, answers) {
  if (isZhuZhiwen(scores, answers)) return '朱之文';

  var bestScore = -Infinity, bestKey = null;
  for (var n = 0; n < NAMES.length; n++) {
    var key = NAMES[n];
    var p = PERSONAS[key].profile;
    // Euclidean相似度 (0-100)
    var sumSq = 0;
    for (var di = 0; di < DIMS.length; di++) {
      sumSq += Math.pow(scores[DIMS[di]] - p[DIMS[di]], 2);
    }
    var euclidSim = Math.max(0, 100 - Math.sqrt(sumSq) * 0.41);
    // 分类匹配bonus (0-24)
    var catMatches = 0;
    for (var di2 = 0; di2 < DIMS.length; di2++) {
      if (classifyCategory(scores[DIMS[di2]]) === classifyCategory(p[DIMS[di2]])) {
        catMatches++;
      }
    }
    var totalScore = euclidSim + catMatches * CAT_BONUS_PER_MATCH;
    if (totalScore > bestScore) { bestScore = totalScore; bestKey = key; }
  }
  return bestKey || '血包';
}

// 旧Euclidean匹配(保留用于对比)
function findBestMatchOld(scores, answers) {
  if (isZhuZhiwen(scores, answers)) return '朱之文';
  var bestKey = null, bestDist = Infinity;
  for (var n = 0; n < NAMES.length; n++) {
    var key = NAMES[n];
    var p = PERSONAS[key].profile;
    var sumSq = 0;
    for (var i = 0; i < DIMS.length; i++) {
      sumSq += Math.pow(scores[DIMS[i]] - p[DIMS[i]], 2);
    }
    if (sumSq < bestDist) {bestDist=sumSq;bestKey=key;}
  }
  return bestKey || '血包';
}

function randomAnswers() {
  var ans = [];
  for (var q = 0; q < SCORE_MATRIX.length; q++) {
    ans.push(Math.floor(Math.random() * OPT[q]));
  }
  return ans;
}

// 偏向答题
function biasedAnswers(targetDim, biasStrength) {
  var ans = [];
  for (var q = 0; q < SCORE_MATRIX.length; q++) {
    var nOpts = OPT[q];
    if (Math.random() < biasStrength) {
      var bestOpt = 0, bestVal = -Infinity;
      for (var o = 0; o < nOpts; o++) {
        var val = (SCORE_MATRIX[q][o][targetDim] || 0) * (isW(q) ? 1.5 : 1);
        if (val > bestVal) {bestVal=val;bestOpt=o;}
      }
      ans.push(bestVal > 0 ? bestOpt : Math.floor(Math.random() * nOpts));
    } else {
      ans.push(Math.floor(Math.random() * nOpts));
    }
  }
  return ans;
}

// ===== MAIN =====
const TRIALS = parseInt(process.argv[2], 10) || 10000;
console.log('='.repeat(70));
console.log('🎯 MBTI+Euclidean混合匹配模拟: ' + TRIALS + ' 次随机答题');
console.log('   算法: Euclidean相似度 + 分类匹配bonus(每维+4分, 最多+24)');
console.log('   阈值: L≤'+CAT_THRESH_LO+' / M / H≥'+CAT_THRESH_HI);
console.log('   Centers: {A:9.5, E:26.1, S:-0.9, D:8.1, O:9.1, I:-4.4}');
console.log('   StdDevs: {A:2.0, E:3.4, S:4.2, D:2.3, O:3.6, I:4.4}');
console.log('='.repeat(70));

// Phase 1: 随机模拟 (新算法)
var counts = {};
for (var n = 0; n < NAMES.length; n++) counts[NAMES[n]] = 0;
counts['朱之文'] = 0;
var oldCounts = {};
for (var n2 = 0; n2 < NAMES.length; n2++) oldCounts[NAMES[n2]] = 0;
oldCounts['朱之文'] = 0;
var scoreDist = {A:[],E:[],S:[],D:[],O:[],I:[]};
var matchDist = [0,0,0,0,0,0,0]; // 0-6 matching dims
var agreeCount = 0;

for (var t = 0; t < TRIALS; t++) {
  var answers = randomAnswers();
  var scores = calculateScores(answers);
  for (var di = 0; di < DIMS.length; di++) {
    scoreDist[DIMS[di]].push(scores[DIMS[di]]);
  }

  // 新算法匹配
  var matched = findBestMatch(scores, answers);
  counts[matched] = (counts[matched] || 0) + 1;

  // 旧算法匹配(对比)
  var oldMatched = findBestMatchOld(scores, answers);
  oldCounts[oldMatched] = (oldCounts[oldMatched] || 0) + 1;
  if (matched === oldMatched) agreeCount++;

  // 统计匹配维度数
  var bestExact = 0;
  for (var n3 = 0; n3 < NAMES.length; n3++) {
    var key3 = NAMES[n3];
    var p3 = PERSONAS[key3].profile;
    var exactM = 0;
    for (var di3 = 0; di3 < DIMS.length; di3++) {
      if (classifyCategory(scores[DIMS[di3]]) === classifyCategory(p3[DIMS[di3]])) exactM++;
    }
    if (key3 === matched) { bestExact = exactM; break; }
  }
  matchDist[bestExact]++;
}

console.log('\n📊 人格分布 (' + TRIALS + '次随机答题 · MBTI+Euclidean混合):');
console.log('─'.repeat(60));

var dists = [];
for (var n4 = 0; n4 < NAMES.length; n4++) {
  dists.push({name:NAMES[n4], count:counts[NAMES[n4]], pct:counts[NAMES[n4]]/TRIALS*100, isEgg:false});
}
dists.push({name:'朱之文', count:counts['朱之文'], pct:counts['朱之文']/TRIALS*100, isEgg:true});
dists.sort(function(a,b){return b.count - a.count;});

var maxPct = 0, minPct = 100;
for (var di = 0; di < dists.length; di++) {
  var bar = '█'.repeat(Math.round(dists[di].pct * 1.5));
  var flag = '';
  if (dists[di].isEgg) {
    flag = (dists[di].pct >= 1 && dists[di].pct <= 5) ? ' ✅' : ' ⚠️';
  } else {
    flag = (dists[di].pct >= 4 && dists[di].pct <= 10) ? '' : ' ⚠️';
    if (dists[di].pct > maxPct) maxPct = dists[di].pct;
    if (dists[di].pct < minPct) minPct = dists[di].pct;
  }
  console.log('  ' + dists[di].name.padEnd(14) + String(dists[di].count).padStart(5) +
    '  ' + dists[di].pct.toFixed(2).padStart(6) + '%  ' + bar + flag);
}

var ratio = maxPct / Math.max(minPct, 0.01);
console.log('─'.repeat(60));
console.log('  15人格: ' + minPct.toFixed(2) + '% ~ ' + maxPct.toFixed(2) + '%  |  比值 ' + ratio.toFixed(2) + 'x');
console.log('  朱之文: ' + counts['朱之文'] + '次 (' + (counts['朱之文']/TRIALS*100).toFixed(2) + '%)');
var verdict = ratio < 2.0 ? '✅ 优秀' : ratio < 2.5 ? '✅ 良好' : ratio < 4 ? '⚠️ 一般' : '❌ 偏差大';
console.log('  评级: ' + verdict);

// 匹配维度数分布
console.log('\n🎯 维度匹配分布 (MBTI式):');
console.log('─'.repeat(50));
var matchLabels = ['0/6','1/6','2/6','3/6','4/6','5/6','6/6'];
for (var mi = 0; mi < matchDist.length; mi++) {
  var bar2 = '█'.repeat(Math.round(matchDist[mi] / TRIALS * 200));
  console.log('  ' + matchLabels[mi] + '  ' + String(matchDist[mi]).padStart(6) +
    '  ' + (matchDist[mi]/TRIALS*100).toFixed(1).padStart(5) + '%  ' + bar2);
}
console.log('  平均匹配维度: ' + (function(){
  var sum2=0; for(var mi2=0;mi2<matchDist.length;mi2++) sum2+=mi2*matchDist[mi2];
  return (sum2/TRIALS).toFixed(2);
}()) + '/6');

// 新旧算法对比
console.log('\n🔄 新旧算法对比:');
console.log('─'.repeat(50));
console.log('  一致率: ' + agreeCount + '/' + TRIALS + ' (' + (agreeCount/TRIALS*100).toFixed(1) + '%)');
var disagreeCount = TRIALS - agreeCount;
console.log('  分歧率: ' + disagreeCount + '/' + TRIALS + ' (' + (disagreeCount/TRIALS*100).toFixed(1) + '%)');
// 新旧分布对比
console.log('  旧算法(Euclidean)分布比值: ' + (function(){
  var omax=0,omin=100;
  for(var on=0;on<NAMES.length;on++){var op=oldCounts[NAMES[on]]/TRIALS*100;if(op>omax)omax=op;if(op<omin)omin=op;}
  return (omax/omin).toFixed(2)+'x';
}()));

// 分数分布
console.log('\n📈 Sigmoid分数分布:');
console.log('─'.repeat(50));
for (var di4 = 0; di4 < DIMS.length; di4++) {
  var dim = DIMS[di4];
  var arr = scoreDist[dim];
  arr.sort(function(a,b){return a-b;});
  var sum = 0;
  for (var si = 0; si < arr.length; si++) sum += arr[si];
  var p5 = arr[Math.floor(arr.length*0.05)];
  var p50 = arr[Math.floor(arr.length*0.50)];
  var p95 = arr[Math.floor(arr.length*0.95)];
  console.log('  ' + dim + '  均值:' + (sum/arr.length).toFixed(1).padStart(6) +
    '  中位:' + p50.toString().padStart(4) + '  5%:' + p5.toString().padStart(4) + '  95%:' + p95.toString().padStart(4));
}

// Phase 2: 倾向性验证
console.log('\n🔬 倾向性验证 (每维度有偏答题×500):');
console.log('─'.repeat(55));
var BIAS_N = 500;
for (var di3 = 0; di3 < DIMS.length; di3++) {
  var td = DIMS[di3];
  var bc = {};
  for (var nk = 0; nk < NAMES.length; nk++) bc[NAMES[nk]] = 0;
  for (var bt = 0; bt < BIAS_N; bt++) {
    var ba = biasedAnswers(td, 0.7);
    var bs = calculateScores(ba);
    var bm = findBestMatch(bs, ba);
    bc[bm] = (bc[bm]||0) + 1;
  }
  var top = [];
  for (var nk2 = 0; nk2 < NAMES.length; nk2++) {
    top.push({name:NAMES[nk2], cnt:bc[NAMES[nk2]]});
  }
  top.sort(function(a,b){return b.cnt-a.cnt;});
  console.log('  ' + td + '(' + DIM_NAMES[td] + ') → ' +
    top.slice(0,3).map(function(m){return m.name+'('+(m.cnt/BIAS_N*100).toFixed(0)+'%)';}).join(' '));
}

console.log('\n✅ 模拟完成.');
