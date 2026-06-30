---
description: "Convert a Google Drive file to Markdown using MarkItDown"
---

# MarkItDown

Convert a file from Google Drive to Markdown.

**Input:** $ARGUMENTS — a Google Drive share URL

## Steps

1. Extract the file ID from the URL (pattern: `/file/d/<FILE_ID>/`).

2. Call `mcp__Google_Drive__get_file_metadata` with the file ID to get the filename and extension.

3. Call `mcp__Google_Drive__download_file_content` with the file ID.
   - If the result is too large and saved to a file, the response will include the path. Run:
     ```bash
     jq -r '.content' "<path from response>" | base64 -d > /tmp/markitdown_input.<ext>
     ```
   - If the base64 content is inline, write it to a temp file:
     ```bash
     echo "<base64_content>" | base64 -d > /tmp/markitdown_input.<ext>
     ```

4. Convert to Markdown:
   ```bash
   ~/.venvs/markitdown/bin/python -c "
   from markitdown import MarkItDown
   result = MarkItDown().convert('/tmp/markitdown_input.<ext>')
   print(result.text_content)
   "
   ```

5. Show the Markdown output to the user. Ask if they want to save it anywhere.

6. Clean up: `rm -f /tmp/markitdown_input.*`
