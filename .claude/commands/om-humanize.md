---
description: "Voice-calibrated editing — makes Claude-drafted text sound like you wrote it"
---

# Humanize Note

Target: $ARGUMENTS

## Process

1. **Load voice samples** — read 3–5 existing notes the user has written (not Claude-drafted). Look in `Obsidian Mind/work/active/`, `Obsidian Mind/work/1-1/`, `Obsidian Mind/perf/brag/`. Extract the writing fingerprint: sentence length, vocabulary level, use of hedges/intensifiers, how they open bullets, punctuation habits.

2. **Detect context** from frontmatter tags:
   - `work-note` / `active` → professional but direct
   - `1-1` → conversational, first-person
   - `perf` / `brag` → corporate-confident, outcome-focused
   - `incident` → precise, factual, passive where appropriate

3. **Rewrite** the target note body to match the fingerprint and context. Preserve:
   - All frontmatter (untouched)
   - All `[[wikilinks]]`
   - All code blocks and technical terms
   - Heading structure

4. **Show diff** — present original vs revised for key paragraphs. Don't silently replace.

5. **Confirm** before writing. User approves or redirects.

Do not use a word blacklist. The goal is voice matching, not AI-word hunting.
