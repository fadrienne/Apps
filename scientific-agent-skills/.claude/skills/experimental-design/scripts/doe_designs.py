#!/usr/bin/env python3
"""
Design of Experiments (DoE) — generate standard experimental designs.

Covers:
  - Completely Randomized Design (CRD)
  - Randomized Complete Block Design (RCBD)
  - Full Factorial Design
  - Latin Square Design
  - Response Surface: Central Composite Design (CCD)

Usage:
    python doe_designs.py --design factorial --factors "temperature:3,concentration:4"
    python doe_designs.py --design ccd --k 3
    python doe_designs.py --design latin-square --k 4
"""

import argparse
import itertools
import random
from math import sqrt, ceil


def crd(treatments: list, n_replicates: int, seed: int = None) -> list[dict]:
    """
    Completely Randomized Design.

    All experimental units are randomly assigned to treatments.
    No blocking. Assumes homogeneous experimental units.

    Args:
        treatments: List of treatment labels or values
        n_replicates: Number of replicates per treatment
        seed: Random seed

    Returns:
        List of dicts with run_order, treatment
    """
    rng = random.Random(seed)
    runs = treatments * n_replicates
    rng.shuffle(runs)
    return [{"run_order": i + 1, "treatment": t} for i, t in enumerate(runs)]


def rcbd(treatments: list, blocks: list, seed: int = None) -> list[dict]:
    """
    Randomized Complete Block Design.

    Each block contains one observation per treatment.
    Blocks group experimental units with similar nuisance variation
    (e.g. batches, days, litters).

    Args:
        treatments: List of treatment labels
        blocks: List of block labels
        seed: Random seed

    Returns:
        List of dicts with block, run_within_block, treatment
    """
    rng = random.Random(seed)
    design = []
    run = 1
    for block in blocks:
        block_treatments = treatments.copy()
        rng.shuffle(block_treatments)
        for pos, treatment in enumerate(block_treatments, 1):
            design.append({
                "run_order": run,
                "block": block,
                "position_in_block": pos,
                "treatment": treatment,
            })
            run += 1
    return design


def full_factorial(factors: dict, seed: int = None) -> list[dict]:
    """
    Full Factorial Design — all combinations of factor levels.

    Args:
        factors: Dict mapping factor name → list of levels
                 e.g. {"temperature": [20, 37], "pH": [6.5, 7.0, 7.5]}
        seed: Random seed for run order randomization

    Returns:
        List of dicts with run_order and one key per factor
    """
    names = list(factors.keys())
    levels = list(factors.values())

    runs = [dict(zip(names, combo)) for combo in itertools.product(*levels)]

    rng = random.Random(seed)
    rng.shuffle(runs)

    for i, run in enumerate(runs):
        run["run_order"] = i + 1

    return runs


def latin_square(k: int, seed: int = None) -> list[list[int]]:
    """
    Generate a k×k Latin Square.

    In a Latin Square design:
      - Rows = one blocking factor (e.g. day)
      - Cols = another blocking factor (e.g. operator)
      - Values = treatment (1..k)

    Each treatment appears exactly once in each row and column.

    Args:
        k: Number of treatments (and rows/cols)
        seed: Random seed for randomization

    Returns:
        k×k list of lists (0-indexed treatments)
    """
    # Standard cyclic Latin Square
    square = [[(i + j) % k for j in range(k)] for i in range(k)]

    rng = random.Random(seed)

    # Randomly permute rows and columns (standard randomization)
    row_order = list(range(k))
    col_order = list(range(k))
    treatment_map = list(range(k))

    rng.shuffle(row_order[1:])    # keep first row fixed per convention
    rng.shuffle(col_order)
    rng.shuffle(treatment_map)

    randomized = [
        [treatment_map[square[row_order[i]][col_order[j]]] for j in range(k)]
        for i in range(k)
    ]
    return randomized


