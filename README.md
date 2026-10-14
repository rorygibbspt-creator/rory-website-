# rorygibbs.com, redesigned

A fast, static rebuild of the Rory Gibbs OLY website. Plain HTML, one stylesheet and one small script. No build step, no framework, nothing to install.

## Pages

| URL | File |
| --- | --- |
| `/` | `index.html` |
| `/deck` | `deck.html` (the Athlete Deck and its waitlist) |
| `/book` | `book.html` |
| `/parents` | `parents.html` |
| `/mentoring` | `mentoring.html` |
| `/about` | `about.html` |
| `/contact` | `contact.html` |

`vercel.json` turns on clean URLs, so `/deck` serves `deck.html`.

## Look and feel

The design matches the Instagram posts and the Athlete Deck: warm paper, navy text, coral for the word that
matters, and soft sage, sky and blush panels. One typeface, Plus Jakarta Sans. Colours and spacing are variables
at the top of `assets/css/site.css`.

Instagram post images live in `assets/img/`. To add a new carousel, copy one of the `carousel` blocks on the
homepage or parents page and swap the images.

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

Each page is a normal HTML file. Change the words directly and commit. The header and footer are repeated on
every page, so a change to the menu needs making in each file.
