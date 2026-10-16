# rorygibbs.com, redesigned

A fast, static rebuild of the Rory Gibbs OLY website. Plain HTML, one stylesheet and one small script. No build step, no framework, nothing to install.

## Pages

| URL | File |
| --- | --- |
| `/` | `index.html` |
| `/deck` | `deck.html` (the Athlete Deck and its waitlist) |
| `/app` | `app.html` (the Athlete App, coming soon, with a waitlist) |
| `/book` | `book.html` |
| `/courses` | `courses.html` (sport specific courses, coming soon, with a waitlist vote) |
| `/parents` | `parents.html` |
| `/schools` | `schools.html` (seminars for schools and clubs) |
| `/mentoring` | `mentoring.html` |
| `/about` | `about.html` |
| `/contact` | `contact.html` |

`vercel.json` turns on clean URLs, so `/deck` serves `deck.html`.

## Versions

- **Version B** (current): "The Athlete by Rory Gibbs", styled after the ChatGPT mockups, with an illustrated
  animated hero scene and six product tiles.
- **Version A**: the previous animated design, commit `d2b0211`.
  To go back: `git checkout d2b0211 -- .` then commit.

The hero avatar (`assets/img/avatar.webp`) is cut out of the mockup artwork. Swap in a higher resolution PNG with a
transparent background whenever you have one; keep the same file name.

## Look and feel

Matches the Instagram posts and the Athlete Deck: warm paper, navy, coral for the key word, and soft sage, sky
and blush panels. Rounded type (Nunito) like the cards. Colours and spacing are variables at the top of
`assets/css/site.css`.

## Motion

All animation is hand written in `assets/js/site.js`, with no libraries.

- A card dealing loader on the first page view of each visit.
- Headlines rise in word by word (`data-split`). Blocks fade, pop or slide in (`reveal`, `pop`, `from-left`, `from-right`).
- The page background changes colour per section (`data-bg="sky"` and so on).
- `data-scrub` gives an element a `--p` value from 0 to 1 as it scrolls past, used for the trail, the book tilt, the phone and spinning shapes.
- The deck cards fan out as you scroll on desktop and become a swipeable row on phones. Tap to flip.
- Visitors who ask their device for reduced motion get a calm, static version.

Instagram post images live in `assets/img/`.

## Photos

A few pages use photos from the current site (`/images/...`, `/personal/...`).
Until those folders are copied into this repo, `vercel.json` fetches them from the live rorygibbs.com.

**Before pointing rorygibbs.com at this site**, copy the `public/images`, `public/logos` and `public/personal`
folders from the `rory-2` repo into the root of this repo. Files in the repo always win over the fallback, and
without them the photos would have nowhere to load from once the domain moves.

## Enquiry forms

Every form is handled by `assets/js/site.js`. Fill in one setting at the top of that file:

- `formEndpoint`: a form service URL (for example a free Formspree form). Messages land in your inbox.
- `email`: your address. The visitor's email app opens with their message filled in.

Until one is set, the forms tell visitors to message on Instagram instead.

## Editing

Edit the page sources in `src/`, then run `python3 tools/build.py` to rebuild the pages. The shared header, footer,
loader and icons live in `tools/build.py`. See `CLAUDE.md` for the brand guide and `ROADMAP.md` for the build order.
