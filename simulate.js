/**
 * sbtest 人格测试模拟验证脚本
 * 运行 20000 份随机答题，验证：
 *   1. 6 维度分数分布是否合理
 *   2. 16 人格命中分布是否均匀
 *   3. 120 对适配度分布是否合理
 *
 * 用法: node simulate.js [样本数，默认20000]
 */
'use strict';

// ============ SCORE_MATRIX (与 result.js/compatibility.js 同步) ============
var MATRIX = [
  [{A:3,S:2},{A:2,E:2},{E:2,O:1},{A:1,I:-2}],
  [{E:2,O:-2},{O:2,I:1},{E:2,O:2},{E:2,O:-2}],
  [{E:-2,A:-2},{E:2,S:2,I:1},{O:2,E:1},{I:2,E:1}],
  [{S:2,A:1},{D:2,E:1},{S:-2,I:-2},{E:2,S:2}],
  [{S:-2,I:-2},{A:2,S:1},{E:2,O:2},{S:-2,O:2}],
  [{O:2,I:0},{E:2,O:-2},{I:1,O:2},{D:2,E:2}],
  [{O:2,I:-2},{O:-2},{A:2,O:2},{I:2}],
  [{D:3,E:2},{D:1,I:-2},{D:2,E:-2},{D:-3}],
  [{S:3,I:2},{S:-2,I:-2},{S:1,A:1},{D:2,S:-2}],
  [{E:2,O:-2},{D:3},{S:2,E:2},{O:2,I:-2}],
  [{A:1,E:1,I:-2},{I:2,E:2},{A:-2,I:1},{A:2,O:2}],
  [{S:2,E:2},{S:-2,A:-2},{D:2,E:2},{O:1,I:1}],
  [{I:2},{A:1,S:1},{I:-2,S:-2},{I:0,A:-2}],
  [{I:3,E:2},{I:1,A:1},{I:-2,E:-2},{I:2,O:2}],
  [{E:2,S:2},{E:-2,I:-2},{E:-2,S:-2},{D:1,E:1}],
  [{A:1,O:1,I:1},{O:2,I:2,S:-2},{S:3,I:2},{S:-2,I:-2}],
  [{I:2,S:2},{O:2,I:1},{I:-2,E:1},{I:-2,E:2}],
  [{O:2},{O:0},{I:2},{O:-2}],
  [{D:2,E:2,O:-2},{S:2,E:1},{I:2,E:1},{I:-2,O:2}],
  [{S:-2,I:1},{S:1,I:2},{D:2,E:2,I:1},{O:-2,I:-2}],
  [{O:2,I:2},{O:-2,I:-2},{D:2,S:-2},{E:1,O:-2}],
  [{E:2,S:2},{S:-2,I:-2},{E:1,O:2},{I:-2,E:1}],
  [{S:2,E:2},{S:-2,D:2}],
  [{A:2,O:2},{A:-2,I:2}],
  [{E:2,I:-2},{I:2,E:2}],
  [{A:2,E:2,O:-2},{S:2,E:2},{S:-2,I:-2},{D:1,O:-2}],
  [{A:2,I:1},{I:2,E:2},{O:1,I:1},{E:2,O:-2}],
  [{E:2,D:1,O:-2},{O:2,I:-2},{E:2,S:1},{O:2,S:-2}],
  [{E:2,S:2},{A:2,E:2},{I:-2,S:-2},{O:2,I:-2}],
  [{A:2,E:1},{E:2,O:2},{I:-2,S:-2,O:1},{S:-2,O:2,I:1}]
];

