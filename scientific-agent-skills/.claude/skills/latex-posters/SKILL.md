---
name: latex-posters
description: Generate professional scientific conference posters in LaTeX using the beamerposter package. Supports A0/A1 portrait and landscape layouts with customizable column grids.
argument-hint: "<content source: paper file or description> [--size A0|A1|A2] [--orientation portrait|landscape] [--columns 2|3|4]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /latex-posters

Create publication-ready conference posters from paper content or structured descriptions. Generates LaTeX source that compiles to a professional A0/A1 poster.

## When to invoke

- "make a conference poster"
- "poster for NeurIPS / ICLR / ISMB / ..."
- "create a scientific poster from this paper"
- "A0 portrait poster"

## Requirements

```bash
# LaTeX distribution with beamerposter
# Ubuntu/Debian:
apt-get install texlive-full

# macOS:
brew install mactex

# Or use Overleaf (paste the generated .tex file)
```

## Poster template (A0 portrait, 3 columns)

```latex
% poster-template.tex
\documentclass[final]{beamer}

\usepackage[scale=1.24]{beamerposter}  % A0 portrait (841×1189mm)
\usepackage{graphicx, booktabs, multicol, amsmath, amssymb}
\usepackage[numbers]{natbib}
\usepackage{lipsum}

% --- Poster dimensions ---
\setlength{\paperwidth}{84.1cm}
\setlength{\paperheight}{118.9cm}
\setlength{\textwidth}{80cm}

% --- Color scheme (Nature-inspired) ---
\definecolor{mainblue}{RGB}{31, 119, 180}
\definecolor{accentorange}{RGB}{255, 127, 14}
\definecolor{lightgray}{RGB}{248, 249, 250}

% --- Beamer theme ---
\usetheme{confposter}
\setbeamercolor{block title}{fg=white,bg=mainblue}
\setbeamercolor{block body}{fg=black,bg=lightgray}
\setbeamercolor{block alerted title}{fg=white,bg=accentorange}
\setbeamercolor{block alerted body}{fg=black,bg=white}

\begin{document}
\begin{frame}[t]

% ==================== TITLE ====================
\begin{columns}[t]
\begin{column}{.78\linewidth}
  \vspace{1cm}
  {\huge\bfseries\color{mainblue} {{POSTER_TITLE}}}\\[0.8cm]
  {\Large {{AUTHOR_LIST}}}\\[0.3cm]
  {\large {{INSTITUTION}}}
\end{column}
\begin{column}{.18\linewidth}
  % Institution logo
  \includegraphics[width=\linewidth]{logo.png}
\end{column}
\end{columns}

\vspace{0.5cm}
\begin{columns}[t]

% ==================== COLUMN 1 ====================
\begin{column}{.3\linewidth}

  \begin{block}{Background \& Motivation}
    {{BACKGROUND_TEXT}}
    \begin{itemize}
      {{BACKGROUND_BULLETS}}
    \end{itemize}
  \end{block}

  \vspace{0.5cm}
  
  \begin{block}{Methods}
    {{METHODS_TEXT}}
    \begin{figure}
      \includegraphics[width=\linewidth]{methods_figure.png}
      \caption{{{METHODS_FIGURE_CAPTION}}}
    \end{figure}
  \end{block}

\end{column}

% ==================== COLUMN 2 ====================
\begin{column}{.3\linewidth}

  \begin{alertblock}{Key Findings}
    \begin{enumerate}
      {{KEY_FINDINGS_LIST}}
    \end{enumerate}
  \end{alertblock}

  \vspace{0.5cm}

  \begin{block}{Results: {{RESULT1_TITLE}}}
    {{RESULT1_TEXT}}
    \begin{figure}
      \includegraphics[width=\linewidth]{result1.png}
      \caption{{{RESULT1_CAPTION}}}
    \end{figure}
  \end{block}

\end{column}

% ==================== COLUMN 3 ====================
\begin{column}{.3\linewidth}

  \begin{block}{Results: {{RESULT2_TITLE}}}
    \begin{figure}
      \includegraphics[width=\linewidth]{result2.png}
      \caption{{{RESULT2_CAPTION}}}
    \end{figure}
    {{RESULT2_TEXT}}
  \end{block}

  \vspace{0.5cm}

  \begin{block}{Conclusions}
    \begin{itemize}
      {{CONCLUSIONS_LIST}}
    \end{itemize}
    \vspace{0.5cm}
    \textbf{Future directions:}\\
    {{FUTURE_WORK}}
  \end{block}

  \vspace{0.5cm}

  \begin{block}{References}
    \footnotesize
    \bibliographystyle{unsrtnat}
    \bibliography{references}
  \end{block}

  \vspace{0.5cm}

  \begin{block}{Contact \& Data Availability}
    \small
    \textbf{Code:} \texttt{{{GITHUB_URL}}}\\
    \textbf{Data:} {{DATA_AVAILABILITY}}\\
    \textbf{Email:} {{CONTACT_EMAIL}}\\
    \vspace{0.3cm}
    \includegraphics[width=3cm]{qr_code.png}  % QR code to paper/repo
  \end{block}

\end{column}

\end{columns}
\end{frame}
\end{document}
```

