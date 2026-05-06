/* Lightweight canvas particles + copy-to-clipboard. */
(function () {
  const canvas = document.getElementById("fx");
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const state = {
    w: 0,
    h: 0,
    t: 0,
    particles: [],
  };

  function resize() {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    state.w = w;
    state.h = h;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function makeParticle() {
    const s = rand(0.6, 1.8);
    return {
      x: rand(0, state.w),
      y: rand(0, state.h),
      vx: rand(-0.06, 0.06),
      vy: rand(0.02, 0.12),
      r: s,
      a: rand(0.08, 0.22),
      hue: Math.random() < 0.5 ? 230 : 320,
      tw: rand(0.8, 1.8),
    };
  }

  function ensureParticles() {
    const target = Math.round(Math.min(120, Math.max(50, (state.w * state.h) / 24000)));
    while (state.particles.length < target) state.particles.push(makeParticle());
    while (state.particles.length > target) state.particles.pop();
  }

  function tick() {
    state.t += 1;
    ctx.clearRect(0, 0, state.w, state.h);

    const driftX = Math.sin(state.t / 320) * 0.15;
    const driftY = Math.cos(state.t / 420) * 0.1;

    for (const p of state.particles) {
      p.x += p.vx + driftX * 0.02;
      p.y += p.vy + driftY * 0.02;

      const tw = 0.65 + 0.35 * Math.sin((state.t / 60) * p.tw);
      const a = p.a * tw;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${a})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      if (p.y > state.h + 20) {
        p.y = -20;
        p.x = rand(0, state.w);
      }
      if (p.x < -20) p.x = state.w + 20;
      if (p.x > state.w + 20) p.x = -20;
    }

    requestAnimationFrame(tick);
  }

  resize();
  ensureParticles();
  window.addEventListener("resize", () => {
    resize();
    ensureParticles();
  });
  requestAnimationFrame(tick);
})();

(function () {
  const toast = document.getElementById("toast");
  let toastTimer = 0;
  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => (toast.textContent = ""), 1400);
  }

  document.addEventListener("click", async (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const btn = t.closest("[data-copy]");
    if (!(btn instanceof HTMLElement)) return;
    const value = btn.getAttribute("data-copy") || "";
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      showToast("Copied");
    } catch {
      showToast("Copy failed");
    }
  });
})();
