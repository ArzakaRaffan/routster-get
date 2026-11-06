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
            hint: { id: "Semua data di ~/.routster, punya sendiri.",
                    en: "All data lives in ~/.routster, all its own." } },
    win:  { cmd: "irm https://get.routster.trackster.dev/install.ps1 | iex", prompt: "PS>", shell: "PowerShell",
            hint: { id: "Buka PowerShell (bukan cmd). Data di %LOCALAPPDATA%\\routster.",
                    en: "Use PowerShell (not cmd). Data lives in %LOCALAPPDATA%\\routster." } },
  };
  let lang = "id", os = /Win/.test(navigator.platform || navigator.userAgent) ? "win" : "unix";
  const boxes = $$(".install");
  const moveInd = box => {
    const on = box.querySelector('.tab[aria-selected="true"]'), ind = box.querySelector(".tab-ind");
    if (on && ind) { ind.style.width = on.offsetWidth + "px"; ind.style.transform = `translateX(${on.offsetLeft}px)`; }
  };
  const setOS = next => { os = next; boxes.forEach(box => {
    const o = OS[os];
    $$(".tab", box).forEach(t => t.setAttribute("aria-selected", String(t.dataset.os === os)));
    box.querySelector("[data-cmd]").textContent = o.cmd;
    box.querySelector("[data-prompt]").textContent = o.prompt;
    box.querySelector("[data-shell]").textContent = o.shell;
    box.querySelector("[data-hint]").textContent = o.hint[lang];
    moveInd(box);
  }); };
  boxes.forEach(box => $$(".tab", box).forEach(t => t.addEventListener("click", () => setOS(t.dataset.os))));
  addEventListener("resize", () => boxes.forEach(moveInd));
  document.fonts && document.fonts.ready.then(() => boxes.forEach(moveInd));

  $$("[data-copy]").forEach(btn => btn.addEventListener("click", async () => {
    const text = btn.closest(".install").querySelector("[data-cmd]").textContent;
    try { await navigator.clipboard.writeText(text); } catch (e) { return; }
    btn.classList.add("copied");
    setTimeout(() => btn.classList.remove("copied"), 1600);
  }));

  // ---- language: Indonesian lives in the markup, English in data-en (HTML allowed) ----
  const LANG_KEY = "routster.locale"; // same key as routster.trackster.dev
  const META = {
    id: { title: "Routster Agent: coding agent di terminal" },
    en: { title: "Routster Agent: a coding agent in your terminal" },
  };
  const setLang = next => {
    lang = next;
    root.lang = lang;
    document.title = META[lang].title;
    $$("[data-en]").forEach(el => {
      if (el.dataset.id === undefined) el.dataset.id = el.innerHTML;
      el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.id;
    });
    $$("[data-text-en]").forEach(el => {
      if (el.dataset.textId === undefined) el.dataset.textId = el.dataset.text;
      el.dataset.text = lang === "en" ? el.dataset.textEn : el.dataset.textId;
      el.textContent = el.dataset.text;
    });
    $$("[data-lang]").forEach(a => a.setAttribute("aria-current", String(a.dataset.lang === lang)));
    setOS(os);
  };
  $$("[data-lang]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    try { localStorage.setItem(LANG_KEY, a.dataset.lang); } catch (err) {}
    const u = new URL(location.href); u.searchParams.delete("lang"); history.replaceState(null, "", u);
    setLang(a.dataset.lang);
  }));
  const pickLang = () => {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "id" || q === "en") { try { localStorage.setItem(LANG_KEY, q); } catch (e) {} return q; }
    let saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
    if (saved === "id" || saved === "en") return saved;
    return /^id\b/i.test(navigator.language || "") ? "id" : "en";
  };
  setLang(pickLang());

  // ---- orbit only spins while on screen ----
  const orbit = document.querySelector(".orbit");
  if (orbit) new IntersectionObserver(es => orbit.classList.toggle("live", es[0].isIntersecting)).observe(orbit);

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

  // ---- terminals: lines appear in order, "$ commands" are typed ----
  // Loops check `visible`, so nothing keeps running while a terminal is off screen.
  if (calm) return; // reduced motion: every terminal already shows its finished state

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const SPIN = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";
  const fmtTok = n => (n / 1000).toFixed(1) + "k";

  const player = body => {
    const lines = $$(".ln", body), hero = body.closest(".term-hero");
    const tok = hero && hero.querySelector("[data-tok]");
    const TOK = 18200;
    let run = 0, visible = false, done = false;

    const type = async (el, id) => {
      const full = el.dataset.text;
      el.textContent = "";
      for (let i = 1; i <= full.length; i++) {
        if (id !== run) return;
        el.textContent = full.slice(0, i);
        await sleep(hero ? 20 + Math.random() * 34 : 12 + Math.random() * 20);
      }
    };
    const spin = async (l, ms, id) => {
      const g = l.firstElementChild, orig = g.textContent;
      l.classList.add("busy");
      for (let t = 0, f = 0; t < ms && id === run; t += 70, f++) {
        g.textContent = "  " + SPIN[f % SPIN.length];
        await sleep(70);
      }
      g.textContent = orig;
      l.classList.remove("busy");
    };

    const play = async () => {
      const id = ++run;
      done = false;
      lines.forEach(l => l.classList.add("pre"));
      if (tok) tok.textContent = fmtTok(0);
      for (const [i, l] of lines.entries()) {
        const w = +(l.dataset.w || (hero ? 90 : 140)), spins = l.hasAttribute("data-spin");
        await sleep(spins ? 120 : w);
        if (id !== run) return;
        l.classList.remove("pre");
        const txt = l.querySelector("[data-text]");
        if (txt) { l.classList.add("busy"); await type(txt, id); l.classList.remove("busy"); }
        if (spins) await spin(l, w, id);
        if (id !== run) return;
        if (tok) tok.textContent = fmtTok(Math.round(TOK * (i + 1) / lines.length));
      }
      done = true;
      if (hero) { await sleep(8000); if (id === run && visible) play(); } // the hero loops while on screen
    };

    if (body.hasAttribute("data-picker")) { // model picker: walk the cursor down the list
      const opts = $$(".opt", body);
      let k = 0;
      setInterval(() => {
        if (!visible || !done) return;
        opts[k].classList.remove("sel"); opts[k].querySelector(".mk").textContent = " ";
        k = (k + 1) % opts.length;
        opts[k].classList.add("sel"); opts[k].querySelector(".mk").textContent = "❯";
      }, 1600);
    }

    lines.forEach(l => l.classList.add("pre"));
    let started = false;
    new IntersectionObserver(es => {
      visible = es[0].isIntersecting;
      if (visible && (!started || (hero && done))) { started = true; play(); }
    }, { threshold: .35 }).observe(body);
    return play;
  };

  const players = $$("[data-play]").map(player);
  const replay = document.querySelector("[data-replay]");
  if (replay) replay.addEventListener("click", players[0]);

  // ---- hero terminal tilt: pointer devices only, at most one style write per frame ----
  const wrap = document.querySelector(".term-wrap");
  if (wrap && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let raf = 0, ev = null;
    wrap.addEventListener("pointermove", e => {
      ev = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = wrap.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
        wrap.classList.add("tilting");
        wrap.style.setProperty("--ry", ((x - .5) * 6).toFixed(2) + "deg");
        wrap.style.setProperty("--rx", ((.5 - y) * 5).toFixed(2) + "deg");
        wrap.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
        wrap.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
      });
    });
    wrap.addEventListener("pointerleave", () => {
      wrap.classList.remove("tilting");
      wrap.style.setProperty("--rx", "0deg");
      wrap.style.setProperty("--ry", "0deg");
    });
  }
})();
