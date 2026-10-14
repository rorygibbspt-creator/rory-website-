# rorygibbs.com, redesigned

A fast, static rebuild of the Rory Gibbs OLY website. Plain HTML, one stylesheet and one small script. No build step, no framework, nothing to install.

## Pages

| URL | File |
| --- | --- |
| `/` | `index.html` |
| `/mentoring` | `mentoring.html` |
| `/speaking` | `speaking.html` |
| `/workshops` | `workshops.html` |
| `/course` | `course.html` |
| `/shop` | `shop.html` |
| `/lumo` | `lumo.html` |
| `/contact` | `contact.html` |

`vercel.json` turns on clean URLs, so `/speaking` serves `speaking.html`.

## Look and feel

- Colours, fonts and spacing live at the top of `assets/css/site.css` as variables.
- Headlines: Big Shoulders Display. Body: Instrument Sans. Accent words: Instrument Serif italic.
- Palette: deep river navy, chalk white and one medal gold.
- The thin gold line under the header fills as you scroll, and on wide screens a counter shows your progress through a 2,000m race.

## Photos

Pages use the same image paths as the current site (`/images/...`, `/logos/...`, `/personal/...`).
Until those folders are copied into this repo, `vercel.json` fetches them from the live rorygibbs.com.

**Before pointing rorygibbs.com at this site**, copy the `public/images`, `public/logos` and `public/personal`
folders from the `rory-2` repo into the root of this repo. Files in the repo always win over the fallback, and
without them the photos would have nowhere to load from once the domain moves.

## Enquiry forms

Every form is handled by `assets/js/site.js`. Fill in one setting at the top of that file:

- `formEndpoint`: a form service URL (for example a free Formspree form). Messages land in your inbox.
- `email`: your address. The visitor's email app opens with their message filled in.

Until one is set, the forms tell visitors to get in touch on Instagram or LinkedIn instead.

## Editing

Each page is a normal HTML file. Change the words directly and commit. The header and footer are repeated on
every page, so a change to the menu needs making in each file.
