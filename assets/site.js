document.documentElement.classList.add("has-js");
const header = document.querySelector(".site-header");
const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector("#navigation");
function closeMenu() {
  nav?.classList.remove("open");
  menu?.setAttribute("aria-expanded", "false");
}
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
});
nav?.addEventListener("click", (e) => {
  if (e.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu?.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menu.focus();
  }
});
window.matchMedia("(min-width:641px)").addEventListener("change", (e) => {
  if (e.matches) closeMenu();
});
window.addEventListener(
  "scroll",
  () => header?.classList.toggle("scrolled", window.scrollY > 10),
  { passive: true },
);
document
  .querySelectorAll("[data-year]")
  .forEach((el) => (el.textContent = new Date().getFullYear()));
const motion = document.querySelector(".motion-toggle");
motion?.addEventListener("click", () => {
  const paused = document.body.classList.toggle("motion-paused");
  motion.setAttribute("aria-pressed", String(paused));
  motion.setAttribute("aria-label", paused ? "播放背景动画" : "暂停背景动画");
  motion.textContent = paused ? "播放动画 ▷" : "暂停动画 Ⅱ";
});
const filters = document.querySelectorAll("[data-filter]");
filters.forEach((btn) =>
  btn.addEventListener("click", () => {
    filters.forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-pressed", String(b === btn));
    });
    let count = 0;
    document.querySelectorAll("[data-category]").forEach((card) => {
      card.hidden =
        btn.dataset.filter !== "all" &&
        card.dataset.category !== btn.dataset.filter;
      if (!card.hidden) count++;
    });
    document.querySelector(".filter-status").textContent =
      `显示 ${count} 篇文章`;
  }),
);
const dialog = document.querySelector(".lightbox");
if (dialog) {
  document.querySelectorAll("[data-image]").forEach((btn) =>
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      dialog.querySelector("img").src = btn.dataset.image;
      dialog.querySelector("img").alt = btn.dataset.caption;
      dialog.querySelector("p").textContent = btn.dataset.caption;
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }),
  );
  dialog
    .querySelector(".lightbox-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
  });
}
if (
  "IntersectionObserver" in window &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".section-heading,.about-label,.about-copy,.people-list")
    .forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
}

// Reading progress is computed from the actual article, not the page footer.
const article = document.querySelector(".article-body");
const progress = document.querySelector(".reading-progress span");
if (article && progress) {
  let queued = false;
  const update = () => {
    const start = article.getBoundingClientRect().top + window.scrollY - 150;
    const distance = Math.max(
      1,
      article.offsetHeight - window.innerHeight + 150,
    );
    const value = Math.max(0, Math.min(1, (window.scrollY - start) / distance));
    progress.style.transform = `scaleX(${value})`;
    let current = null;
    article.querySelectorAll("section[id]").forEach((section) => {
      if (section.getBoundingClientRect().top < 200) current = section.id;
    });
    document.querySelectorAll(".article-toc a").forEach((link) => {
      if (link.hash === `#${current}`)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    queued = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", update);
  update();
}
