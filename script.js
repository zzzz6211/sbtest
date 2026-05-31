/**
 * 承认吧，你就是_____ — 首页交互
 * 粒子系统 + 连线 + 光标交互 + 计数动画 + 标题进度条
 */
(function () {
  'use strict';

  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 100;
  const CONNECT_DIST = 120;
  const mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.baseSpeedX = this.speedX;
      this.baseSpeedY = this.speedY;
      this.baseOpacity = Math.random() * 0.4 + 0.08;
      this.opacity = this.baseOpacity;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.isBright = Math.random() < 0.2;
      if (this.isBright) {
        this.baseOpacity = Math.random() * 0.45 + 0.3;
        this.size = Math.random() * 3 + 1.2;
      }
    }

    update() {
      this.opacity = this.baseOpacity + Math.sin(Date.now() * 0.0008 + this.pulsePhase) * 0.15;
      if (mouse.x != null && mouse.y != null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.speedX += Math.cos(angle) * force * 0.7;
          this.speedY += Math.sin(angle) * force * 0.7;
          this.opacity = Math.min(0.9, this.opacity + force * 0.3);
        }
      }
      this.speedX += (this.baseSpeedX - this.speedX) * 0.015;
      this.speedY += (this.baseSpeedY - this.speedY) * 0.015;
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -15) this.x = width + 15;
      if (this.x > width + 15) this.x = -15;
      if (this.y < -15) this.y = height + 15;
      if (this.y > height + 15) this.y = -15;
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      const alpha = Math.max(0.02, this.opacity);
      if (this.isBright) {
        ctx.fillStyle = 'rgba(216,180,254,' + alpha + ')';
        ctx.shadowColor = 'rgba(168,85,247,' + (alpha * 0.6) + ')';
        ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = 'rgba(168,85,247,' + alpha + ')';
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var a = particles[i];
        var b = particles[j];
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          var alpha = (1 - dist / CONNECT_DIST) * 0.08;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(168,85,247,' + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    drawConnections();
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(ctx);
    }
    requestAnimationFrame(animate);
  }

  function onMouseMove(e) { mouse.x = e.clientX; mouse.y = e.clientY; }
  function onTouchMove(e) { if (e.touches.length > 0) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; } }
  function onMouseLeave() { mouse.x = null; mouse.y = null; }
  function onTouchEnd() { mouse.x = null; mouse.y = null; }

  // 计数器模拟
  var counterEl = document.getElementById('counter');
  var currentCount = 83729;
  setInterval(function () {
    currentCount += Math.floor(Math.random() * 3) + 1;
    counterEl.textContent = currentCount.toLocaleString('zh-CN');
  }, 2500 + Math.random() * 4000);

  // 标题下划线进度条动画
  var titleBlank = document.getElementById('titleBlank');
  var len = 1;
  setInterval(function () {
    var str = '';
    for (var i = 0; i < len; i++) { str += '_'; }
    titleBlank.textContent = str;
    len++;
    if (len > 5) { len = 1; }
  }, 400);

  // 按钮
  var btnStart = document.getElementById('btnStart');
  btnStart.addEventListener('click', function () {
    this.style.transform = 'scale(0.94)';
    setTimeout(function () { btnStart.style.transform = ''; }, 150);
    window.location.href = 'test.html';
  });
  btnStart.addEventListener('touchend', function (e) {
    e.preventDefault();
    this.click();
  });

  // 启动
  resize();
  initParticles();
  animate();
  window.addEventListener('resize', function () { resize(); initParticles(); });
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseleave', onMouseLeave);
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onTouchEnd);
})();
