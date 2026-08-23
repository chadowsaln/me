(() => {
  "use strict";

  const docEl = document.documentElement;
  const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- theme ---------- */
  const themeToggle = document.getElementById("theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const applyThemeColor = () => {
    if (!themeMeta) return;
    themeMeta.setAttribute(
      "content",
      docEl.dataset.theme === "light" ? "#f1f2fa" : "#06070d"
    );
  };

  themeToggle.addEventListener("click", () => {
    const next = docEl.dataset.theme === "dark" ? "light" : "dark";
    docEl.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    applyThemeColor();
  });
  applyThemeColor();

  /* ---------- header scroll state ---------- */
  const header = document.querySelector(".site-head");
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle("scrolled", window.scrollY > 12);
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  const closeMenu = (refocus) => {
    menuToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
    if (refocus) menuToggle.focus();
  };

  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    navLinks.classList.toggle("open", !open);
  });

  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a") && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
    }
  });

  document.addEventListener("click", (e) => {
    if (
      menuToggle.getAttribute("aria-expanded") === "true" &&
      !e.target.closest(".nav")
    ) {
      closeMenu(false);
    }
  });

  /* ---------- reveal on scroll ---------- */
  const revealables = document.querySelectorAll(".reveal, .skill");
  if (motionOK && "IntersectionObserver" in window) {
    const revealIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealIO.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealables.forEach((el) => revealIO.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- hero stat counter ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    if (!motionOK) {
      el.textContent = `${target}+`;
      return;
    }
    const dur = 1200;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = `${Math.round(eased * target)}+`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const countIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            countIO.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countIO.observe(el));
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- active section in nav ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const links = new Map(
    [...document.querySelectorAll('.nav-links a[href^="#"]')].map((a) => [
      a.getAttribute("href").slice(1),
      a,
    ])
  );
  const setActive = (id) => {
    links.forEach((link, key) => {
      const active = key === id;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };
  if ("IntersectionObserver" in window) {
    const sectionIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => sectionIO.observe(s));
  }

  /* ---------- skill spotlight + card tilt + magnetic buttons ---------- */
  if (finePointer && motionOK) {
    document.querySelectorAll(".skill").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    });

    document.querySelectorAll(".project").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", `${px * 5}deg`);
        card.style.setProperty("--rx", `${py * -5}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });

    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width - 0.5) * 10;
        const dy = ((e.clientY - r.top) / r.height - 0.5) * 8;
        btn.style.translate = `${dx}px ${dy}px`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.translate = "";
      });
    });
  }

  /* ---------- contact form -> mailto ---------- */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const CONTACT_EMAIL = "contact@shadow.dev";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const invalid = [...form.querySelectorAll(":invalid")];
    if (invalid.length > 0) {
      invalid[0].focus();
      invalid.forEach((f) =>
        f.setAttribute("aria-invalid", f.matches(":invalid") ? "true" : "false")
      );
      status.textContent = "Please fill in the highlighted fields.";
      return;
    }
    const data = new FormData(form);
    const subject = `[Portfolio] ${data.get("type")} — ${data.get("name")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Project type: ${data.get("type")}`,
      "",
      data.get("message"),
    ].join("\n");
    status.textContent = "Opening your email client…";
    window.location.href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  });

  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => field.removeAttribute("aria-invalid"));
  });

  /* ---------- footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- particle canvas ---------- */
  const canvas = document.getElementById("particles");
  if (canvas && motionOK) {
    const ctx = canvas.getContext("2d");
    const GLYPHS = ["</>", "{}", ";", "=>", "#", "()>", "*"];
    const COLORS = ["167,139,250", "77,216,255"];

    let w = 0, h = 0, dpr = 1, raf = null, running = true;
    let dots = [], glyphs = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const seed = () => {
      const count = Math.min(Math.floor((w * h) / 22000), 80);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.4 + 0.6,
        c: COLORS[Math.random() < 0.62 ? 0 : 1],
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const spawnGlyph = () => {
      if (glyphs.length >= 6) return;
      glyphs.push({
        text: GLYPHS[(Math.random() * GLYPHS.length) | 0],
        x: Math.random() * w,
        y: h + 20,
        vy: -(0.18 + Math.random() * 0.25),
        vx: (Math.random() - 0.5) * 0.14,
        life: 1,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        size: 11 + Math.random() * 7,
      });
    };

    let lastGlyph = 0;

    const frame = (now) => {
      if (!running) { raf = null; return; }
      ctx.clearRect(0, 0, w, h);

      for (const p of dots) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.014;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        const a = 0.35 + Math.sin(p.tw) * 0.22;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${Math.max(a, 0.08)})`;
        ctx.fill();
      }

      const LINK = 115;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const a = (1 - Math.sqrt(d2) / LINK) * 0.16;
            ctx.strokeStyle = `rgba(148,163,255,${a})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      if (now - lastGlyph > 2600) {
        lastGlyph = now;
        spawnGlyph();
      }
      glyphs = glyphs.filter((g) => g.y > -30 && g.life > 0);
      for (const g of glyphs) {
        g.y += g.vy;
        g.x += g.vx;
        g.life -= 0.0016;
        ctx.font = `${g.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(${g.c},${Math.max(g.life, 0) * 0.34})`;
        ctx.fillText(g.text, g.x, g.y);
      }

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf === null && running) raf = requestAnimationFrame(frame);
    };

    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      start();
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 180);
    });

    resize();
    start();
  }
})();
