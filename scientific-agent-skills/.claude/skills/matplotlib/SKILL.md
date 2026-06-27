---
name: matplotlib
description: Create publication-quality scientific figures using matplotlib. Covers line plots, scatter plots, histograms, heatmaps, box plots, and multi-panel figures with proper formatting for journal submission.
argument-hint: "<data file or description> [--type line|scatter|bar|hist|heatmap|boxplot] [--style paper|poster|talk]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /matplotlib

Generate publication-quality scientific figures. Clean design, proper font sizes, accessible color palettes, and journal-ready formatting.

## When to invoke

- "plot this data"
- "make a figure"
- "create a scatter plot / bar chart / heatmap"
- "publication figure"

## Setup

```python
import matplotlib.pyplot as plt
import matplotlib as mpl
import numpy as np

# Publication style
plt.rcParams.update({
    "font.family": "sans-serif",
    "font.sans-serif": ["Arial", "Helvetica"],
    "font.size": 11,
    "axes.labelsize": 12,
    "axes.titlesize": 13,
    "xtick.labelsize": 10,
    "ytick.labelsize": 10,
    "legend.fontsize": 10,
    "figure.dpi": 150,
    "savefig.dpi": 300,
    "savefig.bbox": "tight",
    "axes.spines.top": False,
    "axes.spines.right": False,
    "xtick.direction": "out",
    "ytick.direction": "out",
})

# Color palettes (colorblind-friendly)
PALETTE_4 = ["#0173B2", "#DE8F05", "#029E73", "#D55E00"]   # Blue, orange, green, red
PALETTE_8 = ["#0173B2", "#DE8F05", "#029E73", "#D55E00", "#CC78BC", "#CA9161", "#FBAFE4", "#949494"]
NATURE_COLORS = ["#E64B35", "#4DBBD5", "#00A087", "#3C5488", "#F39B7F", "#8491B4"]
```

## Figure types

### Line plot (time series, dose-response)

```python
def line_plot(x, y_data, labels=None, xlabel="", ylabel="", title="", 
              error=None, log_x=False, log_y=False, out="figure.pdf"):
    fig, ax = plt.subplots(figsize=(6, 4.5))
    
    if not isinstance(y_data, list):
        y_data = [y_data]
    if labels is None:
        labels = [f"Group {i+1}" for i in range(len(y_data))]
    
    for i, (y, label) in enumerate(zip(y_data, labels)):
        color = PALETTE_4[i % len(PALETTE_4)]
        ax.plot(x, y, color=color, linewidth=2, label=label, marker="o", markersize=4)
        if error is not None:
            ax.fill_between(x, y - error[i], y + error[i], alpha=0.2, color=color)
    
    ax.set_xlabel(xlabel); ax.set_ylabel(ylabel); ax.set_title(title)
    if log_x: ax.set_xscale("log")
    if log_y: ax.set_yscale("log")
    if len(labels) > 1: ax.legend(frameon=False)
    
    plt.tight_layout()
    fig.savefig(out)
    plt.close()
```

### Scatter plot (correlation, clustering)

```python
def scatter_plot(x, y, color_by=None, size_by=None, xlabel="", ylabel="", 
                 title="", regression=False, out="scatter.pdf"):
    fig, ax = plt.subplots(figsize=(5.5, 5))
    
    colors = color_by if color_by is not None else PALETTE_4[0]
    sizes = size_by * 50 if size_by is not None else 40
    
    sc = ax.scatter(x, y, c=colors, s=sizes, alpha=0.7, edgecolors="none")
    
    if color_by is not None and hasattr(color_by, "dtype") and color_by.dtype == float:
        plt.colorbar(sc, ax=ax, shrink=0.8)
    
    if regression:
        from scipy import stats
        slope, intercept, r, p, _ = stats.linregress(x, y)
        x_line = np.linspace(min(x), max(x), 100)
        ax.plot(x_line, slope * x_line + intercept, "k--", linewidth=1.5, alpha=0.8)
        ax.text(0.05, 0.95, f"r = {r:.3f}, p = {p:.2e}", transform=ax.transAxes,
                verticalalignment="top", fontsize=10)
    
    ax.set_xlabel(xlabel); ax.set_ylabel(ylabel); ax.set_title(title)
    plt.tight_layout(); fig.savefig(out); plt.close()
```

### Bar plot (group comparisons)

```python
def bar_plot(categories, values, error=None, groups=None, xlabel="", ylabel="", 
             title="", show_points=True, pvalue_pairs=None, out="bar.pdf"):
    fig, ax = plt.subplots(figsize=(max(4, len(categories) * 0.8), 5))
    
    x = np.arange(len(categories))
    colors = [PALETTE_4[i % len(PALETTE_4)] for i in range(len(categories))]
    
    bars = ax.bar(x, values, color=colors, width=0.6, 
                  yerr=error if error is not None else None,
                  capsize=4, error_kw={"linewidth": 1.5})
    
    # Overlay individual data points
    if show_points and groups is not None:
        for i, (cat, pts) in enumerate(zip(categories, groups)):
            jitter = np.random.uniform(-0.15, 0.15, len(pts))
            ax.scatter(x[i] + jitter, pts, color="black", s=20, zorder=5, alpha=0.7)
    
    ax.set_xticks(x); ax.set_xticklabels(categories, rotation=30, ha="right")
    ax.set_xlabel(xlabel); ax.set_ylabel(ylabel); ax.set_title(title)
    ax.set_ylim(bottom=0)
    
    plt.tight_layout(); fig.savefig(out); plt.close()
```

