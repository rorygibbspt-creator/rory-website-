# Handover: start here in a new chat

Everything a new chat needs to carry on where the website chat left off.
Read `CLAUDE.md` (brand and rules) and `ROADMAP.md` (build order) first, then this.

## Where things are

- **Code:** GitHub repo `rorygibbspt-creator/rory-website-`, branch `claude/website-modernize-branding-q6e4d6`.
  Nothing is live. rorygibbs.com still runs from the old `rory-2` repo.
- **Website preview links** (private, Rory's Claude account):
  - Version B, current, mockup style with real deck artwork: https://claude.ai/artifact/UZkUxphXRniMc4caSi5bXR
  - Version A, previous animated design: https://claude.ai/artifact/P4W5jnTJxwF7s9ACVPBDBv
- **Briefs** for the next pieces of work: `docs/briefs/`.

## Decisions made so far

- Brand: The Athlete by Rory Gibbs. Tagline: Built. Not born.
- Focus: young athletes of every sport and their parents. Corporate speaking, workshops and LUMO are out.
- The deck is digital first, physical later. 93 cards. Real artwork for cards 01 to 09 is on the site.
- Goal: build **online, passive income** (deck, course, recorded talks, app) rather than more 1:1 time.
- School talks start online. Rory is not in the room; parents watch on the school's screen.
- Rory's 1:1 coaching is in person, weekly, and limited by his time. Keep it, but it is not the growth plan.
- Social: Rory has started a faceless page of carousels and reels for a younger audience. Engagement on his
  personal rowing page is low.

## Still open

- Prices for talks, coaching, courses and the app.
- App features (only the "coach in your pocket" idea is agreed).
- Form delivery: set `SITE_CONFIG.formEndpoint` or `email` in `assets/js/site.js`.
- Before launch: copy `public/images`, `public/logos`, `public/personal` from `rory-2`, connect this repo to Vercel,
  then point rorygibbs.com at it.

## Starter prompts for new chats

Open a new chat with the `rory-website-` repo attached, then paste one of these:

- **Parents' evening talk:** "Read CLAUDE.md, ROADMAP.md, docs/HANDOVER.md and docs/briefs/parents-evening-talk.md.
  Build the parents' evening talk, starting with the running order and script, then the slides and the checklist."
- **The deck:** "Read CLAUDE.md and docs/HANDOVER.md. Let's keep building the Athlete Deck: card content and artwork
  for the next cards, added to the website."
- **Faceless content page:** "Read CLAUDE.md and docs/HANDOVER.md. Here's my faceless page and what I've been making.
  Help me plan content that grows it and points people to the deck, checklist and courses."
- **The core course:** "Read CLAUDE.md, ROADMAP.md and docs/HANDOVER.md. Let's plan the core course from the talks and the deck."
