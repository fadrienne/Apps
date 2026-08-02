---
name: morning-magazine
description: >
  Generates Francesca's daily "Morning Edition" — a curated, editorially styled HTML + PDF magazine of 10 stories filtered through her professional lens as Founder of SHORE Institute, ocean governance researcher, and Shorelines newsletter writer. Trigger this skill whenever the user says "morning magazine", "morning edition", "daily briefing", "build my magazine", "run my morning", or any close variant. Also trigger if the user says "what's happening today" in a professional context, or asks for a curated news digest. Load aggressively for any request that involves building or generating a daily news or intelligence briefing for Francesca.
---

# Morning Magazine Skill

## Trigger

This skill has two separate trigger paths:
1. **Manual** — Francesca asks for it directly in a session (see phrases below).
2. **Scheduled** — a `/schedule` cloud routine named "Morning Magazine — 7am" runs this exact workflow automatically every day and uploads the result to Google Drive. That routine is a separate object from this file; this file is what it executes.

**Trigger phrases for manual runs:**
- "morning magazine"
- "run my morning edition"
- "build today's magazine"
- "morning edition"
- "my morning briefing"
- "what's my morning"
- Or any close variant of the above

When triggered, do not ask clarifying questions. Run all steps immediately and deliver the HTML and PDF files.

---

## What This Skill Does

Generates a single self-contained HTML file styled as an editorial magazine, plus a PDF version. It:
1. Searches for stories from Francesca's approved sources on her core topics
2. Filters out skip topics
3. Applies her personal lens to select and frame each story
4. Writes 10 stories, each with a one-line "why this matters to you", short-form Story Notes, and a longer Story Article draft, all addressed to Francesca in second person
5. Flags urgent/actionable stories with ⚡
6. Renders a full HTML magazine with distinct layouts per story
7. Converts the HTML to a PDF
8. Saves both, and uploads the PDF to Google Drive if running as the scheduled routine

---

## Step 1: Source Research

Use web search to pull fresh stories from these sources:

**Core sources:**
- Hakai Magazine (hakaimagazine.com)
- The Conversation — science and policy sections
- Carbon Brief
- Nature — ocean and geosciences feed
- IISD Earth Negotiations Bulletin
- IOC/UNESCO Ocean news
- UN News — oceans and SIDS tags
- IUCN news
- Commonwealth Secretariat news
- Seabed 2030 / GEBCO updates

Search queries should target today's date. Run 5 to 7 searches covering the topic areas below. Prioritise stories from the last 48 hours.

---

## Step 2: Topic Filter

**Include stories on:**
1. Ocean governance and international policy (BBNJ, UNCLOS, Marine Spatial Planning, high seas)
2. Hydrospatial science and seafloor mapping technology (bathymetry, SDB, LiDAR, multibeam, GeoAI, GIS)
3. SIDS equity, climate finance, and capacity gaps
4. Blue economy and just blue transitions
5. GeoAI, remote sensing, and spatial data tools
6. Science-to-policy pipelines and data sovereignty
7. Academic publishing and research landscape in ocean and geoscience

**Skip entirely:**
- Crypto and Web3
- Sports
- Celebrity and entertainment
- Generic AI hype unrelated to spatial science or ocean governance
- Fashion and lifestyle
- Mainstream financial markets

---

## Step 3: Apply Francesca's Lens

Before selecting stories, read this carefully.

Francesca is the Founder of SHORE Institute (Seychelles Hydrospatial Observatory for Research and Exploration), a spatial specialist with over 15 years of experience in spatial science, researcher working on hydrospatial equity and ocean governance, and writer of the Shorelines newsletter. She is based in Victoria, Seychelles.

Her current focus areas:
- The HARMONiSE framework and Ocean Mapping Hub
- The High-Income SIDS Paradox (Seychelles as a case study)
- BBNJ Agreement implementation
- Seabed 2030 and UN Ocean Decade
- Just blue transitions and data sovereignty
- The science-to-policy pipeline

**Filter every story through these three questions:**
1. Does this affect my work, research, or SHORE Institute directly?
2. Is this something I would want to talk about — at a conference, in a meeting, or with a peer?
3. Could this become a Shorelines piece, a LinkedIn post, or a funding/partnership lead?

If a story does not pass at least one of these, cut it. If it passes all three, it ranks high.

**Lead every story with why it matters to Francesca specifically** — not a generic summary of the event.