### Heatmap

```python
def heatmap(data, row_labels=None, col_labels=None, title="", 
            colormap="RdBu_r", center=0, cluster=True, out="heatmap.pdf"):
    import seaborn as sns
    
    fig_height = max(6, len(data) * 0.3)
    fig_width = max(6, len(data.columns) * 0.5) if hasattr(data, "columns") else 8
    
    if cluster:
        g = sns.clustermap(
            data, cmap=colormap, center=center,
            figsize=(fig_width, fig_height),
            row_labels=row_labels, col_labels=col_labels,
            yticklabels=row_labels if row_labels else True,
            xticklabels=col_labels if col_labels else True,
        )
        g.savefig(out, dpi=300, bbox_inches="tight")
    else:
        fig, ax = plt.subplots(figsize=(fig_width, fig_height))
        im = ax.imshow(data if not hasattr(data, "values") else data.values, 
                       cmap=colormap, aspect="auto", vmin=-abs(center)*2, vmax=abs(center)*2)
        plt.colorbar(im, ax=ax, shrink=0.8)
        ax.set_title(title)
        plt.tight_layout(); fig.savefig(out); plt.close()
```

### Box / violin plot

```python
def box_violin_plot(data_groups, labels, ylabel="", title="", 
                    show_violin=True, show_points=True, out="boxplot.pdf"):
    fig, ax = plt.subplots(figsize=(max(4, len(labels) * 0.9), 5))
    
    x = np.arange(len(labels))
    
    if show_violin:
        parts = ax.violinplot(data_groups, positions=x, showmedians=False, showextrema=False)
        for i, pc in enumerate(parts["bodies"]):
            pc.set_facecolor(PALETTE_4[i % len(PALETTE_4)])
            pc.set_alpha(0.4)
    
    ax.boxplot(data_groups, positions=x, widths=0.3, showfliers=False,
               medianprops=dict(color="black", linewidth=2))
    
    if show_points:
        for i, pts in enumerate(data_groups):
            jitter = np.random.uniform(-0.15, 0.15, len(pts))
            ax.scatter(x[i] + jitter, pts, color=PALETTE_4[i % len(PALETTE_4)], 
                       s=20, zorder=5, alpha=0.7, edgecolors="none")
    
    ax.set_xticks(x); ax.set_xticklabels(labels)
    ax.set_ylabel(ylabel); ax.set_title(title)
    plt.tight_layout(); fig.savefig(out); plt.close()
```

### Multi-panel figure

```python
def multipanel_figure(panel_specs, figsize=(12, 8), out="figure.pdf"):
    """Create a multi-panel publication figure.
    
    panel_specs: list of dicts with keys:
        - "type": "line" | "scatter" | "bar" | "image"
        - "data": data for this panel
        - "title": panel title (e.g., "A", "B", "C")
        - ...other kwargs for the panel type
    """
    n_panels = len(panel_specs)
    n_cols = min(3, n_panels)
    n_rows = (n_panels + n_cols - 1) // n_cols
    
    fig, axes = plt.subplots(n_rows, n_cols, figsize=figsize)
    axes = axes.flatten() if n_panels > 1 else [axes]
    
    for i, (ax, spec) in enumerate(zip(axes, panel_specs)):
        # Add panel label (A, B, C, ...)
        ax.text(-0.1, 1.05, chr(65 + i), transform=ax.transAxes,
                fontsize=14, fontweight="bold", va="top")
        # Draw content based on spec["type"]
        # ...
    
    # Hide unused panels
    for ax in axes[n_panels:]:
        ax.set_visible(False)
    
    plt.tight_layout(); fig.savefig(out, dpi=300); plt.close()
```

## Statistical annotation

```python
from scipy import stats

def add_significance_bar(ax, x1, x2, y, data1, data2, h=0.05):
    """Add significance bar between two groups."""
    t, p = stats.ttest_ind(data1, data2)
    
    if p < 0.001:   star = "***"
    elif p < 0.01:  star = "**"
    elif p < 0.05:  star = "*"
    else:           star = "ns"
    
    y_max = max(max(data1), max(data2))
    y_bar = y_max * (1 + h)
    
    ax.plot([x1, x1, x2, x2], [y_bar, y_bar + h * y_max/5, y_bar + h * y_max/5, y_bar],
            color="black", linewidth=1)
    ax.text((x1 + x2) / 2, y_bar + h * y_max/5, star, ha="center", fontsize=12)
```

## Output formats

- PDF (default) — vector, best for journals
- SVG — vector, editable in Illustrator/Inkscape
- PNG at 300 DPI — for presentations
- TIFF at 600 DPI — for some journal submissions

```python
# Save in multiple formats
for ext in ["pdf", "svg", "png"]:
    fig.savefig(f"figure.{ext}", dpi=300 if ext == "png" else None, bbox_inches="tight")
```
