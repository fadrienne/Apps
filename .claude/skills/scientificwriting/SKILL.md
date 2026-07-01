---
name: scientificwriting
description: Write scientific manuscripts, research papers, and technical reports. Use when the user asks to write a paper, draft a report, write up findings, produce a technical document, or turn research findings into a polished draft with sections, equations, and citations. Covers IMRAD structure, citation styles, reporting guidelines, figures, LaTeX formatting, and field-specific terminology.
allowed-tools: Read Write Edit Bash
---

# Scientific Writing

## Agents

When running the full paper-writing workflow, use:
- **`writer`** agent: drafts sections, converts outlines to prose, formats citations
- **`verifier`** agent: checks claims against sources, validates citations, reviews logical flow

Output goes to `papers/`. Run the `/draft` workflow to invoke the full agent pipeline.

---

## Overview

Scientific writing communicates research with precision and clarity. Write manuscripts using IMRAD structure, citations (APA/AMA/Vancouver), figures/tables, and reporting guidelines (CONSORT/STROBE/PRISMA).

**Critical Principle: Always write in full paragraphs with flowing prose. Never use bullet points in the final manuscript.** Use a two-stage process: first create section outlines with key points using research-lookup, then convert those outlines into complete paragraphs.

## When to Use This Skill

- Writing or revising any section of a scientific manuscript (abstract, introduction, methods, results, discussion)
- Structuring a research paper using IMRAD or other standard formats
- Formatting citations in APA, AMA, Vancouver, Chicago, or IEEE styles
- Creating, formatting, or improving figures, tables, and data visualizations
- Applying study-specific reporting guidelines (CONSORT, STROBE, PRISMA)
- Drafting abstracts that meet journal requirements
- Preparing manuscripts for submission to specific journals
- Addressing reviewer comments and revising manuscripts
- Writing research reports, white papers, or technical documents

---

## Core Capabilities

### 1. Manuscript Structure and Organization

**IMRAD Format**: Guide papers through Introduction, Methods, Results, And Discussion:
- **Introduction**: Establish research context, identify gaps, state objectives
- **Methods**: Detail study design, populations, procedures, and analysis approaches
- **Results**: Present findings objectively without interpretation
- **Discussion**: Interpret results, acknowledge limitations, propose future directions

**Alternative Structures**: Review articles, case reports, meta-analyses, theoretical/modeling papers, methods papers and protocols.

### 2. Section-Specific Writing Guidance

**Abstract**: Concise standalone summaries (100–250 words) capturing purpose, methods, results, and conclusions. Support both structured and unstructured formats. **Never use labeled sections (Background:, Methods:, etc.) unless the journal explicitly requires it.**

**Introduction**: Establish the research problem's importance → review relevant literature → identify knowledge gaps → state clear research questions → explain novelty and significance.

**Methods**: Ensure reproducibility through detailed participant/sample descriptions, clear procedural documentation, statistical methods with justification, equipment/materials specifications, and ethical approval statements.

**Results**: Present findings with logical flow from primary to secondary outcomes, integration with figures and tables, statistical significance with effect sizes, and objective reporting without interpretation.

**Discussion**: Relate results to research questions, compare with existing literature, acknowledge limitations honestly, propose mechanistic explanations, suggest practical implications and future research.

### 3. Citation and Reference Management

**Major Citation Styles:**
- **AMA**: Numbered superscript citations — common in medicine
- **Vancouver**: Numbered citations in square brackets — biomedical standard
- **APA**: Author-date in-text citations — common in social sciences
- **Chicago**: Notes-bibliography or author-date — humanities and sciences
- **IEEE**: Numbered square brackets — engineering and computer science

**Best Practices:**
- Cite primary sources when possible
- Include recent literature (last 5–10 years for active fields)
- Balance citation distribution across introduction and discussion
- Verify all citations against original sources

### 4. Figures and Tables

**When to Use Tables vs. Figures:**
- **Tables**: Precise numerical data, complex datasets, multiple variables requiring exact values
- **Figures**: Trends, patterns, relationships, comparisons best understood visually

**Design Principles:**
- Make each table/figure self-explanatory with complete captions
- Use consistent formatting and terminology across all display items
- Label all axes, columns, and rows with units
- Include sample sizes (n) and statistical annotations
- Avoid duplicating information between text, tables, and figures

### 5. Visual Enhancement

Every scientific paper should include a graphical abstract plus 1–2 additional figures.

**Graphical Abstract (Recommended):** A visual summary of the paper's key message:
- Appears before or immediately after the text abstract
- Landscape orientation (typically 1200×600px)
- Shows workflow from input → methods → key findings → conclusions

**Minimum Figure Requirements by Document Type:**

| Document Type | Minimum | Recommended |
|---|---|---|
| Research Papers | 5 | 6–8 |
| Literature Reviews | 4 | 5–7 |
| Posters | 6 | 8–10 |
| Grants | 4 | 5–7 |

### 6. Reporting Guidelines by Study Type

- **CONSORT**: Randomized controlled trials
- **STROBE**: Observational studies (cohort, case-control, cross-sectional)
- **PRISMA**: Systematic reviews and meta-analyses
- **STARD**: Diagnostic accuracy studies
- **TRIPOD**: Prediction model studies
- **ARRIVE**: Animal research
- **CARE**: Case reports
- **SQUIRE**: Quality improvement studies

### 7. Writing Process: Outline to Full Paragraphs

