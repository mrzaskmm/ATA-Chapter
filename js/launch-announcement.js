(function () {
  var STORAGE_KEY = "ata-launch-announcement-v1";
  var BODY_CLASS = "launch-announcement-open";

  function prefersReducedMotion() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  }

  function celebrationBurst() {
    if (prefersReducedMotion()) return;
    var w = window.innerWidth;
    var h = window.innerHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var canvas = document.createElement("canvas");
    canvas.className = "ata-apk-burst launch-announcement__burst";
    canvas.setAttribute("aria-hidden", "true");
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    document.body.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return;
    }
    ctx.scale(dpr, dpr);

    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    var colors = dark
      ? ["#409cff", "#64d2ff", "#ffd60a", "#ff9f0a", "#ff375f", "#bf5af2", "#30d158", "#ffffff", "#a1a1a6"]
      : ["#0d6efd", "#6ea8fe", "#ffc107", "#fd7e14", "#dc3545", "#6f42c1", "#198754", "#0dcaf0", "#212529"];

    var DURATION_MS = 2400;
    var particles = [];

    var sources = [
      { x: 0, y: h * 0.45, baseAngle: 0, count: 70 },
      { x: w, y: h * 0.45, baseAngle: Math.PI, count: 70 },
      { x: w * 0.5, y: 0, baseAngle: Math.PI / 2, count: 90 }
    ];

    sources.forEach(function (src) {
      for (var i = 0; i < src.count; i++) {
        var spread = (Math.random() - 0.5) * (Math.PI * 0.75);
        var angle = src.baseAngle + spread;
        var speed = 320 + Math.random() * 360;
        particles.push({
          x: src.x,
          y: src.y,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 80,
          vy: Math.sin(angle) * speed - Math.random() * 160,
          g: 520 + Math.random() * 260,
          drag: 0.992,
          size: 2 + Math.random() * 5,
          color: colors[(Math.random() * colors.length) | 0],
          spin: (Math.random() - 0.5) * 9,
          rot: Math.random() * Math.PI * 2
        });
      }
    });

    var last = performance.now();
    var t0 = last;

    function tick(now) {
      var dt = Math.min(0.038, (now - last) / 1000);
      last = now;
      var elapsed = now - t0;

      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.vy += p.g * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= p.drag;
        p.rot += p.spin * dt;
        var life = Math.max(0, 1 - elapsed / DURATION_MS);
        var alpha = life * (p.y > h + 40 ? 0.15 : 1);
        ctx.save();
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        var s = p.size * (0.85 + 0.15 * life);
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      }

      if (elapsed < DURATION_MS) {
        requestAnimationFrame(tick);
      } else {
        try {
          canvas.remove();
        } catch (e) {}
      }
    }

    requestAnimationFrame(tick);
  }

  function isDismissed() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "dismissed";
    } catch (e) {
      return false;
    }
  }

  function persistDismissed() {
    try {
      localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch (e) {}
  }

  function focusFirst(panel) {
    var focusables = panel.querySelectorAll(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    var first = focusables[0];
    if (first && typeof first.focus === "function") {
      try {
        first.focus({ preventScroll: true });
      } catch (e) {
        first.focus();
      }
    }
  }

  function openAnnouncement(modal) {
    modal.removeAttribute("hidden");
    document.body.classList.add(BODY_CLASS);
    var panel = modal.querySelector(".launch-announcement__panel");
    if (panel) focusFirst(panel);
    window.setTimeout(celebrationBurst, 120);
  }

  function closeAnnouncement(modal) {
    var checkbox = modal.querySelector("[data-launch-dont-show]");
    if (checkbox && checkbox.checked) {
      persistDismissed();
    }
    modal.setAttribute("hidden", "");
    document.body.classList.remove(BODY_CLASS);
  }

  function bindEvents(modal) {
    modal.addEventListener("click", function (e) {
      var closer = e.target.closest("[data-launch-close]");
      if (closer) {
        e.preventDefault();
        closeAnnouncement(modal);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (modal.hasAttribute("hidden")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeAnnouncement(modal);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("launch-announcement");
    if (!modal) return;
    bindEvents(modal);
    if (isDismissed()) return;
    window.setTimeout(function () {
      openAnnouncement(modal);
    }, 350);
  });
})();
