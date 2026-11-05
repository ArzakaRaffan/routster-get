// get.routster.trackster.dev: theme, install tabs, copy, reveal, and the hero terminal demo.
(() => {
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- theme (same storage key as routster.trackster.dev) ----
  const paintTheme = () => {
    const t = root.getAttribute("data-theme") || "system";
    $$("[data-theme-set]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.themeSet === t)));
  };
  $$("[data-theme-set]").forEach(b => b.addEventListener("click", () => {
    const t = b.dataset.themeSet;
    try { t === "system" ? localStorage.removeItem("rt-theme") : localStorage.setItem("rt-theme", t); } catch (e) {}
    t === "system" ? root.removeAttribute("data-theme") : root.setAttribute("data-theme", t);
    paintTheme();
  }));
  paintTheme();

  // ---- header border once scrolled ----
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // ---- nav hover pill ----
  const nav = document.querySelector(".nav"), pill = nav && nav.querySelector(".hover-pill");
  if (pill) {
    $$("a", nav).forEach(a => a.addEventListener("mouseenter", () => {
      pill.style.width = a.offsetWidth + "px"; pill.style.transform = `translateX(${a.offsetLeft}px)`; pill.style.opacity = 1;
    }));
    nav.addEventListener("mouseleave", () => { pill.style.opacity = 0; });
  }

  // ---- install boxes: OS tabs + copy ----
  const OS = {
    unix: { cmd: "curl -fsSL https://get.routster.trackster.dev/install.sh | bash", prompt: "$", shell: "bash",
            hint: "Data di ~/.routster. Instalan Hermes (~/.hermes) tidak disentuh." },
    win:  { cmd: "irm https://get.routster.trackster.dev/install.ps1 | iex", prompt: "PS>", shell: "PowerShell",
            hint: "Buka PowerShell (bukan cmd). Data di %LOCALAPPDATA%\\routster." },
  };
  const boxes = $$(".install");
  const moveInd = box => {
    const on = box.querySelector('.tab[aria-selected="true"]'), ind = box.querySelector(".tab-ind");
    if (on && ind) { ind.style.width = on.offsetWidth + "px"; ind.style.transform = `translateX(${on.offsetLeft}px)`; }
  };
  const setOS = os => boxes.forEach(box => {
    const o = OS[os];
    $$(".tab", box).forEach(t => t.setAttribute("aria-selected", String(t.dataset.os === os)));
    box.querySelector("[data-cmd]").textContent = o.cmd;
    box.querySelector("[data-prompt]").textContent = o.prompt;
    box.querySelector("[data-shell]").textContent = o.shell;
    box.querySelector("[data-hint]").textContent = o.hint;
    moveInd(box);
  });
  boxes.forEach(box => $$(".tab", box).forEach(t => t.addEventListener("click", () => setOS(t.dataset.os))));
  setOS(/Win/.test(navigator.platform || navigator.userAgent) ? "win" : "unix");
  addEventListener("resize", () => boxes.forEach(moveInd));
  document.fonts && document.fonts.ready.then(() => boxes.forEach(moveInd));

  $$("[data-copy]").forEach(btn => btn.addEventListener("click", async () => {
    const text = btn.closest(".install").querySelector("[data-cmd]").textContent;
    try { await navigator.clipboard.writeText(text); } catch (e) { return; }
    btn.classList.add("copied"); btn.setAttribute("aria-label", "Tersalin");
    setTimeout(() => { btn.classList.remove("copied"); btn.setAttribute("aria-label", "Salin perintah instal"); }, 1600);
  }));

  // ---- pointer spotlight on cards ----
  $$(".spot").forEach(el => el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", e.clientX - r.left + "px"); el.style.setProperty("--my", e.clientY - r.top + "px");
  }));

  // ---- reveal on scroll ----
  const revealables = $$(".reveal");
  if (!calm && "IntersectionObserver" in window) {
    revealables.forEach(el => el.classList.add("pre"));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.remove("pre"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    revealables.forEach(el => io.observe(el));
  }

  // ---- hero terminal: lines appear in order, the prompt is typed ----
  const body = document.querySelector("[data-play]");
  if (!body) return;
  const lines = $$(".ln", body);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let run = 0;

  const play = async () => {
    const id = ++run;
    lines.forEach(l => { l.classList.add("pre"); l.classList.remove("in"); });
    for (const l of lines) {
      if (id !== run) return;
      await sleep(+(l.dataset.w || 90));
      if (id !== run) return;
      l.classList.remove("pre"); l.classList.add("in");
      if (l.hasAttribute("data-type")) {
        const t = l.querySelector("[data-text]"), full = t.dataset.text;
        t.textContent = "";
        for (let i = 1; i <= full.length; i++) {
          if (id !== run) return;
          t.textContent = full.slice(0, i);
          await sleep(18 + Math.random() * 34);
        }
      }
    }
  };

  if (calm) return; // reduced motion: the finished session is already on screen
  const seen = new IntersectionObserver(es => {
    if (es[0].isIntersecting) { seen.disconnect(); play(); }
  }, { threshold: .3 });
  seen.observe(body);
  document.querySelector("[data-replay]").addEventListener("click", play);
})();
