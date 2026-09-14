/* ============================================================
   Shadow Dev — Portfolio scripts (vanilla JS)
   Header state, mobile menu, scroll spy, reveal, form, year.
   ============================================================ */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById("site-header");
  if (header) {
    const onScrollHeader = () => {
      header.classList.toggle("scrolled", window.scrollY > 24);
    };
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------- Scroll spy (active nav link) ---------- */
  const navAnchors = Array.from(document.querySelectorAll(".nav-link"));
  const spySections = ["home", "about", "projects", "skills", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActiveLink = (id) => {
    navAnchors.forEach((link) => {
      const isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if (spySections.length && navAnchors.length) {
    let ticking = false;
    const updateSpy = () => {
      ticking = false;
      const probe = window.scrollY + window.innerHeight * 0.35;
      let current = spySections[0].id;
      for (const section of spySections) {
        if (section.offsetTop <= probe) current = section.id;
      }
      if (current !== document.activeLinkCache) {
        document.activeLinkCache = current;
        setActiveLink(current);
      }
    };

    const onScrollSpy = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateSpy);
      }
    };

    updateSpy();
    window.addEventListener("scroll", onScrollSpy, { passive: true });
    window.addEventListener("resize", onScrollSpy);
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll("[data-reveal]");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-revealed"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- "Coming soon" placeholders ---------- */
  document.querySelectorAll(".is-soon[href='#']").forEach((link) => {
    link.addEventListener("click", (e) => e.preventDefault());
  });

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById("contact-form");
  if (form) {
    const fields = {
      name: {
        input: document.getElementById("cf-name"),
        error: document.getElementById("cf-name-error"),
        validate(value) {
          const v = value.trim();
          if (!v) return "Please enter your name.";
          if (v.length < 2) return "Name must be at least 2 characters.";
          return "";
        },
      },
      email: {
        input: document.getElementById("cf-email"),
        error: document.getElementById("cf-email-error"),
        validate(value) {
          const v = value.trim();
          if (!v) return "Please enter your email address.";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
            return "Please enter a valid email address (e.g. you@example.com).";
          return "";
        },
      },
      message: {
        input: document.getElementById("cf-message"),
        error: document.getElementById("cf-message-error"),
        validate(value) {
          const v = value.trim();
          if (!v) return "Please enter a message.";
          if (v.length < 20)
            return "Message should be at least 20 characters.";
          return "";
        },
      },
    };

    const clearError = (field) => {
      field.input.closest(".field").classList.remove("invalid");
      field.error.textContent = "";
    };

    const showError = (field, message) => {
      field.input.closest(".field").classList.add("invalid");
      field.error.textContent = message;
    };

    const validateField = (field) => {
      const message = field.validate(field.input.value);
      if (message) {
        showError(field, message);
        return false;
      }
      clearError(field);
      return true;
    };

    Object.values(fields).forEach((field) => {
      field.input.addEventListener("input", () => clearError(field));
      field.input.addEventListener("blur", () => validateField(field));
    });

    const formStatus = document.getElementById("form-status");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const results = Object.values(fields).map(validateField);
      const valid = results.every(Boolean);

      if (!valid) {
        const firstInvalid = Object.values(fields).find(
          (field) => field.input.closest(".field").classList.contains("invalid")
        );
        firstInvalid && firstInvalid.input.focus();
        if (formStatus) {
          formStatus.textContent = "";
          formStatus.classList.remove("is-success");
        }
        return;
      }

      if (formStatus) {
        formStatus.classList.add("is-success");
        formStatus.textContent =
          "Thanks! No backend is connected yet, so this form hasn't sent " +
          "anything — please email me at chadowdev674@gmail.com.";
      }
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();