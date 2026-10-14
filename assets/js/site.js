/* Rory Gibbs OLY: small, dependency free site behaviour. */

/*
 * Form delivery. Set ONE of these and every enquiry form on the site works.
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
  const progress = document.querySelector(".race-progress");
  const metres = document.querySelector(".race-metres");
  const hero = document.querySelector(".hero, .lumo-hero");
  const bands = Array.from(document.querySelectorAll(".band img"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header turns solid once you leave the hero, and the gold line tracks a 2000m race. */
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const threshold = hero ? Math.max(hero.offsetHeight - 120, 80) : 40;
    if (header) header.classList.toggle("is-solid", y > threshold || !hero);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;
    if (progress) progress.style.setProperty("--progress", ratio.toFixed(4));
    if (metres) metres.textContent = `${Math.round(ratio * 2000).toLocaleString("en-GB")} / 2,000m`;

    if (!reduceMotion) {
      bands.forEach((img) => {
        const rect = img.parentElement.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -0.08;
        img.style.setProperty("--parallax", `${offset.toFixed(1)}px`);
      });
    }
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* Mobile menu */
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const setMenu = (open) => {
    document.documentElement.classList.toggle("menu-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      const label = toggle.querySelector(".menu-label");
      if (label) label.textContent = open ? "Close" : "Menu";
    }
    if (menu) menu.toggleAttribute("inert", !open);
    if (header && open) header.classList.add("is-solid");
    if (!open) onScroll();
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

  /* Duplicate the logo strip so the marquee loops seamlessly. */
  document.querySelectorAll(".logos__track").forEach((track) => {
    Array.from(track.children).forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  });

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* Enquiry forms */
  document.querySelectorAll("form[data-form]").forEach((form) => {
    const status = form.querySelector(".form-status");
    const button = form.querySelector("button[type=submit]");
    const say = (msg) => { if (status) status.textContent = msg; };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = `${form.dataset.form} enquiry from ${data.get("name") || "the website"}`;
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
          say("Thanks, that's with me. I'll reply personally, usually within a day.");
        } catch (err) {
          say("That didn't send. Please try again, or message me on Instagram or LinkedIn.");
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

      say("The form isn't connected yet. Please message me on Instagram or LinkedIn in the meantime.");
    });
  });
})();