def central_composite_design(k: int, alpha: float = None, n_center: int = 4) -> list[dict]:
    """
    Central Composite Design (CCD) for response surface methodology.

    Combines:
      - 2^k factorial points (±1)
      - Axial / star points (±α, 0, ..., 0)
      - Center points (0, ..., 0)

    Default alpha = k^0.5 (rotatable CCD).

    Args:
        k: Number of factors
        alpha: Distance of axial points (default: sqrt(k) for rotatability)
        n_center: Number of center point replicates

    Returns:
        List of dicts with run_order and x1, x2, ..., xk
    """
    if alpha is None:
        alpha = sqrt(k)

    factor_names = [f"x{i+1}" for i in range(k)]

    # Factorial points
    factorial_pts = [
        dict(zip(factor_names, combo))
        for combo in itertools.product([-1, 1], repeat=k)
    ]

    # Axial points
    axial_pts = []
    for i in range(k):
        for sign in (-1, 1):
            pt = {f: 0.0 for f in factor_names}
            pt[f"x{i+1}"] = sign * alpha
            axial_pts.append(pt)

    # Center points
    center_pts = [{f: 0.0 for f in factor_names} for _ in range(n_center)]

    all_pts = factorial_pts + axial_pts + center_pts

    random.shuffle(all_pts)
    for i, pt in enumerate(all_pts):
        pt["run_order"] = i + 1
        pt["point_type"] = (
            "factorial" if all(abs(pt[f]) == 1 for f in factor_names)
            else "axial" if any(abs(pt[f]) == alpha for f in factor_names)
            else "center"
        )

    return all_pts


def print_design(design: list[dict], title: str = "Design") -> None:
    """Pretty-print a design table."""
    if not design:
        return

    print(f"\n=== {title} ===")
    print(f"Runs: {len(design)}")

    # Header
    keys = list(design[0].keys())
    col_widths = {k: max(len(k), max(len(str(row.get(k, ""))) for row in design)) for k in keys}
    header = "  ".join(k.ljust(col_widths[k]) for k in keys)
    print(header)
    print("-" * len(header))

    for row in sorted(design, key=lambda r: r.get("run_order", 0)):
        print("  ".join(str(row.get(k, "")).ljust(col_widths[k]) for k in keys))


def main():
    parser = argparse.ArgumentParser(description="Generate experimental designs")
    parser.add_argument("--design", choices=["crd", "rcbd", "factorial", "latin-square", "ccd"],
                        required=True)
    parser.add_argument("--treatments", type=str, default="A,B,C",
                        help="Comma-separated treatment labels (CRD/RCBD/Latin Square)")
    parser.add_argument("--replicates", type=int, default=3, help="Replicates per treatment (CRD)")
    parser.add_argument("--blocks", type=str, default="Block1,Block2,Block3",
                        help="Comma-separated block names (RCBD)")
    parser.add_argument("--factors", type=str, default=None,
                        help="Factorial factors: 'A:2,3;B:10,20,30' or 'A:3,B:3'")
    parser.add_argument("--k", type=int, default=3,
                        help="Number of factors (Latin Square / CCD)")
    parser.add_argument("--n-center", type=int, default=4,
                        help="Number of center points (CCD)")
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()

    if args.design == "crd":
        treatments = args.treatments.split(",")
        design = crd(treatments, args.replicates, seed=args.seed)
        print_design(design, f"CRD: {len(treatments)} treatments × {args.replicates} replicates")

    elif args.design == "rcbd":
        treatments = args.treatments.split(",")
        blocks = args.blocks.split(",")
        design = rcbd(treatments, blocks, seed=args.seed)
        print_design(design, f"RCBD: {len(treatments)} treatments × {len(blocks)} blocks")

    elif args.design == "factorial":
        if args.factors is None:
            print("Error: --factors required for factorial design")
            print("Example: --factors 'Temp:20,37;pH:6.5,7.0,7.5'")
            return
        factors = {}
        for fspec in args.factors.split(";"):
            name, levels_str = fspec.split(":")
            try:
                levels = [float(l) for l in levels_str.split(",")]
            except ValueError:
                levels = levels_str.split(",")
            factors[name.strip()] = levels

        design = full_factorial(factors, seed=args.seed)
        n_runs = 1
        for v in factors.values():
            n_runs *= len(v)
        print_design(design, f"Full Factorial: {len(factors)} factors, {n_runs} runs")

    elif args.design == "latin-square":
        k = args.k
        square = latin_square(k, seed=args.seed)
        print(f"\n=== Latin Square ({k}×{k}) ===")
        print("Rows = blocking factor 1, Cols = blocking factor 2")
        print("Values = treatment index (0-based)\n")
        for row in square:
            print("  " + "  ".join(str(v) for v in row))

    elif args.design == "ccd":
        design = central_composite_design(args.k, n_center=args.n_center)
        print_design(design, f"CCD: k={args.k}, alpha={sqrt(args.k):.3f}, {args.n_center} center pts")
        print(f"\nTotal runs: {len(design)}")
        from collections import Counter
        type_counts = Counter(d["point_type"] for d in design)
        for pt_type, count in type_counts.items():
            print(f"  {pt_type}: {count}")


if __name__ == "__main__":
    main()
