---
name: infographics
description: Create scientific infographics, data visualizations, and summary figures. Produces HTML/SVG graphics, matplotlib figures, and structured visual summaries of scientific findings.
argument-hint: "<data or description> [--type summary|process|comparison|timeline|network] [--format html|svg|png]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /infographics

Generate publication-quality scientific infographics and visual summaries. Covers process diagrams, data summaries, comparison charts, and visual abstracts for scientific papers.

## When to invoke

- "make an infographic for X"
- "visualize these findings"
- "create a summary figure"
- "visual abstract for my paper"
- "process diagram for X workflow"

## Types

### Type 1: Visual Abstract

A one-page summary of a research paper with key findings, methods, and conclusions.

```html
<!-- Template: visual-abstract.html -->
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
  .container { max-width: 900px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .title { font-size: 20px; font-weight: bold; color: #1a237e; margin-bottom: 20px; text-align: center; }
  .grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin: 20px 0; }
  .card { background: #e8eaf6; border-radius: 8px; padding: 16px; }
  .card-title { font-size: 13px; font-weight: bold; color: #3949ab; margin-bottom: 8px; text-transform: uppercase; }
  .metric { font-size: 32px; font-weight: bold; color: #1a237e; }
  .metric-label { font-size: 12px; color: #5c6bc0; }
  .finding { background: #fff3e0; border-left: 4px solid #ff9800; padding: 12px; margin: 8px 0; border-radius: 4px; }
  .conclusion { background: #e8f5e9; border-radius: 8px; padding: 16px; margin-top: 20px; }
</style>
</head>
<body>
<div class="container">
  <div class="title">{{PAPER_TITLE}}</div>
  
  <div style="text-align:center; color:#666; margin-bottom:20px; font-size:13px;">
    {{AUTHORS}} | {{JOURNAL}} {{YEAR}} | DOI: {{DOI}}
  </div>
  
  <div class="grid">
    <div class="card">
      <div class="card-title">Study Design</div>
      <div>{{DESIGN}}</div>
    </div>
    <div class="card">
      <div class="card-title">Sample Size</div>
      <div class="metric">{{N}}</div>
      <div class="metric-label">{{COHORT_DESCRIPTION}}</div>
    </div>
    <div class="card">
      <div class="card-title">Primary Outcome</div>
      <div class="metric">{{EFFECT_SIZE}}</div>
      <div class="metric-label">{{OUTCOME_DESCRIPTION}} (p{{P_VALUE}})</div>
    </div>
  </div>
  
  <div>
    <div style="font-weight:bold; margin-bottom:10px; color:#333;">Key Findings</div>
    {{#FINDINGS}}
    <div class="finding">{{.}}</div>
    {{/FINDINGS}}
  </div>
  
  <div class="conclusion">
    <div style="font-weight:bold; color:#2e7d32; margin-bottom:8px;">Conclusion</div>
    <div>{{CONCLUSION}}</div>
  </div>
</div>
</body>
</html>
```

### Type 2: Process Diagram

Step-by-step workflow or biological pathway diagram.

```python
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch

def process_diagram(steps, title="", colors=None, out="process.png"):
    """Create a horizontal process flow diagram."""
    n = len(steps)
    fig, ax = plt.subplots(figsize=(n * 2.5 + 1, 3))
    
    if colors is None:
        colors = ["#4472C4", "#ED7D31", "#A9D18E", "#FF0000", "#7030A0"][:n]
    
    box_width = 1.8
    box_height = 0.8
    arrow_gap = 0.3
    
    for i, (step, color) in enumerate(zip(steps, colors)):
        x = i * (box_width + arrow_gap + 0.3)
        
        # Draw box
        box = mpatches.FancyBboxPatch(
            (x, 0.5), box_width, box_height,
            boxstyle="round,pad=0.05", facecolor=color, edgecolor="white",
            alpha=0.9, linewidth=2
        )
        ax.add_patch(box)
        
        # Label
        ax.text(x + box_width/2, 0.9, step["label"], ha="center", va="center",
                fontsize=10, color="white", fontweight="bold", wrap=True)
        
        if step.get("sublabel"):
            ax.text(x + box_width/2, 0.65, step["sublabel"], ha="center", va="center",
                    fontsize=8, color="white")
        
        # Arrow to next box
        if i < n - 1:
            ax.annotate("", xy=(x + box_width + arrow_gap + 0.3, 0.9),
                       xytext=(x + box_width, 0.9),
                       arrowprops=dict(arrowstyle="->", color="gray", lw=1.5))
    
    ax.set_xlim(-0.2, n * (box_width + arrow_gap + 0.3))
    ax.set_ylim(0, 1.8)
    ax.set_title(title, fontsize=14, fontweight="bold", pad=15)
    ax.axis("off")
    
    plt.tight_layout()
    fig.savefig(out, dpi=200, bbox_inches="tight")
    plt.close()

# Example usage
steps = [
    {"label": "Sample\nCollection", "sublabel": "n=100"},
    {"label": "DNA\nExtraction"},
    {"label": "Library\nPreparation"},
    {"label": "Sequencing\n(150bp PE)"},
    {"label": "Alignment\n(BWA-MEM)"},
    {"label": "Variant\nCalling"},
]
process_diagram(steps, title="Whole-Genome Sequencing Pipeline")
```

