/* Rory Gibbs OLY: small, dependency free site behaviour. */

/*
 * Form delivery. Set ONE of these and every form on the site works.
 *  - formEndpoint: a form service URL, e.g. "https://formspree.io/f/abcdwxyz"
 *  - email: an address; the visitor's own email app opens with the message filled in
 */
const SITE_CONFIG = {
  formEndpoint: "",
  email: "",
};

document.documentElement.classList.add("js");

(() => {
  const header = document.querySelector(".site-header");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header gets a hairline once you scroll */
  const onScroll = () => { if (header) header.classList.toggle("is-solid", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const setMenu = (open) => {
    document.documentElement.classList.toggle("menu-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      const label = toggle.querySelector(".menu-label");
      if (label) label.textContent = open ? "Close menu" : "Open menu";
    }
    if (menu) menu.toggleAttribute("inert", !open);
  };
  if (menu) menu.setAttribute("inert", "");
  if (toggle) toggle.addEventListener("click", () => setMenu(!document.documentElement.classList.contains("menu-open")));
  if (menu) menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* Reveal on scroll. Content is visible without JS; this only adds the entrance. */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* Carousel arrows */
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

  /* Athlete A or Athlete B */
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

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* Forms */
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
          const res = await fetch(SITE_CONFIG.formEndpoint, {
            method: "POST",
            body: data,
            headers: { Accept: "application/json" },
          });
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
