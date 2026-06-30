---
date: "2026-06-30"
description: "Exploration of Microsoft's MarkItDown library for document-to-Markdown conversion in LLM pipelines"
tags:
  - work-note
  - python
  - llm-tooling
status: active
quarter: "Q2 2026"
---

# MarkItDown Exploration

Exploring [[reference/markitdown|MarkItDown]] — Microsoft's Python library for converting files and URLs to Markdown for use in LLM pipelines.

## Motivation

Need a reliable way to ingest heterogeneous documents (PDFs, DOCX, XLSX, HTML) as clean Markdown for [[Technical Leadership]] — structured data feeding into Claude-based pipelines.

## What We Learned

### Converter Architecture

MarkItDown uses a priority-sorted list of `DocumentConverter` subclasses. Key insight: **both `accepts()` and `convert()` must be implemented** — `accepts()` returning `NotImplementedError` silently skips the converter with no warning.

Priority ordering (ascending = first tried):
- `0.0` — specific format converters (CSV, PDF, DOCX, XLSX, PPTX, Jupyter…)
- `10.0` — broad fallbacks: `HtmlConverter`, `ZipConverter`, `PlainTextConverter`

### Format Support Verified

| Format | Result |
| --- | --- |
| `.html` | Clean Markdown with headings, lists, tables, links |
| `.csv` | Markdown table |
| `.json` | Verbatim passthrough (plain text) |
| `.ipynb` | Code cells as fenced blocks, markdown cells preserved |
| Stream (`BytesIO`) | Works via `convert_stream(stream, file_extension=".html")` |

URL conversion (Wikipedia, RSS, YouTube) requires outbound HTTPS — confirmed blocked in restricted proxy environments.

### System Dependency Gotcha

`markitdown[all]` fails on Debian/Ubuntu system Python due to pyo3/cffi ABI mismatch in the system `cryptography` package. Workaround: virtualenv with fresh `cryptography` install.

### Custom Converter Pattern

Confirmed working pattern for extending MarkItDown with custom file types. Must register with `priority < 10.0` to run before `PlainTextConverter`. See [[reference/markitdown#Custom Converter Pattern]].

## Reference

Full API reference, usage patterns, and gotchas: [[reference/markitdown]]

## Next Steps

- [ ] Test DOCX and XLSX conversion on real documents
- [ ] Evaluate for RAG document ingestion pipeline
- [ ] Test LLM client integration for image OCR (requires Anthropic client)
- [ ] Benchmark conversion speed on large PDFs (once cffi issue resolved)
