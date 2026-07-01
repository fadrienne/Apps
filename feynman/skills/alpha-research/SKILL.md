---
name: alpha-research
description: "Interactive paper Q&A, reading, and annotation via the `alpha` CLI (alphaXiv-backed). Use for: asking questions about a specific arXiv paper's content, reading full paper text, inspecting a paper's GitHub repo, and managing local paper annotations. Requires the `alpha` CLI to be installed. If `alpha` is not available, fall back to /paper-lookup for search and /web-lookup for URL extraction. Do NOT use for general paper database search — use /paper-lookup. Do NOT use for general web search — use /web-lookup."
---

# Alpha Research CLI

## Prerequisite check

Before running any `alpha` command, verify the CLI is available:

```bash
which alpha 2>/dev/null || echo "NOT_FOUND"
```

**If `alpha` is not found — fall back immediately:**

| Task | Fallback |
|---|---|
| Search for papers by topic / author / DOI | Use `/paper-lookup` |
| Fetch content from a URL or read a paper online | Use `/web-lookup` |
| Ask questions about a paper's content | Fetch the PDF via `/web-lookup` then read it directly |

Tell the user that `alpha` is not installed and that they can install it with `alpha login` (alphaXiv account required). Continue with the fallback rather than stopping.

---

Use the `alpha` CLI via bash for all paper research operations.

## Commands

| Command | Description |
|---------|-------------|
| `alpha search "<query>"` | Search papers. Prefer `--mode semantic` by default; use `--mode keyword` only for exact-term lookup and `--mode agentic` for broader retrieval. |
| `alpha get <arxiv-id-or-url>` | Fetch paper content and any local annotation |
| `alpha get --full-text <arxiv-id>` | Get raw full text instead of AI report |
| `alpha ask <arxiv-id> "<question>"` | Ask a question about a paper's PDF |
| `alpha code <github-url> [path]` | Read files from a paper's GitHub repo. Use `/` for overview |
| `alpha annotate <paper-id> "<note>"` | Save a persistent annotation on a paper |
| `alpha annotate --clear <paper-id>` | Remove an annotation |
| `alpha annotate --list` | List all annotations |

## Auth

Run `alpha login` to authenticate with alphaXiv. Check status with `feynman alpha status`, or `alpha status` once your installed `alpha-hub` version includes it.

## Examples

```bash
alpha search "transformer scaling laws"
alpha search --mode agentic "efficient attention mechanisms for long context"
alpha get 2106.09685
alpha ask 2106.09685 "What optimizer did they use?"
alpha code https://github.com/karpathy/nanoGPT src/model.py
alpha annotate 2106.09685 "Key paper on LoRA - revisit for adapter comparison"
```

## When to use

- Academic paper search, reading, Q&A → `alpha`
- Current topics (products, releases, docs) → web search tools
- Mixed topics → combine both
