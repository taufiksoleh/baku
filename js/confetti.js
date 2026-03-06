// Confetti/Party animation effect
// Triggered on streak milestones and finishing all progress

const Confetti = (function () {
  let canvas = null;
  let ctx = null;
  let particles = [];
  let animationId = null;

  const COLORS = [
    "#FF3B30", "#FF9500", "#FFCC00", "#34C759",
    "#007AFF", "#5856D6", "#AF52DE", "#FF2D55",
  ];

  function init() {
    canvas = document.createElement("canvas");
    canvas.id = "confetti-canvas";
    canvas.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;";
    document.body.appendChild(canvas);
    resize();
    window.addEventListener("resize", resize);
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 20,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      velocity: 2 + Math.random() * 3,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.2,
      drift: (Math.random() - 0.5) * 1.5,
      opacity: 1,
      decay: 0.003 + Math.random() * 0.005,
    };
  }

  function update() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.y += p.velocity;
      p.x += p.drift;
      p.angle += p.spin;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > canvas.height) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (particles.length > 0) {
      animationId = requestAnimationFrame(update);
    } else {
      animationId = null;
    }
  }

  function launch(count) {
    if (!canvas) init();
    ctx = canvas.getContext("2d");

    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }

    if (!animationId) {
      animationId = requestAnimationFrame(update);
    }
  }

  // Party effect for streak milestones
  function partyStreak() {
    launch(60);
  }

  // Party effect for finishing all progress
  function partyFinish() {
    launch(120);
    // Second wave after a short delay
    setTimeout(function () { launch(80); }, 300);
    setTimeout(function () { launch(60); }, 600);
  }

  return {
    partyStreak: partyStreak,
    partyFinish: partyFinish,
  };
})();
