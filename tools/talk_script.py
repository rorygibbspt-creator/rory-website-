"""Write a talk's word for word script as Markdown, straight from its slide deck.

The deck (docs/talks/<talk>/index.html) is the source of truth: each slide's
<aside class="notes"> holds what Rory says. School details show as [SCHOOL NAME] etc.

    python3 tools/talk_script.py parents
"""
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WPM = 150
SWAPS = {"name": "SCHOOL NAME", "short": "SCHOOL SHORT NAME", "thanks": "WHO TO THANK",
         "d1": "SCHOOL DETAIL 1", "d2": "SCHOOL DETAIL 2", "values": "SCHOOL VALUES", "outro": "OUTRO LINE"}
SEGS = {"intro": "School intro (recorded fresh for each school)", "main": "Main talk (recorded once)",
        "outro": "School outro (recorded fresh for each school)"}


def text(fragment):
    fragment = re.sub(r'<span class="sw" data-s="(\w+)"></span>', lambda m: f"**[{SWAPS[m.group(1)]}]**", fragment)
    fragment = re.sub(r"<[^>]+>", "", fragment)
    return html.unescape(re.sub(r"\s+", " ", fragment)).strip()


def main(talk):
    src = (ROOT / "docs/talks" / talk / "index.html").read_text()
    slides = re.findall(r'<section class="slide[^"]*" data-seg="(\w+)" data-cam="(\w+)" data-title="([^"]+)">(.*?)</section>', src, re.S)
    title = re.search(r"<title>(.*?)</title>", src).group(1)
    out, seg_now, clock = [f"# {title}: the script", "",
                           f"Generated from `docs/talks/{talk}/index.html` by `tools/talk_script.py`. Edit the deck, then rerun.",
                           "Anything in **[BRACKETS]** is swapped for each school. Lines marked *Rory to check* need Rory's OK.", ""], None, 0.0
    for n, (seg, cam, stitle, body) in enumerate(slides, 1):
        notes = re.search(r'<aside class="notes">(.*?)</aside>', body, re.S).group(1)
        if seg != seg_now:
            out += [f"## {SEGS[seg]}", ""]
            seg_now = seg
        mins = f"{int(clock // 60)}:{int(clock % 60):02d}"
        out += [f"### {n}. {stitle.replace('[school]', '[SCHOOL]')}  ({mins}, camera: {cam})", ""]
        for d in re.findall(r'<span class="dir">(.*?)</span>', notes, re.S):
            out += [f"*{text(d)}*", ""]
        paras = [text(p) for p in re.findall(r"<p>(.*?)</p>", notes, re.S)]
        paras = [p.replace("[Rory to check]", "*(Rory to check)*") for p in paras]
        out += sum(([p, ""] for p in paras), [])
        words = sum(len(re.sub(r"\[[^\]]*\]", "", p).split()) for p in paras)
        clock += words / WPM * 60 + (8 if cam == "off" else 2)
    out.append(f"**Estimated running time: {int(clock // 60)}:{int(clock % 60):02d} at {WPM} words a minute.**")
    dest = ROOT / "docs/talks" / f"{talk}-script.md"
    dest.write_text("\n".join(out) + "\n")
    print(f"Wrote {dest.relative_to(ROOT)} ({int(clock // 60)}:{int(clock % 60):02d})")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "parents")
