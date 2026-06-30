---
description: "Convert a Google Drive file to Markdown and save it to the Drive Markdowns folder"
---

# Drive → Markdown Converter

Convert a Google Drive file to Markdown using MarkItDown and save the result to the shared Markdowns folder in Google Drive.

**Input:** $ARGUMENTS — a Google Drive share URL (e.g. `https://drive.google.com/file/d/FILE_ID/view`)

**Output folder ID:** `1QtL9HURNhYXjNUJy7LW-CK0bpf_Klf3m` (Google Drive › Markdowns)

## Steps

1. **Extract the file ID** from the URL. Pattern: `/file/d/<FILE_ID>/` or `id=<FILE_ID>`.

2. **Get file metadata** — call `mcp__Google_Drive__get_file_metadata` with the file ID to get the filename and MIME type.

3. **Download the file** — call `mcp__Google_Drive__download_file_content` with the file ID.
   - If the result is saved to a file (too large for context), the response will say so and include a path. Run:
     ```bash
     RESULT_FILE="<path from response>"
     jq -r '.content' "$RESULT_FILE" | base64 -d > /tmp/drive_input.<ext>
     ```
   - If the base64 content is returned inline, write it to a temp file:
     ```bash
     echo "<base64_content>" | base64 -d > /tmp/drive_input.<ext>
     ```
   Replace `<ext>` with the file's actual extension (pdf, docx, xlsx, pptx, etc.).

4. **Convert to Markdown** using the MarkItDown venv:
   ```bash
   ~/.venvs/markitdown/bin/python - <<'EOF'
   from markitdown import MarkItDown
   result = MarkItDown().convert('/tmp/drive_input.<ext>')
   with open('/tmp/drive_output.md', 'w', encoding='utf-8') as f:
       f.write(result.text_content)
   print(f"Converted: {len(result.text_content)} characters")
   EOF
   ```

5. **Read the output** — read `/tmp/drive_output.md` to get the Markdown content.

6. **Upload to Drive Markdowns folder** — call `mcp__Google_Drive__create_file` with:
   - `name`: the original filename with `.md` extension (e.g. `report.pdf` → `report.md`)
   - `content`: the full Markdown text from step 5
   - `mimeType`: `text/markdown`
   - `parentId`: `1QtL9HURNhYXjNUJy7LW-CK0bpf_Klf3m`

7. **Report** — tell the user:
   - The Drive file name and character count
   - That the file is now in the Markdowns folder in Google Drive
   - They can download it on their phone at `/Internal storage/Download/Markdowns/`

## Error handling

- If the venv is missing: `~/.venvs/markitdown/bin/python` does not exist → tell the user to run `python3 -m venv ~/.venvs/markitdown && ~/.venvs/markitdown/bin/pip install markitdown cryptography` in a Claude Code session.
- If conversion fails on a format: MarkItDown supports PDF, DOCX, XLSX, PPTX, HTML, CSV, JSON, IPYNB. For unsupported types, report the error and suggest uploading a supported format.
- Clean up temp files after upload: `rm -f /tmp/drive_input.* /tmp/drive_output.md`
