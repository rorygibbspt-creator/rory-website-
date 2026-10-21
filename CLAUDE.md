# The Athlete by Rory Gibbs: project guide

Read this first in every new chat. It keeps the website, deck, presentations, courses and app consistent.
The plan and build order live in `ROADMAP.md`. Handover notes, links and briefs live in `docs/`.

## Who and what

- Rory Gibbs OLY. Olympic champion, men's eight, Paris 2024. 2x World Champion, 5x European Champion,
  6x World Cup winner. Started rowing at 18 after rugby. Tokyo 2021 fell short, Paris 2024 gold.
- Brand: **The Athlete by Rory Gibbs**. Tagline: **Built. Not born.**
- Audience: young athletes of every sport (roughly 12 to 22) and their parents, plus coaches and schools.
- Promise: think better, train better, respond better. Practical tools, real stories, simple actions.
- Products: free social content, the Athlete Deck (digital first, physical later), the book
  *The Athlete: Built Not Born* (out now, Amazon), school presentations (online first), courses
  (one core course, then sport specific versions for athletes and for parents), the app ("your coach in your pocket"),
  and a small amount of 1:1 mentoring (ages 14 to 22).
- Out of scope now: corporate speaking, workshops, LUMO children's books.

## Voice and writing rules

- British English. No dashes of any kind (no em or en dashes) in anything written for Rory.
- Plain, warm, direct. Short sentences. Talk to a 14 year old and their parent at the same time.
- Honest. Never invent stats, testimonials, prices or product claims. Say "coming soon" for unbuilt things.
- Real testimonials only: Sarah Hughes, Rachel Kemp, Mark Patel, Tom C. (mentoring), Joanna Park (schools).
- Confirmed: the Athlete Deck has **93 cards**.
- Unconfirmed, do not publish without Rory's OK: course prices, app features.

## Look

- Colours: paper `#faf7f0`, navy `#17324a`, coral `#ea5a4a` (the key word), sage `#e2ecda`, sky `#ddedf6`,
  blush `#fbe4df`, sun `#f2b544`.
- Type: Plus Jakarta Sans (bold, tight headings), Gochi Hand for hand written notes, Nunito as a rounded fallback.
- Style: flat pastel illustrations, rounded panels, coral "burst" marks beside headlines, pill labels.
- Deck sections: Start Here, Mindset, Performance, Stories, Parent Support.

## Repo and build

- Static site. Edit pages in `src/*.html`, then run `python3 tools/build.py` to regenerate the root `*.html`.
  Never edit the root `*.html` directly. Shared header, footer, loader and icons are in `tools/build.py`.
- Styles in `assets/css/site.css`, motion and forms in `assets/js/site.js`, images in `assets/img/`.
- Real deck artwork lives in `images/cards` (card-NN-front/back.webp), `images/box` and `images/rory`.
  The card viewer (`{{DECKFLIP}}` in any page) reads its card list from `DECK_CARDS` in `tools/build.py`.
  To add a card: drop in both images and add a line to `DECK_CARDS`.
- The hero uses `images/rory/rory-gibbs-illustration.webp`.
- Version A (previous design) is commit `d2b0211`. Version B (current) is the mockup style.
- Nothing here is live. rorygibbs.com still runs from the old `rory-2` repo on Vercel.
- Forms need `SITE_CONFIG.formEndpoint` or `email` set in `assets/js/site.js` before they send.