## Workflow

### Step 1: Extract content from paper or description

Parse the user's input (paper file, abstract, or description) to extract:
- Title
- Authors and affiliations
- Abstract / background
- Methods (brief)
- Key results (3–5 top findings with numbers)
- Conclusions (3–5 bullet points)
- References (top 10–15)

### Step 2: Generate LaTeX

Fill the template with extracted content:

```python
def fill_template(template, content):
    """Fill poster template with extracted content."""
    return template.replace(
        "{{POSTER_TITLE}}", content["title"]
    ).replace(
        "{{AUTHOR_LIST}}", ", ".join(content["authors"])
    ).replace(
        "{{INSTITUTION}}", content.get("institution", "")
    ).replace(
        "{{BACKGROUND_TEXT}}", content["background"]
    ).replace(
        "{{KEY_FINDINGS_LIST}}", "\n".join(
            f"  \\item {f}" for f in content["key_findings"]
        )
    ).replace(
        "{{CONCLUSIONS_LIST}}", "\n".join(
            f"  \\item {c}" for c in content["conclusions"]
        )
    )
    # ... etc.
```

### Step 3: Compile to PDF

```bash
# Compile with pdflatex
pdflatex poster.tex
pdflatex poster.tex  # run twice for bibliography

# Or with latexmk (handles all passes automatically)
latexmk -pdf poster.tex

# View result
open poster.pdf  # macOS
xdg-open poster.pdf  # Linux
```

## Content guidelines

**What makes a good poster:**

1. **Title** — 12 words max, conveys the key finding, not the topic
   - Bad: "Investigating the Role of BRCA1 in DNA Repair"
   - Good: "BRCA1 Phase Separation Controls Homologous Recombination Rate"

2. **Background** — 3–5 sentences, enough to understand the problem
   - Include a "gap" statement: what is unknown

3. **Methods** — 1 figure showing the approach
   - Readers don't read methods at posters; show the design visually

4. **Results** — 2–3 main results with actual numbers
   - "40% reduction" beats "significant reduction"
   - Each result needs a visual

5. **Conclusions** — 3–4 bullet points, action-oriented
   - "These findings suggest..." → "X provides a new target for Y"

**Typography guidelines:**
- Title: ≥ 90pt
- Headers: ≥ 50pt
- Body text: ≥ 28pt
- Figure captions: ≥ 24pt
- Readable from 1 meter away

## Conference-specific sizes

| Conference | Size | Notes |
|---|---|---|
| NeurIPS / ICML / ICLR | Portrait, approx A1 | Check yearly |
| ISMB / ECCB | Portrait, 90cm × 120cm | |
| ACS / ACS-in-person | Portrait, 4ft × 4ft or 4ft × 6ft | |
| ASH / ASCO | Portrait, A0 (84cm × 119cm) | |
| Generic | A0 portrait | Safest default |
