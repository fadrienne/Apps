---
date: "2026-06-30"
description: "Reference for Microsoft's MarkItDown library — converts files and URLs to Markdown for LLM pipelines"
tags:
  - reference
  - python
  - llm-tooling
  - document-processing
---

# MarkItDown

[[reference/markitdown|MarkItDown]] is a Microsoft open-source Python library that converts files and URLs into Markdown. Its primary use case is feeding documents into LLM pipelines — Markdown is close to plain text but preserves structure (headings, tables, code blocks) that models understand natively.

Source: https://github.com/microsoft/markitdown

## Supported Formats

| Format | Notes |
| --- | --- |
| HTML | Full tag-to-Markdown conversion via `markdownify` |
| CSV | Rendered as a Markdown table |
| XLSX / XLS | Each sheet → Markdown table |
| DOCX | Headings, bold, italic, tables, lists |
| PPTX | Slide titles + content |
| EPUB | Chapter text extraction |
| Jupyter `.ipynb` | Code cells as fenced blocks, outputs included |
| PDF | Text extraction via `pdfminer` |
| ZIP | Recursively converts contained files |
| RSS feeds | Item titles + descriptions |
| Wikipedia URLs | Article text extraction |
| YouTube URLs | Transcript extraction |
| Images | OCR via LLM client (requires `llm_client=`) |
| Audio | Transcription via LLM client (requires `llm_client=`) |
| Plain text | Passthrough |

## Installation

```bash
# All optional dependencies (requires non-conflicting cryptography)
pip install 'markitdown[all]'

# Selective extras (safer in constrained environments)
pip install 'markitdown[docx,pptx,xlsx,pdf]'

# Base only (HTML, CSV, JSON, plain text, Jupyter)
pip install markitdown
```

**Note**: `markitdown[all]` pulls in `azure-identity` → `cryptography`, which conflicts with the system cryptography package on some Linux distros (pyo3 / cffi ABI mismatch). Use a virtualenv or selective extras.

## Core API

```python
from markitdown import MarkItDown

md = MarkItDown()

# Convert a local file — auto-detects format from extension
result = md.convert("report.xlsx")
print(result.text_content)   # Markdown string
print(result.title)          # Optional title extracted from document

# Convert a URL
result = md.convert_url("https://en.wikipedia.org/wiki/Python_(programming_language)")

# Convert from a bytes stream
import io
html = b"<h1>Hello</h1><p>World</p>"
result = md.convert_stream(io.BytesIO(html), file_extension=".html")

# Convert a requests.Response directly
import requests
resp = requests.get("https://example.com/data.csv")
result = md.convert(resp)
```

### Constructor options

```python
md = MarkItDown(
    enable_builtins=True,   # default True — loads all built-in converters
    enable_plugins=False,   # default False — loads installed plugin converters
    # LLM client passed through to image/audio converters:
    # llm_client=anthropic.Anthropic(),
    # llm_model="claude-haiku-4-5-20251001",
)
```

### Result object

```python
result.text_content  # Markdown string (also result.markdown)
result.title         # str | None — document title if extracted
str(result)          # same as result.text_content
```

## Converter Priority System

MarkItDown tries converters in **ascending priority order** — lower number runs first, higher number is a later fallback.

```
Priority 0.0  — specific format converters (CSV, PDF, DOCX, XLSX …)
Priority 10.0 — broad-match converters (HtmlConverter, PlainTextConverter, ZipConverter)
```

When building a custom converter:
1. Implement **both** `accepts()` and `convert()` — `accepts()` is mandatory; if it raises `NotImplementedError` the converter is silently skipped.
2. Register before `PlainTextConverter` by using `priority < 10.0` (default `0.0` works).

## Custom Converter Pattern

```python
from markitdown import MarkItDown
from markitdown._base_converter import DocumentConverter, DocumentConverterResult
from markitdown._stream_info import StreamInfo
from typing import Any, BinaryIO

class DotEnvConverter(DocumentConverter):
    """Converts .env / .env.example files to a Markdown table."""

    ACCEPTED_EXTENSIONS = {".env", ".env.example"}

    def accepts(self, file_stream: BinaryIO, stream_info: StreamInfo, **kwargs: Any) -> bool:
        return (stream_info.extension or "").lower() in self.ACCEPTED_EXTENSIONS

    def convert(self, file_stream: BinaryIO, stream_info: StreamInfo, **kwargs: Any) -> DocumentConverterResult:
        content = file_stream.read().decode("utf-8", errors="replace")
        rows = []
        for line in content.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, _, val = line.partition("=")
                rows.append(f"| `{key.strip()}` | `{val.strip()}` |")

        table = "| Variable | Value |\n| --- | --- |\n" + "\n".join(rows)
        return DocumentConverterResult(markdown=table, title=".env configuration")


md = MarkItDown()
md.register_converter(DotEnvConverter())  # priority=0.0 by default, runs before PlainText
```

## LLM Integration (Images / Audio)

Pass an LLM client to enable image description and audio transcription:

```python
import anthropic
from markitdown import MarkItDown

client = anthropic.Anthropic()

md = MarkItDown(
    llm_client=client,
    llm_model="claude-haiku-4-5-20251001",
)

result = md.convert("screenshot.png")
# Returns LLM-generated description as Markdown
```

MarkItDown passes the image to the LLM and asks it to describe the content in Markdown.

## Practical Patterns

### Batch-convert a directory for RAG ingestion

```python
from pathlib import Path
from markitdown import MarkItDown

md = MarkItDown()
docs = []

for path in Path("./docs").rglob("*"):
    if path.is_file():
        try:
            result = md.convert(str(path))
            docs.append({"source": str(path), "content": result.text_content})
        except Exception:
            pass  # unsupported format, skip
```

### Convert and chunk for embeddings

```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("report.pdf")

# Split on Markdown headings as natural chunk boundaries
import re
chunks = re.split(r"\n(?=#{1,3} )", result.text_content)
```

### Stream from an in-memory upload

```python
from markitdown import MarkItDown
import io

def handle_upload(filename: str, file_bytes: bytes) -> str:
    ext = "." + filename.rsplit(".", 1)[-1].lower()
    md = MarkItDown()
    result = md.convert_stream(io.BytesIO(file_bytes), file_extension=ext)
    return result.text_content
```

## Gotchas

- **`accepts()` is required** for custom converters — forgetting it means the converter is silently skipped (no error).
- **Priority is ascending** — lower number runs first; `PlainTextConverter` sits at `10.0` as the final fallback.
- **System `cryptography` conflicts** — `markitdown[all]` on Debian/Ubuntu system Python can hit a pyo3/cffi ABI mismatch. Use a virtualenv.
- **JSON is plain-text passthrough** — MarkItDown doesn't transform JSON structure; it returns it verbatim. Use `jq` or a custom converter if you need structured extraction.
- **URL conversion uses `requests` directly** — respects `HTTP_PROXY` / `HTTPS_PROXY` env vars; will fail if the proxy blocks external hosts.
- **Jupyter `.ipynb` drops cell outputs** by default in some versions — cell execution results may or may not appear depending on the version.