// ============ 人格档案 ============
var PERSONAS = {
  '血包':    {id:1,name:'血包', isEasterEgg:false, profile:{A:85,E:70,S:50,D:18,O:28,I:18}},
  '五秒':    {id:2,name:'五秒真男(女)人', isEasterEgg:false, profile:{A:28,E:90,S:62,D:10,O:50,I:90}},
  '电子蝴蝶': {id:3,name:'电子蝴蝶', isEasterEgg:false, profile:{A:10,E:70,S:10,D:95,O:48,I:48}},
  '傻波一':  {id:4,name:'傻波一', isEasterEgg:false, profile:{A:52,E:24,S:24,D:22,O:80,I:24}},
  '雀食者':  {id:5,name:'雀食者', isEasterEgg:false, profile:{A:60,E:24,S:64,D:22,O:36,I:24}},
  '补兑者':  {id:6,name:'补兑者', isEasterEgg:false, profile:{A:15,E:48,S:50,D:12,O:17,I:55}},
  '法师':    {id:7,name:'法师', isEasterEgg:false, profile:{A:20,E:78,S:22,D:50,O:24,I:72}},
  '豪士':    {id:8,name:'豪士', isEasterEgg:false, profile:{A:50,E:52,S:50,D:18,O:85,I:50}},
  '朱之文':  {id:9,name:'朱之文', isEasterEgg:true,  profile:{A:92,E:22,S:50,D:20,O:72,I:8}},
  '玻璃':    {id:10,name:'玻璃', isEasterEgg:false, profile:{A:50,E:85,S:18,D:50,O:12,I:18}},
  '嘉豪':    {id:11,name:'嘉豪', isEasterEgg:false, profile:{A:15,E:90,S:90,D:50,O:62,I:72}},
  '万人迷':  {id:12,name:'万人迷', isEasterEgg:false, profile:{A:58,E:35,S:68,D:25,O:65,I:20}},
  '天使':    {id:13,name:'天使', isEasterEgg:false, profile:{A:72,E:53,S:52,D:32,O:64,I:30}},
  '隐身玩家': {id:14,name:'隐身玩家', isEasterEgg:false, profile:{A:62,E:5,S:5,D:62,O:55,I:5}},
  '独美选手': {id:15,name:'独美选手', isEasterEgg:false, profile:{A:20,E:20,S:5,D:18,O:75,I:50}},
  '乐子人':  {id:16,name:'乐子人', isEasterEgg:false, profile:{A:37,E:72,S:72,D:38,O:82,I:72}}
};

var DIMS = ['A','E','S','D','O','I'];

// ============ 核心函数 ============
function classifyCategory(score) {
  if (score <= 30) return 'L';
  if (score >= 70) return 'H';
  return 'M';
}