**Voice: second person, always.** All written copy in the magazine addresses Francesca directly as "you" — never third person ("Francesca", "she", "her"). When a possessive would be ambiguous against "you" (e.g. "her government", "her organisation"), name the entity instead: "Seychelles's government", "SHORE", "Shorelines". This applies to every section of every story, not just the lede.

---

## Step 4: Select and Flag 10 Stories

Rank and select the top 10 stories that pass the lens filter.

Flag any story that is **directly urgent or actionable** — a funding deadline, a consultation closing, a treaty vote, a call for submissions — with a ⚡ icon displayed prominently at the top of that story spread.

---

## Step 5: Write Each Story

Each story has **three distinct written parts**, in this order, each clearly labelled in the rendered spread:

### 1. Why This Story Is Important

Exactly **one sentence**. Second person, addressed directly to Francesca. States why this specific story matters to *you* — your work, SHORE, or Shorelines — not a summary of the event itself. This is the personal stake, distilled to a single line.

Example (voice reference, not to be reused verbatim):
> *The Commonwealth is holding a grant open specifically for the 25 Commonwealth SIDS, Seychelles among them, and it's a call Seychelles's government is already eligible to fill.*

Rendered **bold and italic**, in a distinct accent colour from the body text (see Step 6 for the CSS treatment) — this line should be visually unmistakable as the "why it matters" beat, before the reader hits a word of the story itself.

### 2. Story Notes

**2 to 3 tight paragraphs.** This is the short-form editorial cut: quick to read, suited for a Substack note or a LinkedIn post. Rules:

- Second person throughout, per the voice rule above
- Lead with the detail that matters most, not a headline restatement
- Then the rest: what happened, who is involved, what is at stake
- No filler phrases ("according to sources", "experts say", "in a world where")
- No em dashes
- No kicker sentences that restate what the paragraph already established
- No hollow transitions
- Write editorial, not AI summary
- If there is a direct link to act on (submit, apply, read the full text), include it as a clean URL at the end

### 3. Story Article

**A longer draft, roughly 5 to 8 paragraphs (400 to 700 words).** This is the raw material for an actual Shorelines piece, not a note. Rules:

- Follow Francesca's established writing rules (see her CLAUDE.md Writing rules: direct, moving quickly between observation and argument, visible point of view, no em dashes, short sentences earn their place after long ones, "But" and "So" openers are fine)
- Banned: kicker sentences that restate the paragraph, negative parallelism ("it's not X, it's Y"), rhetorical questions answered in the next clause, over-signalled transitions like "Furthermore", hedged padding, stakes inflation, false suspense ("here's where it gets interesting")
- Academic register: precise and evidence-based, not passive and padded. Anchor claims in concrete numbers and named specifics, not general claims
- Name the objection or counterpoint before answering it where one exists
- This section stands on its own as a publishable draft — it does not need to repeat the one-line "why it matters" verbatim, but should carry the same underlying argument, developed properly: context, stakes, what happens next
- If there is a direct link to act on, include it as a clean URL at the end

---

## Step 6: Render the HTML Magazine

Generate a **single self-contained HTML file** with all styles, fonts, and content inline. No external dependencies except Google Fonts.

### Typography
- Import **Fraunces** and **Inter** from Google Fonts
- Use huge display typography throughout — minimum 2rem for body, much larger for display heads
- No small fonts anywhere in the magazine

### Structure
- A masthead at the top: "Morning Edition" + today's date
- A **"Jump to Story"** navigation bar listing all 10 story headlines as anchor links
- 10 story spreads, each with its own distinct layout

### Story Spread Designs

Give each of the 10 stories a **distinct visual treatment**. Rotate through these layouts (adapt freely, do not use the same layout twice). All layouts use light backgrounds — see Colour Rules below.

1. **Hero** — Full-bleed sky-blue or sunshine-yellow background, massive serif headline, dark navy text, ⚡ badge if flagged
2. **Coastal** — Pale blue background with a deep-green accent rule, two-column layout
3. **Sunbeam Alert** — Bright sunshine-yellow background, stamp-style story number, bold italic navy headline
4. **Terminal** — Monospace font treatment, deep-green text on a pale mint background, code-aesthetic layout
5. **Academic Drop Cap** — Clean off-white background, large drop cap in navy on first paragraph, footnote-style citation
6. **Big Stat** — A key number or data point pulled from the story rendered in massive display type (navy or teal) as the centrepiece
7. **Pull Quote** — A key sentence from the story rendered as a large magazine pull quote across the spread, on a pale blue or pale green field
8. **Broadsheet** — Newspaper column grid, two or three columns, small ornamental rule in teal
9. **Colour Field** — Bold solid background in teal, sky blue, or sunshine yellow, navy or white text, clean sans-serif
10. **Letterpress** — Cream/off-white background, serif text, tactile textured feel via CSS

