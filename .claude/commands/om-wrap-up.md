---
description: "Session review — validate notes, update indexes, run brag-spotter. Auto-triggered on 'wrap up'."
trigger: "wrap up|wrapping up|end of session|session done"
---

# Session Wrap-Up

Run a full verification pass over this session's work. This is a verification pass, not a creation pass — fix minor issues, flag substantial changes for user approval.

## 1. Session Changes

List all notes created or modified this session. Categorize: work notes, people notes, brain updates, index updates.

## 2. Note Quality

For each note created/modified:
- Frontmatter complete? (`date`, `description`, `tags`, `status` for work notes, `quarter` for work notes)
- At least one `[[wikilink]]`?
- In the correct folder?
- Description field filled in?

## 3. Index Consistency

Check that indexes reflect current reality:
- `work/Index.md` — new work notes added?
- `brain/Memories.md` — new brain topics indexed?
- `org/People & Context.md` — new people noted?
- `perf/Brag Doc.md` — wins captured?

## 4. Orphan Detection

Find notes with no incoming links. Flag them — every note should be reachable.

## 5. Archive Check

Any `work/active/` notes with `status: completed`? Suggest archiving to `work/archive/YYYY/`.

## 6. Ways of Working

Did this session surface any new patterns, gotchas, or workflow improvements worth capturing in `brain/`?

## 7. Brag Spotter

Invoke the `brag-spotter` subagent to find uncaptured wins from this session.

## 8. Final Report

Output sections: **Done**, **Fixed**, **Flagged**, **Suggested**.
