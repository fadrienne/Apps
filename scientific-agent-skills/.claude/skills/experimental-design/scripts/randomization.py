#!/usr/bin/env python3
"""
Block randomization and treatment assignment utilities.

Usage:
    python randomization.py --n 30 --treatments "Control,Drug_A,Drug_B" --block-size 6
    python randomization.py --n 24 --treatments "Control,Treatment" --block-size 4 --seed 42
"""

import argparse
import random
import math
from itertools import permutations


def block_randomize(n: int, treatments: list[str], block_size: int, seed: int = None) -> list[dict]:
    """
    Generate a block-randomized treatment assignment.

    Block randomization ensures roughly equal numbers of each treatment
    within each block, preventing imbalance if the trial ends early.

    Args:
        n: Total number of subjects
        treatments: List of treatment labels
        block_size: Size of each block (must be divisible by len(treatments))
        seed: Random seed for reproducibility

    Returns:
        List of dicts with subject_id, block, position, treatment

    Raises:
        ValueError: If block_size is not divisible by number of treatments
    """
    k = len(treatments)
    if block_size % k != 0:
        raise ValueError(f"block_size ({block_size}) must be divisible by number of treatments ({k})")

    reps_per_block = block_size // k
    rng = random.Random(seed)

    # Build block template
    template = treatments * reps_per_block

    assignments = []
    subject_id = 1
    block_num = 1

    while subject_id <= n:
        block = template.copy()
        rng.shuffle(block)

        for pos, treatment in enumerate(block, 1):
            if subject_id > n:
                break
            assignments.append({
                "subject_id": subject_id,
                "block": block_num,
                "block_position": pos,
                "treatment": treatment,
            })
            subject_id += 1

        block_num += 1

    return assignments


def simple_randomize(n: int, treatments: list[str], seed: int = None) -> list[dict]:
    """
    Simple (unrestricted) randomization. May produce imbalanced groups.
    Only use for n > 100 where imbalance is unlikely.
    """
    rng = random.Random(seed)
    return [
        {"subject_id": i + 1, "treatment": rng.choice(treatments)}
        for i in range(n)
    ]


def stratified_block_randomize(
    subjects: list[dict],
    strata_keys: list[str],
    treatments: list[str],
    block_size: int,
    seed: int = None,
) -> list[dict]:
    """
    Stratified block randomization — separate randomization within each stratum.

    Args:
        subjects: List of dicts with subject metadata (must include strata_keys)
        strata_keys: Keys to stratify on (e.g. ["sex", "age_group"])
        treatments: Treatment labels
        block_size: Block size (divisible by len(treatments))
        seed: Random seed

    Returns:
        subjects list with "treatment" key added to each dict
    """
    from collections import defaultdict

    strata = defaultdict(list)
    for s in subjects:
        key = tuple(s[k] for k in strata_keys)
        strata[key].append(s)

    rng = random.Random(seed)
    result = []

    for stratum_key, stratum_subjects in sorted(strata.items()):
        n = len(stratum_subjects)
        stratum_seed = rng.randint(0, 2**31)
        assignments = block_randomize(n, treatments, block_size, seed=stratum_seed)

        for subj, assign in zip(stratum_subjects, assignments):
            result.append({**subj, "treatment": assign["treatment"], "stratum": stratum_key})

    return result


def allocation_concealment_list(assignments: list[dict], output_file: str = None) -> str:
    """
    Format assignments for sealed envelope / allocation concealment.
    Each line contains only the treatment (for sequentially numbered envelopes).
    """
    lines = [f"{a['subject_id']:04d}  {a['treatment']}" for a in assignments]
    output = "\n".join(lines)

    if output_file:
        with open(output_file, "w") as f:
            f.write("# Allocation list — OPEN ONLY AT ENROLLMENT\n")
            f.write("# SubjectID  Treatment\n")
            f.write(output + "\n")
        print(f"Allocation list written to {output_file}")

    return output


def summarize_assignments(assignments: list[dict]) -> None:
    """Print a summary table of treatment counts by block."""
    from collections import Counter

    total = Counter(a["treatment"] for a in assignments)
    print("\n=== Treatment Assignment Summary ===")
    print(f"Total subjects: {len(assignments)}")
    for treatment, count in sorted(total.items()):
        pct = 100 * count / len(assignments)
        print(f"  {treatment}: {count} ({pct:.1f}%)")

    # Per-block summary
    blocks = {}
    for a in assignments:
        b = a.get("block")
        if b is not None:
            blocks.setdefault(b, []).append(a["treatment"])

    if blocks:
        print(f"\nBlocks: {len(blocks)}")
        block_sizes = [len(v) for v in blocks.values()]
        print(f"Block sizes: min={min(block_sizes)}, max={max(block_sizes)}")


def main():
    parser = argparse.ArgumentParser(description="Block randomization for clinical/lab trials")
    parser.add_argument("--n", type=int, required=True, help="Number of subjects")
    parser.add_argument("--treatments", type=str, required=True,
                        help="Comma-separated treatment labels")
    parser.add_argument("--block-size", type=int, default=None,
                        help="Block size (default: 2 × n_treatments)")
    parser.add_argument("--seed", type=int, default=None, help="Random seed")
    parser.add_argument("--output", type=str, default=None,
                        help="Output file for allocation list")
    args = parser.parse_args()

    treatments = [t.strip() for t in args.treatments.split(",")]
    block_size = args.block_size or (2 * len(treatments))

    assignments = block_randomize(args.n, treatments, block_size, seed=args.seed)
    summarize_assignments(assignments)

    if args.output:
        allocation_concealment_list(assignments, args.output)
    else:
        print("\n=== Allocation List ===")
        print(allocation_concealment_list(assignments))


if __name__ == "__main__":
    main()