**Stage 1: Create section outlines**
1. Use literature search skills to gather relevant papers and data
2. Build a structured outline with bullet points marking main arguments, key studies to cite, data points, and logical flow
3. These bullets are scaffolding — not the final manuscript

**Stage 2: Convert outlines to prose**
1. Transform bullet points into complete sentences with subjects, verbs, and objects
2. Add transitions between sentences and ideas (however, moreover, in contrast, subsequently)
3. Integrate citations naturally within sentences, not as lists
4. Expand with context and explanation
5. Ensure logical flow from one sentence to the next
6. Vary sentence structure to maintain reader engagement

**Lists are acceptable ONLY in:**
- Methods: inclusion/exclusion criteria, materials lists
- Supplementary materials: extended protocols, equipment lists

**Never use bullet lists in:** Abstract, Introduction, Results, Discussion, Conclusions.

### 8. Writing Principles

**Clarity**: Precise, unambiguous language. Define technical terms and abbreviations at first use. Active voice when appropriate.

**Conciseness**: Eliminate redundant words. Favor shorter sentences (15–20 words average). Respect word limits strictly.

**Accuracy**: Report exact values with appropriate precision. Consistent terminology throughout. Distinguish observations from interpretations.

**Objectivity**: Present results without bias. Avoid overstating findings. Acknowledge conflicting evidence. Maintain professional, neutral tone.

### 9. Professional Report Formatting (Non-Journal Documents)

For research reports, white papers, and technical documents (not journal manuscripts), use the `scientific_report.sty` LaTeX style package from `scientific-agent-skills/skills/scientific-writing/assets/`.

**Box environments:**
```latex
\begin{keyfindings}[Title]     % blue — major discoveries
\begin{methodology}[Design]    % green — methods highlights
\begin{recommendations}[...]   % purple — action items
\begin{limitations}[...]       % orange — caveats
```

**Scientific notation commands:**

| Command | Output |
|---|---|
| `\pvalue{0.023}` | *p* = 0.023 |
| `\CI{0.45}{0.72}` | 95% CI [0.45, 0.72] |
| `\effectsize{d}{0.75}` | d = 0.75 |
| `\meansd{42.5}{8.3}` | 42.5 ± 8.3 |

Compile with XeLaTeX or LuaLaTeX for proper Helvetica font rendering.

### 10. Field-Specific Terminology

Adapt language to match the discipline's conventions:

- **Biomedical/Clinical**: Precise anatomical and clinical terminology; ICD/DSM/SNOMED nomenclature; generic drug names first; "patients" for clinical studies, "participants" for community-based research
- **Molecular Biology/Genetics**: Italics for gene symbols (*TP53*), regular font for proteins (p53); species-specific gene nomenclature
- **Chemistry/Pharma**: IUPAC nomenclature; SMILES/InChI for databases; report concentrations with appropriate units
- **Ecology**: Binomial nomenclature (italicized); standardized habitat classifications; field-standard sampling terminology
- **Physics/Engineering**: SI units; standard notation for physical quantities; specify equipment with model numbers
- **Neuroscience**: Standardized brain region nomenclature; stereotaxic coordinates; appropriate recording technique terminology
- **Social/Behavioral Sciences**: Person-first language; APA bias-reduction guidelines; "participants" not "subjects"

### 11. Common Pitfalls

**Top Rejection Reasons:**
1. Inappropriate or insufficiently described statistics
2. Over-interpretation of results or unsupported conclusions
3. Poorly described methods affecting reproducibility
4. Small, biased, or inappropriate samples
5. Poor writing quality or difficult-to-follow text
6. Inadequate literature review or context
7. Unclear or poorly designed figures and tables
8. Failure to follow reporting guidelines

---

## Full Manuscript Workflow

**Stage 1: Planning**
1. Identify target journal and review author guidelines
2. Determine applicable reporting guideline (CONSORT, STROBE, etc.)
3. Outline manuscript structure (usually IMRAD)
4. Plan figures and tables as the backbone

**Stage 2: Drafting**
1. Start with figures and tables (the core data story)
2. For each section: outline with bullet points → convert to full paragraphs
3. Order: Methods → Results → Discussion → Introduction → Abstract → Title

**Stage 3: Revision**
1. Check logical flow throughout
2. Verify consistency in terminology and notation
3. Ensure figures/tables are self-explanatory
4. Confirm adherence to reporting guidelines
5. Verify all citations are accurate and properly formatted

**Stage 4: Final Preparation**
1. Format according to journal requirements
2. Prepare supplementary materials
3. Write cover letter highlighting significance
4. Complete submission checklists

---

## Integration with Other Skills

- **`literature-review`** / **`paper-lookup`**: Source papers for citations and context
- **`statistical-analysis`**: Determine appropriate statistical presentations
- **`scientific-visualization`** / **`matplotlib`**: Generate publication-quality figures
- **`peer-review`**: Evaluate drafts before submission
- **`latex-posters`**: For conference poster output
- **`citation-management`**: Validate and format references

**Reference files** (in `scientific-agent-skills/skills/scientific-writing/references/`):
- `imrad_structure.md` — detailed IMRAD guidance
- `citation_styles.md` — complete style guides
- `figures_tables.md` — visualization best practices
- `reporting_guidelines.md` — study-specific checklists
- `writing_principles.md` — core communication principles
- `professional_report_formatting.md` — LaTeX report styling

**Assets** (in `scientific-agent-skills/skills/scientific-writing/assets/`):
- `scientific_report.sty` — professional LaTeX style package
- `scientific_report_template.tex` — complete template
- `REPORT_FORMATTING_GUIDE.md` — quick reference
