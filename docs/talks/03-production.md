# How the videos are made

The aim: record the main talk once, then make each school's version in under an hour,
without ever re-recording or re-editing the main talk. That is what makes the £249 renewal work.

## Three separate pieces

Every school's video is three files joined end to end:

| Piece | Length | Recorded | Changes per school |
| --- | --- | --- | --- |
| 1. School intro | 60 to 90 seconds | Fresh for each school, and again at every renewal | Everything: name, thank you, events, values |
| 2. Main talk | About 17 minutes | **Once.** Refreshed at most once a year | Only the crest, school name tag and colour band on the slides |
| 3. School outro | 45 to 60 seconds | Fresh for each school, and again at every renewal | Everything |

In the main talk Rory never says a school's name. The school only appears in the picture: the crest and short name in the
top right, and a strip in the school's colours along the bottom. The deck template swaps those in automatically.

## Recording the main talk (once)

1. Record Rory's camera on its own, against a plain background, reading from a teleprompter
   (a phone teleprompter app is fine). Do the talk in short takes, one slide at a time. Mistakes don't matter: retake the line.
2. Record the slides separately, as a screen recording of the deck in full screen, or export each slide as an image.
3. In the editor, lay the camera into the round bubble, bottom left, over the slides. The deck leaves that corner empty on purpose.

Because the slides fill the screen and Rory sits in a small circle, cuts between takes are invisible.
That is how the talk ends up word perfect without any AI.

## Making a school's version

1. The school fills in the booking form: name, short name, crest file, two colours, who to thank, two details, values, an outro line.
2. Type those into the deck's "Swap in a school" panel. Every slide updates.
3. Re-export the slides (screen record or images) and drop them into a copy of the main talk project, replacing the old slide layer.
   Rory's camera layer stays exactly as it is. No re-recording, no re-editing.
4. Record the intro and outro to camera, full frame, using the intro and outro script with the school's details filled in.
5. Export: intro + main + outro as one video.

Renewal next year is just step 4 and 5 again, with new details.

**Editors that do this well:** Descript, Camtasia, ScreenFlow, or Canva's video editor. Descript is the easiest for
"replace this layer, keep everything else" and for cutting retakes by editing the transcript.

## The bubble, the illustration and AI

The draft shows Rory's real face in the bubble. Two options were discussed:

- **Rory on camera, real, throughout (recommended).** It's the thing a school is paying for, it matches the promise on the
  offer ("every word is genuinely Rory"), and parents trust a real person far more than an avatar talking about their child.
  The teleprompter, short takes and the bubble layout already give a perfect, mistake free result.
- **Rory's illustrated character** can still appear on slides as a design element, as it does on the website.

Not recommended: an AI avatar or AI voice for the main talk. If Rory ever changes his mind, the offer and the info sheet
must say so plainly, because "genuinely Rory" is part of what schools are buying.

## Files

- `docs/talks/parents/index.html`: the parents' talk deck. Open it in a browser. Arrow keys move, the script for each slide
  shows underneath, the "Swap in a school" panel changes the school.
- `docs/talks/parents-script.md`: the word for word script, generated from the deck with `python3 tools/talk_script.py parents`.
- `docs/talks/parents/img/`: copies of the images the deck uses, plus the QR code for rorygibbs.com/checklist
  (the page doesn't exist yet; it gets built in step 4).