### Numerals
Each story displays its number (01 through 10) prominently. Vary the numeral treatment: oversized background numeral, circled numeral, boxed numeral, hairline numeral, etc.

### Three-part story content

Every story spread renders its three written parts from Step 5, in order, each visually distinguishable:

1. **Why This Story Is Important** — the single bold-italic sentence, in an accent colour distinct from the body copy (e.g. deep teal or forest green against navy body text — stay within the strict palette below). No section label needed above it; its styling alone marks it as the lede beat.
2. **Story Notes** — labelled with a small-caps or letter-spaced eyebrow heading reading "STORY NOTES", then the 2 to 3 short paragraphs.
3. **Story Article** — labelled with a matching eyebrow heading reading "STORY ARTICLE", then the longer draft. Since this section runs longer, give it visual room: it can run narrower-measure (for readability at length) even within a wide layout like Broadsheet, and doesn't need to fully match the decorative intensity of the rest of the spread — legibility over ornament here.

Each story spread therefore has more content than earlier editions did. Keep the layout's *distinct visual treatment* (per the list above) applied to the spread as a whole — masthead numeral, background, headline styling — but let the three-part body use a consistent internal pattern across all 10 stories so the reader learns to scan it.

### Colour Rules (strict)

- **No dark theme anywhere.** Do not use black, near-black, midnight, or charcoal as a dominant background, even for "Hero" or accent spreads. Every spread uses a light or bright background. Navy is permitted only as a text colour or thin accent rule, never as a large background fill.
- **No red-family colours anywhere.** No red, rose, terracotta, crimson, maroon, coral, or salmon, in any layout, accent, icon, or the ⚡ flag itself. Render the ⚡ flag in sunshine yellow or navy, never red or orange-red.
- **Palette is limited to three families:**
  - Blues: sky blue, navy blue (text/accents), teal
  - Yellows: sunshine yellow, warm gold
  - Greens: deep forest green, sage green, mint
  - Neutrals for background/text only: off-white, cream, slate grey, charcoal (text only, never a background fill)
- Do not introduce orange, purple, pink, or any colour outside the three families above plus the listed neutrals.

### Navigation
The jump-to nav at the top should be sticky or clearly delineated. Use anchor IDs on each story spread so the links work.

---

## Step 7: Convert to PDF

Convert the finished HTML file to a PDF, preserving layout as closely as possible (e.g. headless-browser print-to-PDF, or an available HTML-to-PDF library in the environment). If no PDF tool is available, install one (e.g. `playwright`, `weasyprint`, or equivalent) before failing this step.

---

## Step 8: Save and Deliver

Always save both files locally in the current environment:

```
magazines/YYYY-MM-DD.html
magazines/YYYY-MM-DD.pdf
```

Where `YYYY-MM-DD` is today's date. Create the `magazines/` directory if it does not exist.

**If running as the scheduled cloud routine** (Google Drive MCP connector available): also upload `YYYY-MM-DD.pdf` to a Google Drive folder named "Morning Magazine" (create the folder if it does not exist), using the Drive connector's create/upload tool. If the PDF's base64 payload is too large to relay through the tool call (this has happened in practice for magazines around 600KB+, since dense base64 text can blow up token cost far faster than its byte size suggests), fall back to uploading `YYYY-MM-DD.html` instead — same folder, same filename pattern. The HTML renders identically in a browser, so nothing is lost except the binary PDF artifact itself. Note the fallback in the delivery summary rather than silently substituting it.

**If running manually with no Drive connector available:** just confirm the local file paths — do not attempt the Drive upload.

Confirm what was saved/uploaded to Francesca when done.

---

## Output Summary

After saving, provide a short briefing in chat:
- Date and file paths (and Drive link, if uploaded)
- Number of stories flagged ⚡ and what they are
- One sentence on the overall themes of today's edition

Keep this brief. The magazine is the deliverable, not the chat summary.

---

## Voice and Style Reminders

These apply to all written copy in the magazine:

- Second person throughout — "you", "your" — never "Francesca", "she", "her". Name entities (Seychelles, SHORE, Shorelines) instead of using an ambiguous possessive
- No em dashes
- No hollow openers or closers
- No kicker sentence pairs that restate the argument
- No buzzwords: game-changer, synergy, impactful, transformative, ecosystem (unless literal)
- Straightforward punctuation
- Write as if Francesca is reading it over her first coffee and needs every word to earn its place
