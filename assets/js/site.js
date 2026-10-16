/* Rory Gibbs OLY: site behaviour and motion. No dependencies. */

/*
 * Form delivery. Set ONE of these and every form on the site works.
 *  - formEndpoint: a form service URL, e.g. "https://formspree.io/f/abcdwxyz"
 *  - email: an address; the visitor's own email app opens with the message filled in
 */
const SITE_CONFIG = {
  formEndpoint: "",
  email: "",
};

(() => {
  const root = document.documentElement;
  root.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  /* ---------- Loader (first visit per session) ---------- */
  const loader = document.querySelector(".loader");
  const finishLoader = () => {
    if (!loader || loader.classList.contains("is-done")) return;
    loader.classList.add("is-leaving");
    setTimeout(() => loader.classList.add("is-done"), 380);
    setTimeout(() => { root.classList.remove("show-loader"); loader.remove(); }, 1400);
    try { sessionStorage.setItem("rg-loaded", "1"); } catch (e) {}
    document.dispatchEvent(new Event("rg:ready"));
  };
  if (loader && root.classList.contains("show-loader") && !reduceMotion) {
    const bar = loader.querySelector(".loader__bar i");
    const count = loader.querySelector(".loader__count");
    const start = performance.now();
    const duration = 1900;
    const tick = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      if (bar) bar.parentElement.style.setProperty("--load", eased.toFixed(3));
      if (bar) bar.style.transform = `scaleX(${eased.toFixed(3)})`;
      if (count) count.textContent = `${Math.round(eased * 100)}%`;
      if (t < 1) requestAnimationFrame(tick); else setTimeout(finishLoader, 250);
    };
    requestAnimationFrame(tick);
    loader.addEventListener("click", finishLoader);
    setTimeout(finishLoader, 4000);
  } else {
    root.classList.remove("show-loader");
    if (loader) loader.remove();
  }

  /* ---------- Split headings into words ---------- */
  document.querySelectorAll("[data-split]").forEach((el) => {
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement("span");
            w.className = "w";
            const inner = document.createElement("span");
            inner.style.setProperty("--i", i++);
            inner.textContent = part;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && !child.classList.contains("rotator")) {
          walk(child);
        }
      });
    };
    walk(el);
  });

  /* ---------- Reveal on scroll ---------- */
  const revealables = document.querySelectorAll(".reveal, .pop, .from-left, .from-right, .draw, [data-split], [data-count]");
  const countUp = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const run = (now) => {
      const t = clamp((now - start) / 1400, 0, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
      if (t < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  };
  const reveal = (el) => {
    el.classList.add("is-in");
    if (el.dataset.count && !el.dataset.counted) { el.dataset.counted = "1"; countUp(el); }
  };
  // Stagger siblings that pop together
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    Array.from(group.children).forEach((c, idx) => c.style.setProperty("--i", idx));
  });
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { reveal(entry.target); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    const startObserving = () => revealables.forEach((el) => io.observe(el));
    if (document.querySelector(".loader")) document.addEventListener("rg:ready", () => setTimeout(startObserving, 250), { once: true });
    else startObserving();
  } else {
    revealables.forEach(reveal);
  }

  /* ---------- Background colour follows the section in view ---------- */
  const bgSections = document.querySelectorAll("[data-bg]");
  if (bgSections.length && "IntersectionObserver" in window) {
    const bgIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) root.style.setProperty("--page-bg", `var(--${entry.target.dataset.bg})`);
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    bgSections.forEach((s) => bgIO.observe(s));
  }

  /* ---------- Scroll engine: progress, header, marquee skew ---------- */
  const header = document.querySelector(".site-header");
  const scrubs = Array.from(document.querySelectorAll("[data-scrub]"));
  const fans = Array.from(document.querySelectorAll(".fan"));
  const marquees = Array.from(document.querySelectorAll(".marquee__track"));
  const quick = document.querySelector(".quick");
  let lastY = window.scrollY;
  let velocity = 0;
  let ticking = false;

  const frame = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const delta = y - lastY;

    if (header) {
      header.classList.toggle("is-solid", y > 10);
      const menuOpen = root.classList.contains("menu-open");
      header.classList.toggle("is-hidden", !menuOpen && delta > 4 && y > 400);
      if (delta < -4) header.classList.remove("is-hidden");
    }
    if (quick) quick.classList.toggle("is-ready", y > 350);

    if (!reduceMotion) {
      scrubs.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
        el.style.setProperty("--p", p.toFixed(4));
      });
      fans.forEach((fan) => {
        const r = fan.getBoundingClientRect();
        const p = clamp((vh - r.top) / (vh * 0.75), 0, 1);
        fan.style.setProperty("--spread", (0.08 + p * 0.92).toFixed(3));
      });
      velocity = velocity * 0.85 + delta * 0.15;
      const skew = clamp(velocity * -0.25, -10, 10);
      marquees.forEach((m) => m.style.setProperty("--skew", `${skew.toFixed(2)}deg`));
    }
    lastY = y;
    ticking = false;
    if (Math.abs(velocity) > 0.1 && !reduceMotion) requestTick();
  };
  const requestTick = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", () => { requestTick(); drawPaths(); });
  requestTick();
  if (reduceMotion) fans.forEach((f) => f.style.setProperty("--spread", "1"));

  /* ---------- The path: a trail drawn through each stop ---------- */
  function drawPaths() {
    document.querySelectorAll(".path").forEach((wrap) => {
      const svg = wrap.querySelector(".path__svg");
      const stops = wrap.querySelectorAll(".stop");
      if (!svg || stops.length < 2) return;
      const box = wrap.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      const pts = Array.from(stops).map((s) => {
        const r = s.getBoundingClientRect();
        return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2];
      });
      let d = `M ${pts[0][0]} ${pts[0][1]}`;
      for (let k = 1; k < pts.length; k++) {
        const [x0, y0] = pts[k - 1];
        const [x1, y1] = pts[k];
        const my = (y0 + y1) / 2;
        const bend = box.width < 700 ? box.width * 0.42 * (k % 2 ? 1 : -1) : 0;
        d += ` C ${x0 + bend} ${my}, ${x1 + bend} ${my}, ${x1} ${y1}`;
      }
      svg.querySelectorAll("path").forEach((p) => {
        p.setAttribute("d", d);
        p.style.setProperty("--len", Math.ceil(p.getTotalLength()));
      });
    });
  }
  drawPaths();
  window.addEventListener("load", drawPaths);

  /* ---------- Rotating words ---------- */
  document.querySelectorAll(".rotator").forEach((rot) => {
    const items = Array.from(rot.children);
    if (items.length < 2) return;
    let idx = 0;
    items[0].classList.add("is-on");
    if (reduceMotion) return;
    setInterval(() => {
      const prev = items[idx];
      idx = (idx + 1) % items.length;
      prev.classList.remove("is-on");
      prev.classList.add("is-off");
      setTimeout(() => prev.classList.remove("is-off"), 650);
      items[idx].classList.add("is-on");
    }, 1700);
  });

  /* ---------- Tilt and magnetic hovers (desktop only) ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach((stage) => {
      const target = stage.querySelector("[data-tilt-target]") || stage;
      stage.addEventListener("pointermove", (e) => {
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        target.style.transform = `rotateY(${x * 18}deg) rotateX(${y * -14}deg)`;
        stage.querySelectorAll(".orbit").forEach((o, k) => {
          const depth = (k % 3) + 1;
          o.style.translate = `${x * 24 * depth}px ${y * 24 * depth}px`;
        });
      });
      stage.addEventListener("pointerleave", () => {
        target.style.transform = "";
        stage.querySelectorAll(".orbit").forEach((o) => { o.style.translate = ""; });
      });
    });
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- Layered scene: each layer moves at its own depth ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-scene]").forEach((scene) => {
      const layers = scene.querySelectorAll("[data-depth]");
      scene.addEventListener("pointermove", (e) => {
        const r = scene.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach((l) => {
          const d = parseFloat(l.dataset.depth);
          l.style.translate = `${(-x * d).toFixed(1)}px ${(-y * d * 0.5).toFixed(1)}px`;
        });
      });
      scene.addEventListener("pointerleave", () => layers.forEach((l) => { l.style.translate = ""; }));
    });
  }

  /* ---------- App menu: items take turns lighting up ---------- */
  document.querySelectorAll(".appmenu").forEach((menuEl) => {
    const items = Array.from(menuEl.children);
    items.forEach((li, k) => li.style.setProperty("--i", k));
    if (reduceMotion || items.length < 2) return;
    let k = 0;
    setInterval(() => {
      items.forEach((li) => li.classList.remove("is-active"));
      items[k % items.length].classList.add("is-active");
      k++;
    }, 1400);
  });

  /* ---------- The Athlete Deck viewer: one real card at a time ---------- */
  document.querySelectorAll("[data-deckflip]").forEach((viewer) => {
    const card = viewer.querySelector(".deckflip-card");
    const front = viewer.querySelector(".deckflip-front");
    const back = viewer.querySelector(".deckflip-backimg");
    const title = viewer.querySelector(".deckflip-title");
    const count = viewer.querySelector(".deckflip-count");
    const strip = viewer.querySelector(".deckflip-thumbs");
    const thumbs = Array.from(viewer.querySelectorAll(".deckflip-thumb"));
    const cards = thumbs.map((t) => ({ n: t.dataset.n, title: t.dataset.title }));
    const src = (n, side) => `/images/cards/card-${n}-${side}.webp`;
    let i = 0;

    const label = () => {
      const c = cards[i];
      const side = card.classList.contains("is-flipped") ? "back" : "front";
      card.setAttribute("aria-label", `Card ${c.n}, ${c.title}. Showing the ${side}. Press to turn over.`);
    };
    const show = (k) => {
      i = (k + cards.length) % cards.length;
      const c = cards[i];
      card.classList.add("is-swapping");
      card.classList.remove("is-flipped");
      card.setAttribute("aria-pressed", "false");
      front.src = src(c.n, "front");
      back.src = src(c.n, "back");
      void card.offsetWidth;
      card.classList.remove("is-swapping");
      title.textContent = c.title;
      count.textContent = `${i + 1} of ${cards.length}`;
      thumbs.forEach((t, k2) => t.setAttribute("aria-current", String(k2 === i)));
      const t = thumbs[i];
      strip.scrollTo({ left: t.offsetLeft - strip.clientWidth / 2 + t.clientWidth / 2, behavior: reduceMotion ? "auto" : "smooth" });
      label();
      [i + 1, i - 1].forEach((j) => { const nb = cards[(j + cards.length) % cards.length]; new Image().src = src(nb.n, "back"); });
    };
    card.addEventListener("click", () => {
      const on = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(on));
      label();
    });
    viewer.querySelectorAll(".deckflip-btn").forEach((b) => b.addEventListener("click", () => show(i + Number(b.dataset.dir))));
    thumbs.forEach((t, k) => t.addEventListener("click", () => show(k)));
    viewer.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); show(i + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); show(i - 1); }
    });
    new Image().src = src(cards[0].n, "back");
  });

  /* ---------- Deck cards flip ---------- */
  document.querySelectorAll(".pcard").forEach((card) => {
    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(flipped));
    });
  });

  /* ---------- Sport picker ---------- */
  document.querySelectorAll("[data-sports]").forEach((block) => {
    const buttons = block.querySelectorAll(".sport");
    const names = block.querySelectorAll(".sport-name");
    const out = block.querySelector(".course-out");
    const select = document.getElementById(block.dataset.sports);
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        names.forEach((n) => { n.textContent = btn.dataset.sport; });
        if (out) { out.querySelectorAll(".course").forEach((c) => { c.style.animation = "none"; void c.offsetWidth; c.style.animation = ""; }); }
        if (select) select.value = btn.dataset.sport;
      });
    });
  });

  /* ---------- Athlete A or Athlete B ---------- */
  document.querySelectorAll("[data-ab]").forEach((block) => {
    const choices = block.querySelectorAll(".ab__choice");
    const results = block.querySelectorAll(".ab__result");
    choices.forEach((choice) => {
      choice.addEventListener("click", () => {
        choices.forEach((c) => c.setAttribute("aria-pressed", String(c === choice)));
        results.forEach((r) => { r.hidden = r.dataset.kind !== choice.dataset.kind; });
      });
    });
  });

  /* ---------- Carousel arrows ---------- */
  document.querySelectorAll("[data-carousel]").forEach((nav) => {
    const track = document.getElementById(nav.dataset.carousel);
    if (!track) return;
    nav.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const step = track.querySelector("figure")?.getBoundingClientRect().width || 300;
        track.scrollBy({ left: (btn.dataset.dir === "prev" ? -1 : 1) * (step + 14), behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
  });

  /* ---------- Phone feed: duplicate so it loops ---------- */
  document.querySelectorAll(".phone__feed").forEach((feed) => {
    Array.from(feed.children).forEach((n) => { const c = n.cloneNode(true); c.setAttribute("aria-hidden", "true"); c.alt = ""; feed.appendChild(c); });
  });
  document.querySelectorAll(".marquee__track").forEach((track) => {
    Array.from(track.children).forEach((n) => { const c = n.cloneNode(true); c.setAttribute("aria-hidden", "true"); track.appendChild(c); });
  });

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const setMenu = (open) => {
    root.classList.toggle("menu-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      const label = toggle.querySelector(".menu-label");
      if (label) label.textContent = open ? "Close menu" : "Open menu";
    }
    if (menu) menu.toggleAttribute("inert", !open);
    if (header) header.classList.remove("is-hidden");
  };
  if (menu) menu.setAttribute("inert", "");
  if (toggle) toggle.addEventListener("click", () => setMenu(!root.classList.contains("menu-open")));
  if (menu) menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

  /* ---------- Quick links ---------- */
  if (quick) {
    const qBtn = quick.querySelector(".quick__btn");
    const setQuick = (open) => { quick.classList.toggle("is-open", open); qBtn.setAttribute("aria-expanded", String(open)); };
    qBtn.addEventListener("click", () => setQuick(!quick.classList.contains("is-open")));
    quick.addEventListener("click", (e) => { if (e.target.closest("a")) setQuick(false); });
    document.addEventListener("click", (e) => { if (!quick.contains(e.target)) setQuick(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { setQuick(false); setMenu(false); } });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Forms ---------- */
  document.querySelectorAll("form[data-form]").forEach((form) => {
    const status = form.querySelector(".form-status");
    const button = form.querySelector("button[type=submit]");
    const say = (msg) => { if (status) status.textContent = msg; };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = `${form.dataset.form} from ${data.get("name") || data.get("email") || "the website"}`;
      data.append("_subject", subject);

      if (SITE_CONFIG.formEndpoint) {
        if (button) button.disabled = true;
        say("Sending…");
        try {
          const res = await fetch(SITE_CONFIG.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          say(form.dataset.success || "Thanks, that's with me. I'll reply personally, usually within a day.");
        } catch (err) {
          say("That didn't send. Please try again, or message me on Instagram.");
        } finally {
          if (button) button.disabled = false;
        }
        return;
      }
      if (SITE_CONFIG.email) {
        const lines = [];
        data.forEach((value, key) => {
          if (key.startsWith("_") || !String(value).trim()) return;
          const label = form.querySelector(`label[for="${form.id}-${key}"]`);
          lines.push(`${label ? label.textContent.trim() : key}: ${value}`);
        });
        window.location.href = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
        say("Your email app should open with everything filled in. Just press send.");
        return;
      }
      say("This form isn't connected yet. Please message me on Instagram in the meantime.");
    });
  });
})();