function sigmoidNormalize(rawScores) {
  var stdDevs = {A:3.7, E:5.1, S:5.9, D:3.7, O:5.6, I:6.6};
  var centers = {A:4.5, E:17.9, S:-0.3, D:6.5, O:6.5, I:-3.2};
  var norm = {};
  for (var d in rawScores) {
    var z = (rawScores[d] - centers[d]) / stdDevs[d];
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

function findBestMatch(scores, answers) {
  if (isZhuZhiwen(scores, answers)) return '朱之文';

  var bestScore = -Infinity, bestKey = null;
  for (var key in PERSONAS) {
    var p = PERSONAS[key];
    if (p.isEasterEgg) continue;
    var sumSq = 0;
    for (var i = 0; i < DIMS.length; i++) {
      sumSq += Math.pow(scores[DIMS[i]] - p.profile[DIMS[i]], 2);
    }
    var euclidSim = Math.max(0, 100 - Math.sqrt(sumSq) * 0.43);
    var catBonus = 0;
    for (var j = 0; j < DIMS.length; j++) {
      if (classifyCategory(scores[DIMS[j]]) === classifyCategory(p.profile[DIMS[j]])) {
        catBonus += 2;
      }
    }
    var totalScore = euclidSim + catBonus;
    if (totalScore > bestScore) { bestScore = totalScore; bestKey = key; }
  }
  return bestKey || '血包';
}

function calcBaseScore(a, b) {
  var sumSq = 0;
  for (var i = 0; i < DIMS.length; i++) {
    var d = a.profile[DIMS[i]] - b.profile[DIMS[i]];
    sumSq += d * d;
  }
  var dist = Math.sqrt(sumSq);
  var raw = Math.max(0, 100 - dist * 0.41);

  for (var j = 0; j < DIMS.length; j++) {
    if (classifyCategory(a.profile[DIMS[j]]) === classifyCategory(b.profile[DIMS[j]])) {
      raw += 2;
    }
  }

  // 连续交互规则 (与 compatibility.js 同步)
  raw -= (a.profile.I / 100) * (b.profile.I / 100) * 18;
  var iGap = Math.abs(a.profile.I - b.profile.I);
  if (iGap >= 25) raw -= (iGap - 20) * 0.25;
  raw -= ((a.profile.I/100) * (1 - a.profile.A/100) + (b.profile.I/100) * (1 - b.profile.A/100)) * 10;
  raw += (a.profile.A / 100) * (b.profile.A / 100) * 10;
  var aGap = Math.abs(a.profile.A - b.profile.A);
  if (aGap >= 35) raw -= (aGap - 30) * 0.2;
  raw += (a.profile.O / 100) * (b.profile.O / 100) * 8;
  var oGap = Math.abs(a.profile.O - b.profile.O);
  if (oGap >= 40) raw -= (oGap - 35) * 0.15;
  raw += (1 - Math.abs(a.profile.S - b.profile.S) / 100) * 5;
  raw += (1 - Math.abs(a.profile.E - b.profile.E) / 100) * 4;

  if (a.isEasterEgg && !['补兑者', '法师'].includes(b.name)) raw += 6;
  if (b.isEasterEgg && !['补兑者', '法师'].includes(a.name)) raw += 6;

  return Math.max(0, Math.min(100, Math.round(raw)));
}

function scoreToLevel(score) {
  if (score >= 82) return 5;
  if (score >= 66) return 4;
  if (score >= 46) return 3;
  if (score >= 28) return 2;
  return 1;
}

// ============ 随机答题 ============
function randomAnswers() {
  var ans = [];
  for (var q = 0; q < 30; q++) {
    var nOpts = MATRIX[q].length;  // 2 for Q23-Q25, 4 for others
    ans.push(Math.floor(Math.random() * nOpts));
  }
  return ans;
}

function scoreOneAnswer(answers) {
  var raw = {A:0,E:0,S:0,D:0,O:0,I:0};
  for (var q = 0; q < 30; q++) {
    var opt = answers[q];
    if (opt == null) continue;
    var map = MATRIX[q][opt];
    if (!map) continue;
    var mult = 1;
    if (q >= 27 && q <= 29) mult = 1.5;
    for (var dim in map) {
      if (raw.hasOwnProperty(dim)) raw[dim] += map[dim] * mult;
    }
  }
  return raw;
}

// ============ 主程序 ============
var N = parseInt(process.argv[2]) || 20000;
console.log('模拟 ' + N + ' 份随机答题...\n');

var personaCount = {};
for (var k in PERSONAS) personaCount[k] = 0;

var dimStats = {A:[],E:[],S:[],D:[],O:[],I:[]};
var levelCounts = {5:0,4:0,3:0,2:0,1:0};
var totalPairs = 0;

for (var n = 0; n < N; n++) {
  var answers = randomAnswers();
  var raw = scoreOneAnswer(answers);
  var scores = sigmoidNormalize(raw);
  var persona = findBestMatch(scores, answers);
  personaCount[persona] = (personaCount[persona] || 0) + 1;

  for (var dim in dimStats) {
    dimStats[dim].push(scores[dim]);
  }
}

// ============ 人格分布 ============
console.log('=== 人格命中分布 ===');
var sorted = Object.keys(personaCount).sort(function(a,b){return personaCount[b]-personaCount[a];});
for (var i = 0; i < sorted.length; i++) {
  var k = sorted[i];
  var pct = (personaCount[k] / N * 100).toFixed(1);
  var bar = '';
  for (var j = 0; j < Math.round(personaCount[k]/N*100); j++) bar += '█';
  console.log('  ' + String(personaCount[k]).padStart(5) + ' (' + String(pct).padStart(5) + '%) ' + bar + ' ' + k);
}

// ============ 维度分布 ============
console.log('\n=== 6维度分数分布（百分位数） ===');
console.log('维度 | 均值  | P10  | P25  | P50  | P75  | P90  | L%(≤30) | M%  | H%(≥70)');
for (var d in dimStats) {
  var arr = dimStats[d].sort(function(a,b){return a-b;});
  var avg = (arr.reduce(function(a,b){return a+b;},0) / arr.length).toFixed(0);
  var p10 = arr[Math.floor(N*0.10)];
  var p25 = arr[Math.floor(N*0.25)];
  var p50 = arr[Math.floor(N*0.50)];
  var p75 = arr[Math.floor(N*0.75)];
  var p90 = arr[Math.floor(N*0.90)];
  var lPct = (arr.filter(function(v){return v<=30;}).length / N * 100).toFixed(0);
  var hPct = (arr.filter(function(v){return v>=70;}).length / N * 100).toFixed(0);
  var mPct = (100 - lPct - hPct).toFixed(0);
  console.log('  ' + d + '  | ' + String(avg).padStart(4) + ' | ' + String(p10).padStart(4) + ' | ' + String(p25).padStart(4) + ' | ' + String(p50).padStart(4) + ' | ' + String(p75).padStart(4) + ' | ' + String(p90).padStart(4) + ' | ' + String(lPct).padStart(7)+'% | ' + String(mPct).padStart(3)+'% | ' + String(hPct).padStart(7)+'%');
}

// ============ 关键配对验证 ============
console.log('\n=== 关键配对适配度验证 ===');
var keyPairs = [
  [PERSONAS['血包'], PERSONAS['天使'], '血包+天使'],
  [PERSONAS['五秒'], PERSONAS['补兑者'], '五秒+补兑者'],
  [PERSONAS['法师'], PERSONAS['玻璃'], '法师+玻璃'],
  [PERSONAS['补兑者'], PERSONAS['雀食者'], '补兑者+雀食者'],
  [PERSONAS['傻波一'], PERSONAS['隐身玩家'], '傻波一+隐身玩家'],
  [PERSONAS['补兑者'], PERSONAS['法师'], '补兑者+法师'],
  [PERSONAS['五秒'], PERSONAS['乐子人'], '五秒+乐子人'],
  [PERSONAS['血包'], PERSONAS['补兑者'], '血包+补兑者'],
  [PERSONAS['豪士'], PERSONAS['乐子人'], '豪士+乐子人'],
  [PERSONAS['天使'], PERSONAS['朱之文'], '天使+朱之文'],
];

var LEVEL_NAMES = {5:'💞绝配',4:'⭐⭐⭐很合',3:'⭐⭐随缘',2:'⚡有摩擦',1:'💥高危'};

for (var p = 0; p < keyPairs.length; p++) {
  var pair = keyPairs[p];
  var score = calcBaseScore(pair[0], pair[1]);
  var level = scoreToLevel(score);
  console.log('  ' + pair[2] + ': ' + score + '% ' + LEVEL_NAMES[level]);
}

// ============ 全量适配度统计 ============
console.log('\n=== 全量120对适配度等级分布 ===');
for (var k1 in PERSONAS) {
  if (!PERSONAS.hasOwnProperty(k1)) continue;
  for (var k2 in PERSONAS) {
    if (!PERSONAS.hasOwnProperty(k2)) continue;
    if (PERSONAS[k1].id >= PERSONAS[k2].id) continue;
    var s = calcBaseScore(PERSONAS[k1], PERSONAS[k2]);
    var l = scoreToLevel(s);
    levelCounts[l] = (levelCounts[l] || 0) + 1;
    totalPairs++;
  }
}
for (var lv = 5; lv >= 1; lv--) {
  console.log('  ' + LEVEL_NAMES[lv] + ': ' + levelCounts[lv] + '对 (' + (levelCounts[lv]/totalPairs*100).toFixed(0) + '%)');
}

var minPct = personaCount[sorted[sorted.length-1]] / N * 100;
var maxPct = personaCount[sorted[0]] / N * 100;
console.log('\n=== 均衡性 ===');
console.log('  最少: ' + sorted[sorted.length-1] + ' (' + minPct.toFixed(1) + '%)');
console.log('  最多: ' + sorted[0] + ' (' + maxPct.toFixed(1) + '%)');
console.log('  比值: ' + (maxPct / minPct).toFixed(1) + 'x');
if (maxPct / minPct < 5) console.log('  ✅ 分布均衡');
else console.log('  ⚠️ 分布不均衡，需调整');
