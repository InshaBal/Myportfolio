document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const navLinks = document.querySelectorAll(".nav__list a[href^='#']");
  const toggleBtn = document.getElementById("toggle-btn");

  /* ============ 1) THEME TOGGLE + PERSISTENCE ============ */
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    if (toggleBtn) toggleBtn.innerHTML = `<i class="fas fa-sun"></i>`;
  } else {
    if (toggleBtn) toggleBtn.innerHTML = `<i class="fas fa-moon"></i>`;
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      const isDark = body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      toggleBtn.innerHTML = isDark ? `<i class="fas fa-sun"></i>` : `<i class="fas fa-moon"></i>`;
    });
  }

  /* ============ 2) SMOOTH SCROLL ============ */
  function smoothScrollTo(target) {
    const headerHeight = header ? header.offsetHeight : 0;
    const y = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        smoothScrollTo(target);
      }
    });
  });

  /* ============ 3) SCROLLSPY (active link) ============ */
  const sectionIds = Array.from(navLinks)
    .map((a) => a.getAttribute("href"))
    .filter((h) => h && h.startsWith("#"));
  const sections = sectionIds.map((id) => document.querySelector(id)).filter(Boolean);

  function updateActiveLink() {
    const headerHeight = header ? header.offsetHeight : 0;
    let currentId = null;
    sections.forEach((sec) => {
      const top = sec.getBoundingClientRect().top - headerHeight - 80;
      if (top <= 0) currentId = `#${sec.id}`;
    });
    navLinks.forEach((a) => {
      if (a.getAttribute("href") === currentId) {
        a.classList.add("active");
      } else {
        a.classList.remove("active");
      }
    });
  }

  /* ============ 4) STICKY HEADER SHADOW ============ */
  function updateHeaderShadow() {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }

  /* ============ 5) BACK TO TOP BUTTON (auto-create) ============ */
  const backToTop = document.createElement("button");
  backToTop.id = "back-to-top";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.textContent = "↑";
  document.body.appendChild(backToTop);

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function toggleBackToTop() {
    if (window.scrollY > 250) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  /* ============ 6) REVEAL ON SCROLL (animations) ============ */
  const revealCandidates = [];
  // mark elements for reveal: cards, edu items, certs, projects, section titles, skills li
  document.querySelectorAll(".card, .edu-item, .project, .cert, .section__title, .skills li").forEach((el) => {
    el.classList.add("reveal");
    revealCandidates.push(el);
  });

  // also reveal each section container
  document.querySelectorAll("section").forEach((sec) => {
    if (!sec.classList.contains("home")) sec.classList.add("reveal");
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ============ 7) TYPEWRITER EFFECT (home subtitle) ============ */
  const subtitle = document.querySelector(".home__subtitle");
  if (subtitle) {
    const original = subtitle.textContent.trim();
    subtitle.textContent = "";
    let i = 0;
    function type() {
      if (i <= original.length) {
        subtitle.textContent = original.slice(0, i);
        i++;
        setTimeout(type, 30);
      }
    }
    type();
  }

  /* ============ SCROLL EVENTS ============ */
  window.addEventListener("scroll", () => {
    updateActiveLink();
    updateHeaderShadow();
    toggleBackToTop();
  });

  // initial state on load
  updateActiveLink();
  updateHeaderShadow();
  toggleBackToTop();
});
