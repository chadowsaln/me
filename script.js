import { checkName, checkEmail, checkMessage, MIN_MESSAGE_LENGTH } from "./lib/core.js";

/* ============================================================
   Shadow Dev — Portfolio scripts (vanilla JS)
   i18n (EN/AR + RTL), header state, mobile menu, scroll spy,
   reveal, form validation, year.
   ============================================================ */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ============================================================
     i18n dictionary — English / Arabic
     ============================================================ */
  var I18N = {
    en: {
      "skip": "Skip to main content",
      "nav.home": "Home", "nav.about": "About", "nav.projects": "Projects",
      "nav.skills": "Skills", "nav.journey": "Journey", "nav.contact": "Contact",
      "nav.menu": "Menu", "lang.aria": "Switch language",
      "hero.badge": "Open to remote & international roles",
      "hero.greeting": "Hi, I'm",
      "hero.role": "Flutter Developer & Software Engineer",
      "hero.sub":
        "I build cross-platform mobile and desktop apps with Flutter, Dart and REST/BaaS backends — from state management and API integration to authentication and relational database design.",
      "cta.projects": "View Projects", "cta.contact": "Contact Me", "cta.code": "Code",
      "aria.socials": "Social links", "aria.scroll": "Scroll to About section",
      "about.title": "About Me",
      "about.lede":
        "Flutter developer with about a year of independent project experience — designing, building and shipping complete applications from idea to working product.",
      "about.p1":
        "I've delivered several solo projects covering state management, API integration, authentication and relational database design, using Dart, Flutter and REST/BaaS backends such as Supabase and FastAPI.",
      "about.p2":
        "I'm seeking a Junior Flutter or Mobile Developer role with an international or remote team — a place where attention to detail and clean architecture matter.",
      "about.pt1t": "Cross-platform by default",
      "about.pt1d": "Mobile and desktop apps from a single Flutter codebase.",
      "about.pt2t": "Full product thinking",
      "about.pt2d": "Auth, roles, data models and APIs — not just the UI.",
      "about.pt3t": "Localization & RTL",
      "about.pt3d": "Arabic/English apps with full RTL support and themes.",
      "about.pt4t": "CS foundations",
      "about.pt4d": "OOP, design patterns, C++ algorithms and data structures.",
      "fact.loc": "Mauritania — open to remote",
      "fact.avail": "Available for opportunities",
      "fact.langs": "Arabic (native) · English (B2)",
      "projects.title": "Featured Projects",
      "proj1.desc":
        "Cross-platform desktop app (Linux, Windows, macOS) for installing and managing Flutter and Dart SDKs — version management, download progress, PATH configuration, prerequisite checks and process management, with no separate backend server.",
      "proj2.desc":
        "Gamified, offline-first Pomodoro study app — task management with priorities, difficulty and recurrence, rewards, badges, streaks, daily goals and weekly productivity charts. Timer sessions survive app restarts, with scheduled local notifications, Arabic/English localization with RTL, and light/dark themes.",
      "proj3.desc":
        "Coffee shop app supporting both customer ordering and staff operations — menu browsing, order management and a multilingual interface. Supabase powers user authentication, role-based access and data management.",
      "proj4.desc":
        "Arabic RTL clothing e-commerce prototype — product browsing and details, size and color selection, cart, favorites, checkout and order management. Cart state is managed with ChangeNotifier, grouping items by product, size and color with automatic quantity and total calculations. Functional prototype with an Android APK demo.",
      "skills.title": "Skills & Stack",
      "skills.g1": "Mobile & Desktop", "skills.g2": "Backend & APIs",
      "skills.g3": "Databases", "skills.g4": "Languages", "skills.g5": "Tools",
      "journey.title": "Experience & Education",
      "journey.expPeriod": "Jul 2025 — Present",
      "journey.expTitle": "Independent Software Developer",
      "journey.expB1": "Designed, built and maintained several solo projects from idea to working application.",
      "journey.expB2": "Full ownership: architecture, UI, state management, backend integration and release.",
      "journey.eduPeriod": "Self-directed study",
      "journey.eduTitle": "Project-based learning",
      "journey.eduB1": "Flutter, Dart, OOP, API integration, state management, Supabase, FastAPI, SQL databases and software design patterns — through online courses and project-based learning.",
      "journey.edu2Period": "Safwa Institute, Mauritania",
      "journey.edu2Title": "C++ & Algorithms",
      "journey.edu2B1": "Algorithms and data structures in C++ — the foundations behind how I write Dart.",
      "contact.title": "Let's Build Something", "contact.titleAccent": "Great",
      "contact.lede":
        "Looking for a junior Flutter or mobile developer for your remote or international team? Tell me about it — I'll get back to you soon.",
      "form.name": "Name", "form.namePh": "Your name",
      "form.email": "Email", "form.emailPh": "you@example.com",
      "form.message": "Message", "form.messagePh": "Tell me about your project or role…",
      "form.send": "Send Message",
      "form.note": "This form validates client-side only. For a guaranteed reply, email me directly.",
      "form.errNameReq": "Please enter your name.", "form.errNameShort": "Name must be at least 2 characters.",
      "form.errEmailReq": "Please enter your email address.", "form.errEmailInvalid": "Please enter a valid email address (e.g. you@example.com).",
      "form.errMessageReq": "Please enter a message.", "form.errMessageShort": `Message should be at least ${20} characters.`,
      "form.ok": "Thanks! Your message looks good — now email it to chadowdev674@gmail.com or use the channel on the left.",
      "footer.note": "Idoumou Chekhne Ahmed Ibrahim — crafted with HTML, CSS & JavaScript."
    },
    ar: {
      "skip": "تجاوز إلى المحتوى الرئيسي",
      "nav.home": "الرئيسية", "nav.about": "نبذة", "nav.projects": "المشاريع",
      "nav.skills": "المهارات", "nav.journey": "المسيرة", "nav.contact": "تواصل",
      "nav.menu": "القائمة", "lang.aria": "تغيير اللغة",
      "hero.badge": "متاح للعمل عن بُعد ودوليًا",
      "hero.greeting": "مرحبًا، أنا",
      "hero.role": "مطوّر Flutter ومهندس برمجيات",
      "hero.sub":
        "أبني تطبيقات موبايل وسطح مكتب عابرة للمنصات باستخدام Flutter وDart وخلفيات REST/BaaS — من إدارة الحالة وربط واجهات API إلى المصادقة وتصميم قواعد البيانات العلائقية.",
      "cta.projects": "المشاريع", "cta.contact": "تواصل معي", "cta.code": "الكود",
      "aria.socials": "روابط التواصل", "aria.scroll": "الانتقال إلى قسم نبذة",
      "about.title": "نبذة عني",
      "about.lede":
        "مطوّر Flutter بخبرة تقارب العام في مشاريع مستقلة — أصمّم وأبني وأطلق تطبيقات كاملة من الفكرة حتى منتج يعمل فعليًا.",
      "about.p1":
        "أنجزت عدة مشاريع فردية تغطي إدارة الحالة وربط واجهات API والمصادقة وتصميم قواعد البيانات العلائقية، باستخدام Dart وFlutter وخلفيات REST/BaaS مثل Supabase وFastAPI.",
      "about.p2":
        "أبحث عن دور Junior Flutter أو Mobile Developer ضمن فريق دولية أو تعمل عن بُعد — مكان تهتم فيه التفاصيل والبنية النظيفة.",
      "about.pt1t": "عابر للمنصات افتراضيًا",
      "about.pt1d": "تطبيقات موبايل وسطح مكتب من كود Flutter واحد.",
      "about.pt2t": "تفكير منتج كامل",
      "about.pt2d": "مصادقة وأدوار ونماذج بيانات وواجهات API — وليس الواجهة فقط.",
      "about.pt3t": "التوطين وRTL",
      "about.pt3d": "تطبيقات عربية/إنجليزية بدعم RTL كامل وثيمات.",
      "about.pt4t": "أساسيات علوم الحاسب",
      "about.pt4d": "OOP وأنماط التصميم وخوارزميات C++ وهياكل البيانات.",
      "fact.loc": "موريتانيا — متاح للعمل عن بُعد",
      "fact.avail": "متاح لفرص العمل",
      "fact.langs": "العربية (لغة أم) · الإنجليزية (B2)",
      "projects.title": "مشاريع مختارة",
      "proj1.desc":
        "تطبيق سطح مكتب عابر للمنصات (لينكس وويندوز وماك) لتثبيت وإدارة حِزَم Flutter وDart SDK — إدارة الإصدارات وتقدّم التنزيل وضبط PATH وفحص المتطلبات المسبقة وإدارة العمليات، دون خادم خلفي منفصل.",
      "proj2.desc":
        "تطبيق دراسة بطريقة بومودورو يعمل دون اتصال أولًا وبنظام تحفيزي — إدارة مهام بالأولويات والصعوبة والتكرار، ومكافآت وشارات وسلاسل إنجاز وأهداف يومية ومخططات إنتاجية أسبوعية. جلسات المؤقت تتعافى بعد إعادة تشغيل التطبيق، مع إشعارات محلية مجدولة وتوطين عربي/إنجليزي بدعم RTL وثيمات فاتحة/داكنة.",
      "proj3.desc":
        "تطبيق مقهى يدعم طلبات الزبائن وعمليات الموظفين — تصفح قائمة المشروبات وإدارة الطلبات وواجهة متعددة اللغات. يوفر Supabase مصادقة المستخدمين والوصول حسب الدور وإدارة البيانات.",
      "proj4.desc":
        "نموذج أولي لمتجر ملابس إلكتروني عربي بواجهة RTL — تصفح المنتجات وتفاصيلها واختيار المقاس واللون والسلة والمفضلة وإتمام الطلب وإدارة الطلبات. تُدار حالة السلة عبر ChangeNotifier مع تجميع العناصر حسب المنتج والمقاس واللون وحساب تلقائي للكميات والإجماليات. نموذج وظيفي مع نسخة APK تجريبية لأندرويد.",
      "skills.title": "المهارات والتقنيات",
      "skills.g1": "الموبايل وسطح المكتب", "skills.g2": "الخلفيات وواجهات API",
      "skills.g3": "قواعد البيانات", "skills.g4": "اللغات", "skills.g5": "الأدوات",
      "journey.title": "الخبرة والتعليم",
      "journey.expPeriod": "يوليو 2025 — حتى الآن",
      "journey.expTitle": "مطوّر برمجيات مستقل",
      "journey.expB1": "صممت وبنيت وحافظت على عدة مشاريع فردية من الفكرة حتى تطبيق يعمل.",
      "journey.expB2": "مسؤولية كاملة: البنية والواجهات وإدارة الحالة وربط الخلفية والإصدار.",
      "journey.eduPeriod": "دراسة ذاتية",
      "journey.eduTitle": "تعلّم قائم على المشاريع",
      "journey.eduB1": "Flutter وDart وOOP وربط API وإدارة الحالة وSupabase وFastAPI وقواعد SQL وأنماط تصميم البرمجيات — عبر دورات عبر الإنترنت وتعلّم قائم على المشاريع.",
      "journey.edu2Period": "معهد صفوة، موريتانيا",
      "journey.edu2Title": "C++ والخوارزميات",
      "journey.edu2B1": "الخوارزميات وهياكل البيانات بلغة C++ — الأساس الذي أكتب به Dart.",
      "contact.title": "لنبنِ شيئًا", "contact.titleAccent": "عظيمًا",
      "contact.lede":
        "تبحث عن مطوّر Flutter أو موبايل مبتدئ لفريقك عن بُعد أو الدولية؟ حدّثني عنها — سأرد عليك قريبًا.",
      "form.name": "الاسم", "form.namePh": "اسمك",
      "form.email": "البريد الإلكتروني", "form.emailPh": "you@example.com",
      "form.message": "الرسالة", "form.messagePh": "حدّثني عن مشروعك أو الدور…",
      "form.send": "إرسال الرسالة",
      "form.note": "هذا النموذج للتحقق من المدخلات فقط. لضمان الرد، راسلني عبر البريد مباشرة.",
      "form.errNameReq": "يرجى إدخال اسمك.", "form.errNameShort": "يجب ألا يقل الاسم عن حرفين.",
      "form.errEmailReq": "يرجى إدخال البريد الإلكتروني.", "form.errEmailInvalid": "يرجى إدخال بريد إلكتروني صحيح (مثال: you@example.com).",
      "form.errMessageReq": "يرجى كتابة رسالة.", "form.errMessageShort": "يجب ألا تقل الرسالة عن ٢٠ حرفًا.",
      "form.ok": "شكرًا! رسالتك جاهزة — أرسلها الآن إلى chadowdev674@gmail.com أو استخدم قنوات التواصل.",
      "footer.note": "إدومو الشيخن أحمد إبراهيم — مصنوع بـ HTML وCSS وJavaScript."
    }
  };

  var LANG_KEY = "shadowdev-lang";
  var html = document.documentElement;
  var langLabel = document.getElementById("lang-label");

  function applyLang(lang) {
    var dict = I18N[lang] || I18N.en;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var parts = pair.trim().split("=");
        if (parts.length === 2 && dict[parts[1]] !== undefined) {
          el.setAttribute(parts[0].trim(), dict[parts[1]]);
        }
      });
    });
    html.setAttribute("lang", lang === "ar" ? "ar" : "en");
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.title = lang === "ar"
      ? "Shadow Dev — مطوّر Flutter ومهندس برمجيات"
      : "Shadow Dev — Flutter Developer & Software Engineer";
    if (langLabel) langLabel.textContent = lang === "ar" ? "English" : "العربية";
  }

  function currentLang() {
    return html.getAttribute("lang") === "ar" ? "ar" : "en";
  }

  var langToggle = document.getElementById("lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", function () {
      var next = currentLang() === "ar" ? "en" : "ar";
      try { localStorage.setItem(LANG_KEY, next); } catch (e) {}
      applyLang(next);
    });
  }

  /* Initial language: saved choice, else browser hint */
  var saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
  var initial = saved === "ar" || saved === "en"
    ? saved
    : ((navigator.language || "").toLowerCase().indexOf("ar") === 0 ? "ar" : "en");
  applyLang(initial);

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("site-header");
  if (header) {
    var onScrollHeader = function () {
      header.classList.toggle("scrolled", window.scrollY > 24);
    };
    onScrollHeader();
    window.addEventListener("scroll", onScrollHeader, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.getElementById("menu-toggle");
  var navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    var closeMenu = function () {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    };
    menuToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Scroll spy ---------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );
  var linkMap = {};
  document.querySelectorAll(".nav-link").forEach(function (a) {
    var id = (a.getAttribute("href") || "").slice(1);
    if (id) linkMap[id] = a;
  });

  var spyTick = false;
  function onSpy() {
    if (spyTick) return;
    spyTick = true;
    requestAnimationFrame(function () {
      var pos = window.scrollY + Math.floor(window.innerHeight * 0.35);
      var activeId = sections.length ? sections[0].id : null;
      sections.forEach(function (s) { if (s.offsetTop <= pos) activeId = s.id; });
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        activeId = sections.length ? sections[sections.length - 1].id : activeId;
      }
      Object.keys(linkMap).forEach(function (id) {
        var a = linkMap[id];
        var on = id === activeId;
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
      spyTick = false;
    });
  }
  window.addEventListener("scroll", onSpy, { passive: true });
  onSpy();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("revealed"); });
  }

  /* ---------- Contact form (client-side validation only) ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var statusEl = document.getElementById("form-status");
    var fields = {
      name: { input: document.getElementById("cf-name"), err: document.getElementById("cf-name-error"), check: checkName, codes: { required: "form.errNameReq", short: "form.errNameShort" } },
      email: { input: document.getElementById("cf-email"), err: document.getElementById("cf-email-error"), check: checkEmail, codes: { required: "form.errEmailReq", invalid: "form.errEmailInvalid" } },
      message: { input: document.getElementById("cf-message"), err: document.getElementById("cf-message-error"), check: checkMessage, codes: { required: "form.errMessageReq", short: "form.errMessageShort" } }
    };

    var errText = function (f, code) {
      var dict = I18N[currentLang()];
      var key = f.codes[code];
      if (!key) return "";
      var msg = dict[key] || "";
      // keep the live contract aligned with lib/core.js
      if (code === "short" && f === fields.message) {
        msg = currentLang() === "ar"
          ? "يجب ألا تقل الرسالة عن " + MIN_MESSAGE_LENGTH + " حرفًا."
          : "Message should be at least " + MIN_MESSAGE_LENGTH + " characters.";
      }
      return msg;
    };

    var validate = function () {
      var ok = true;
      Object.keys(fields).forEach(function (k) {
        var f = fields[k];
        var code = f.check(f.input.value);
        f.err.textContent = code ? errText(f, code) : "";
        if (code) ok = false;
      });
      return ok;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (validate()) {
        statusEl.textContent = I18N[currentLang()]["form.ok"];
        form.reset();
      } else {
        statusEl.textContent = "";
      }
    });

    Object.keys(fields).forEach(function (k) {
      fields[k].input.addEventListener("input", function () {
        fields[k].err.textContent = "";
      });
    });
  }

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