### Type 3: Data Comparison Table

Visual comparison of methods, studies, or conditions.

```python
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import numpy as np

def comparison_heatmap(data, row_labels, col_labels, title="", 
                       colormap="RdYlGn", out="comparison.png"):
    """Create a colored comparison matrix."""
    fig, ax = plt.subplots(figsize=(len(col_labels) * 1.5 + 2, len(row_labels) * 0.6 + 2))
    
    im = ax.imshow(data, cmap=colormap, aspect="auto", vmin=0, vmax=1)
    
    ax.set_xticks(range(len(col_labels)))
    ax.set_yticks(range(len(row_labels)))
    ax.set_xticklabels(col_labels, rotation=45, ha="right")
    ax.set_yticklabels(row_labels)
    
    # Add text values
    for i in range(len(row_labels)):
        for j in range(len(col_labels)):
            val = data[i, j]
            text_color = "white" if val < 0.3 or val > 0.7 else "black"
            ax.text(j, i, f"{val:.2f}", ha="center", va="center", 
                   color=text_color, fontsize=10)
    
    plt.colorbar(im, ax=ax, shrink=0.8)
    ax.set_title(title, fontsize=13, fontweight="bold")
    plt.tight_layout()
    fig.savefig(out, dpi=200, bbox_inches="tight")
    plt.close()
```

### Type 4: Timeline

Research timeline or clinical trial progression.

```python
def timeline(events, title="", out="timeline.png"):
    """Create a horizontal timeline with events."""
    fig, ax = plt.subplots(figsize=(max(10, len(events) * 1.5), 4))
    
    dates = [e["date"] for e in events]
    x_min, x_max = min(dates), max(dates)
    x_range = x_max - x_min
    
    # Draw baseline
    ax.axhline(y=0.5, color="gray", linewidth=2)
    
    for i, event in enumerate(events):
        x = (event["date"] - x_min) / x_range
        color = event.get("color", "#4472C4")
        
        # Dot
        ax.scatter(x, 0.5, s=100, color=color, zorder=5)
        
        # Label (alternating above/below)
        y_label = 0.8 if i % 2 == 0 else 0.2
        ax.annotate(
            event["label"],
            xy=(x, 0.5), xytext=(x, y_label),
            ha="center", fontsize=9,
            arrowprops=dict(arrowstyle="-", color="gray", lw=0.5),
            bbox=dict(boxstyle="round,pad=0.3", facecolor=color, alpha=0.3)
        )
    
    ax.set_xlim(-0.05, 1.05)
    ax.set_ylim(0, 1)
    ax.axis("off")
    ax.set_title(title, fontsize=13, fontweight="bold")
    plt.tight_layout()
    fig.savefig(out, dpi=200, bbox_inches="tight")
    plt.close()
```

## Output format guidance

| Target use | Format | Resolution |
|---|---|---|
| Journal supplementary | PDF | Vector |
| Conference poster | PNG | 300 DPI |
| Twitter/social | PNG | 1200×628 px |
| Presentation slide | SVG | Vector |
| Website | HTML/SVG | Responsive |

## Color palette recommendations

```python
# Nature-style palette (used in Nature journals)
NATURE = ["#E64B35", "#4DBBD5", "#00A087", "#3C5488", "#F39B7F", "#8491B4", "#91D1C2", "#DC0000"]

# Cell-style palette
CELL = ["#1F77B4", "#FF7F0E", "#2CA02C", "#D62728", "#9467BD", "#8C564B", "#E377C2", "#7F7F7F"]

# Colorblind-safe
CB_SAFE = ["#0173B2", "#DE8F05", "#029E73", "#D55E00", "#CC78BC", "#CA9161", "#FBAFE4", "#949494"]
```
