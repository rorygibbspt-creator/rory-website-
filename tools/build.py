"""Build the site: python3 tools/build.py

Assemble the static pages: shared head, loader, header, quick links and footer around each page body."""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT

# key, label, href, menu subtitle, tone, icon, in desktop nav
NAV = [
    ("deck", "Deck", "/deck", "Coming soon", "sky", "cards", True),
    ("book", "Book", "/book", "Out now", "sage", "book", True),
    ("app", "App", "/app", "Coming soon", "blush", "phone", True),
    ("schools", "Speaking", "/schools", "Schools", "sky", "school", True),
    ("courses", "Courses", "/courses", "Every sport", "sun", "play", True),
    ("parents", "Parents", "/parents", "How to help", "blush", "parent", True),
    ("mentoring", "Mentoring", "/mentoring", "1:1", "sage", "target", False),
    ("about", "About", "/about", "My story", "sage", "medal", True),
]

def svg(body, sw=2):
    return f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{body}</svg>'

ICONS = {
    "arrow": svg('<path d="M4 12h15M13 6l6 6-6 6"/>'),
    "prev": svg('<path d="M15 6l-6 6 6 6"/>'),
    "next": svg('<path d="M9 6l6 6-6 6"/>'),
    "plus": svg('<path d="M12 5v14M5 12h14"/>', 2.6),
    "cards": svg('<rect x="3" y="6" width="12" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v13"/>'),
    "book": svg('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>'),
    "play": svg('<rect x="2.5" y="4" width="19" height="14" rx="3"/><path d="m10 8.5 5 2.5-5 2.5z"/><path d="M8 21h8"/>'),
    "school": svg('<path d="M3 9l9-5 9 5-9 5z"/><path d="M7 11.2V16c0 1.4 2.2 3 5 3s5-1.6 5-3v-4.8M21 9v5"/>'),
    "parent": svg('<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9.5" r="2.2"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0M13.5 20a3.6 3.6 0 0 1 7.2 0"/>'),
    "target": svg('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>'),
    "medal": svg('<circle cx="12" cy="15" r="5.5"/><path d="M8.5 10.5 5 3h5l2 4 2-4h5l-3.5 7.5"/>'),
    "runner": svg('<circle cx="15" cy="4.5" r="2"/><path d="M6 21l4-6 3 2 1 4M8 12l3-4 4 2 3 3M11 8l-4 1-2 3"/>'),
    "mind": svg('<path d="M9 21v-3H6a2 2 0 0 1-2-2v-3l-2-1 2-4a7 7 0 0 1 14 2c0 2-1 3.5-2 4.5V21"/><path d="M13 7v2M16 9l-1.5 1.5M10 9l1.5 1.5"/>'),
    "chart": svg('<path d="M4 20V14M10 20V9M16 20V5M3 20h18"/>'),
    "stories": svg('<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-5 4z"/><path d="M8 9h8M8 12h5"/>'),
    "trophy": svg('<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/>'),
    "moon": svg('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),
    "chat": svg('<path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M19 9h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v3l-3-3"/>'),
    "bulb": svg('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>'),
    "shield": svg('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'),
    "clock": svg('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/>'),
    "heart": svg('<path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.2 4.5 4.5 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>'),
    "globe": svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z"/>'),
    "phone": svg('<rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M11 18.5h2"/>'),
    "sprout": svg('<path d="M12 21v-8"/><path d="M12 13c0-4 3-6.5 8-6.5 0 4.5-3 6.5-8 6.5zM12 15c0-3.5-2.6-5.5-7-5.5 0 4 2.6 5.5 7 5.5z"/>'),
    "mountain": svg('<path d="M2 20 9.5 8l4 6 2.5-3.5L22 20z"/><path d="M9.5 8V3l4 1.5-4 1.5"/>'),
    "instagram": svg('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>'),
    # sport balls for the hero
    "football": svg('<circle cx="12" cy="12" r="9"/><path d="m12 7.5 3.4 2.5-1.3 4h-4.2l-1.3-4zM12 3v4.5M15.4 10l4.8-1.4M14.1 14l2.8 4.3M9.9 14l-2.8 4.3M8.6 10 3.8 8.6"/>', 1.7),
    "tennis": svg('<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6a9 9 0 0 1 0 12.8M18.4 5.6a9 9 0 0 0 0 12.8"/>', 1.8),
    "basketball": svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5.6 5.6c3 2.5 3 10.3 0 12.8M18.4 5.6c-3 2.5-3 10.3 0 12.8"/>', 1.7),
    "rugby": svg('<ellipse cx="12" cy="12" rx="10" ry="6" transform="rotate(-35 12 12)"/><path d="m9.5 14.5 5-5M10.5 11l1 1M12 9.5l1 1M11.5 13.5l1 1"/>', 1.8),
    "oar": svg('<path d="M4 20 16 8"/><path d="M15 9c1-3 3.5-5.5 6-6-.5 2.5-3 5-6 6z"/><path d="M3 21l2-2"/>', 1.9),
}

RORY = open(pathlib.Path(__file__).parent / "rory.svg").read().strip()
ICONS["rory"] = RORY

HEAD = """<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#faf7f0">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="/assets/img/deck-box.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<script>try{{var d=document.documentElement;d.classList.add('js');if(!sessionStorage.getItem('rg-loaded')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('show-loader')}}catch(e){{}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Gochi+Hand&family=Nunito:wght@600;700;800;900&display=swap">
<link rel="stylesheet" href="/assets/css/site.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
"""

LOADER = f"""<div class="loader" aria-hidden="true">
  <div class="loader__inner">
    <div class="loader__deck">
      <div class="loader__card"><img src="/assets/img/sleep-rating.webp" alt=""></div>
      <div class="loader__card"><img src="/assets/img/teammate-athlete-b.webp" alt=""></div>
      <div class="loader__card"><img src="/assets/img/sleep-cover.webp" alt=""></div>
      <div class="loader__card"><img src="/assets/img/teammate-cover.webp" alt=""></div>
      <div class="loader__card"><img src="/assets/img/deck-card-welcome.webp" alt=""></div>
    </div>
    <div class="loader__brand brand--athlete"><span class="brand__mark">The <b>Athlete</b></span><span class="brand__by">by Rory Gibbs OLY</span></div>
    <div class="loader__words"><span>Think better.</span><span>Train better.</span><span>Respond better.</span></div>
    <div class="loader__bar"><i></i></div>
    <div class="loader__count">0%</div>
  </div>
</div>
"""

def cur(key, active):
    return ' aria-current="page"' if key == active else ""

def header(active):
    links = "\n".join(f'        <li><a href="{href}"{cur(key, active)}>{label}</a></li>' for key, label, href, _, _, _, desk in NAV if desk)
    mobile = "\n".join(
        f'      <li><a href="{href}"{cur(key, active)}><span class="dot icon--{tone}">{ICONS[icon]}</span>{label}<small>{sub}</small></a></li>'
        for key, label, href, sub, tone, icon, _ in NAV
    )
    return f"""<header class="site-header">
  <div class="wrap">
    <a class="brand brand--athlete" href="/" aria-label="The Athlete by Rory Gibbs, home"><span class="brand__mark">The <b>Athlete</b></span><span class="brand__by">by Rory Gibbs</span></a><span class="brand__tag">Built. Not born.</span>
    <nav class="nav" aria-label="Main">
      <ul>
{links}
      </ul>
    </nav>
    <a class="btn header-cta" href="/app#waitlist">Join the app waitlist {ICONS["arrow"]}</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu">
      <span class="menu-label">Open menu</span>
      <span class="bars" aria-hidden="true"><span></span><span></span></span>
    </button>
  </div>
</header>

<div class="mobile-menu" id="mobile-menu">
  <div class="wrap">
    <ul>
{mobile}
    </ul>
  </div>
  <div class="wrap menu-foot">
    <a class="btn" href="/deck#waitlist">Join the Athlete Deck waitlist {ICONS["arrow"]}</a>
  </div>
</div>
"""

QUICK = f"""
<div class="quick">
  <div class="quick__sheet" role="menu">
    <p>Jump to</p>
    <a href="/deck#waitlist" role="menuitem"><span class="icon icon--sky">{ICONS["cards"]}</span>Athlete Deck waitlist</a>
    <a href="/book" role="menuitem"><span class="icon icon--sage">{ICONS["book"]}</span>The book</a>
    <a href="/courses" role="menuitem"><span class="icon icon--sun">{ICONS["play"]}</span>Courses for your sport</a>
    <a href="/parents" role="menuitem"><span class="icon icon--blush">{ICONS["parent"]}</span>Help for parents</a>
    <a href="/app#waitlist" role="menuitem"><span class="icon icon--blush">{ICONS["phone"]}</span>App waitlist</a>
    <a href="/schools" role="menuitem"><span class="icon icon--sky">{ICONS["school"]}</span>Book a school seminar</a>
    <a href="https://www.instagram.com/rorygibbsoly/" target="_blank" rel="noopener" role="menuitem"><span class="icon icon--blush icon--coral">{ICONS["instagram"]}</span>Follow on Instagram</a>
  </div>
  <button class="quick__btn" type="button" aria-expanded="false">{ICONS["plus"]}Quick links</button>
</div>
"""

FOOTER = f"""
<section class="signup-bar" aria-label="Sign up">
  <div class="wrap">
    <div class="signup-bar__inner">
      <span class="signup-bar__icon">{ICONS["mountain"]}</span>
      <p class="signup-bar__title">A stronger generation.<br><span>Built. Not born.</span></p>
      <p class="signup-bar__text">Practical tools, new resources and first access from Rory Gibbs.</p>
      <form class="inline-form" id="bar" data-form="Mailing list signup" data-success="You're in. Look out for the first email soon." novalidate>
        <div class="field"><label class="visually-hidden" for="bar-email">Email</label><input id="bar-email" name="email" type="email" autocomplete="email" placeholder="Your email address" required></div>
        <button class="btn" type="submit">Sign up {ICONS["arrow"]}</button>
        <p class="form-status" role="status" aria-live="polite" style="flex-basis:100%;color:#ffd2cb"></p>
      </form>
    </div>
  </div>
</section>

<footer class="site-footer">
  <div class="wrap">
    <p class="footer-big" data-split>Built, <span class="coral">not born.</span></p>
    <div class="footer-top">
      <div class="stack-sm">
        <a href="/" class="footer-brand brand--athlete"><span class="brand__mark">The <b>Athlete</b></span><span class="brand__by">by Rory Gibbs OLY</span></a>
        <p style="color:rgba(255,255,255,.75);max-width:38ch;margin-inline:auto 0">Olympic champion, Paris 2024. Mindset content, tools and courses for young athletes of every sport, and the parents behind them.</p>
      </div>
      <div class="footer-col">
        <h4>Explore</h4>
        <ul>
          <li><a href="/deck">The Athlete Deck</a></li>
          <li><a href="/app">The Athlete App</a></li>
          <li><a href="/book">The book</a></li>
          <li><a href="/courses">Courses</a></li>
          <li><a href="/parents">For parents</a></li>
          <li><a href="/schools">School speaking</a></li>
          <li><a href="/mentoring">Mentoring</a></li>
          <li><a href="/about">About me</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Follow</h4>
        <ul>
          <li><a href="https://www.instagram.com/rorygibbsoly/" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="https://www.tiktok.com/@rory_gibbs1" target="_blank" rel="noopener">TikTok</a></li>
          <li><a href="https://www.youtube.com/@Rowkouts" target="_blank" rel="noopener">YouTube</a></li>
          <li><a href="https://www.linkedin.com/in/rorygibbsoly/" target="_blank" rel="noopener">LinkedIn</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; <span data-year>2026</span> Rory Gibbs OLY</span>
      <span>Think better. Train better. Respond better.</span>
    </div>
  </div>
</footer>
{QUICK}
<script src="/assets/js/site.js" defer></script>
</body>
</html>
"""

def build(path):
    raw = path.read_text()
    meta_block, body = raw.split("\n---\n", 1)
    meta = dict(line.split(": ", 1) for line in meta_block.strip().splitlines())
    body = re.sub(r"\{\{(\w+)\}\}", lambda m: ICONS[m.group(1).lower()] if m.group(1).lower() in ICONS else m.group(0), body)
    html = HEAD.format(title=meta["title"], desc=meta["desc"])
    html += LOADER
    html += header(meta.get("nav", ""))
    html += '\n<main id="main">\n' + body.strip() + "\n</main>\n"
    html += FOOTER
    (OUT / f"{path.stem}.html").write_text(html)
    return path.stem

if __name__ == "__main__":
    for old in OUT.glob("*.html"):
        old.unlink()
    built = [build(p) for p in sorted(SRC.glob("*.html"))]
    print("built:", ", ".join(built))
