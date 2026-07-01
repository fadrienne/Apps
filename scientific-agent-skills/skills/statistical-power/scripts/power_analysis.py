"""
Statistical power analysis scripts.
Run directly: python power_analysis.py --help
"""

import argparse
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats


# ── Closed-form calculations ────────────────────────────────────────────────

def n_ttest_ind(d, power=0.80, alpha=0.05, two_tailed=True):
    """Required n per group for an independent-samples t-test."""
    from statsmodels.stats.power import TTestIndPower
    alternative = 'two-sided' if two_tailed else 'larger'
    n = TTestIndPower().solve_power(effect_size=d, power=power, alpha=alpha,
                                    alternative=alternative)
    return int(np.ceil(n))


def n_ttest_paired(d, power=0.80, alpha=0.05, two_tailed=True):
    """Required n pairs for a paired t-test."""
    from statsmodels.stats.power import TTestPower
    alternative = 'two-sided' if two_tailed else 'larger'
    n = TTestPower().solve_power(effect_size=d, power=power, alpha=alpha,
                                  alternative=alternative)
    return int(np.ceil(n))


def n_anova(f, k, power=0.80, alpha=0.05):
    """Required n per group for one-way ANOVA with k groups and Cohen's f."""
    from statsmodels.stats.power import FtestAnovaPower
    n = FtestAnovaPower().solve_power(effect_size=f, power=power, alpha=alpha,
                                       k_groups=k)
    return int(np.ceil(n))


def n_proportions(p1, p2, power=0.80, alpha=0.05):
    """Required n per group to detect difference between two proportions."""
    from statsmodels.stats.proportion import proportion_effectsize
    from statsmodels.stats.power import NormalIndPower
    h = proportion_effectsize(p1, p2)
    n = NormalIndPower().solve_power(effect_size=abs(h), power=power, alpha=alpha)
    return int(np.ceil(n)), round(h, 4)


def n_correlation(r, power=0.80, alpha=0.05):
    """Required n to detect a Pearson correlation r."""
    import pingouin as pg
    result = pg.power_corr(r=r, n=None, power=power, alpha=alpha,
                            alternative='two-sided')
    return int(np.ceil(result['n']))


def design_effect(icc, n_per_cluster):
    """DEFF = 1 + (n-1)*ICC. Multiply simple-design N by this for clustered data."""
    return 1 + (n_per_cluster - 1) * icc


# ── Simulation ───────────────────────────────────────────────────────────────

def simulate_power_clustered(n_clusters, n_per_cluster, icc, delta,
                              sigma_total=1.0, alpha=0.05, n_sim=2000, seed=42):
    """
    Monte Carlo power for a two-arm cluster-randomized trial (t-test on cluster means).

    Parameters
    ----------
    n_clusters     : int   — clusters per arm
    n_per_cluster  : int   — subjects per cluster
    icc            : float — intraclass correlation coefficient
    delta          : float — true mean difference (arm1 - arm0)
    sigma_total    : float — total SD of outcome
    alpha          : float — significance level
    n_sim          : int   — number of simulation replications
    seed           : int   — random seed for reproducibility

    Returns
    -------
    float — estimated power
    """
    rng = np.random.default_rng(seed)
    sigma_b = np.sqrt(icc * sigma_total**2)
    sigma_w = np.sqrt((1 - icc) * sigma_total**2)
    reject = 0

    for _ in range(n_sim):
        arm0 = np.concatenate([
            rng.normal(rng.normal(0, sigma_b), sigma_w, n_per_cluster)
            for _ in range(n_clusters)
        ])
        arm1 = np.concatenate([
            rng.normal(rng.normal(delta, sigma_b), sigma_w, n_per_cluster)
            for _ in range(n_clusters)
        ])
        _, p = stats.ttest_ind(arm0, arm1)
        reject += p < alpha

    return reject / n_sim


# ── Power curves ─────────────────────────────────────────────────────────────

def plot_power_curve(test='ttest_ind', effect_sizes=None, n_range=(10, 200),
                     alpha=0.05, output='power_curve.png'):
    """
    Plot power vs. N for multiple effect sizes.

    Parameters
    ----------
    test          : str  — 'ttest_ind', 'ttest_paired', 'anova_k3'
    effect_sizes  : list — effect size values to plot
    n_range       : tuple — (min_n, max_n)
    alpha         : float
    output        : str  — output file path
    """
    from statsmodels.stats.power import TTestIndPower, TTestPower, FtestAnovaPower

    if effect_sizes is None:
        effect_sizes = [0.2, 0.5, 0.8]

    ns = np.arange(n_range[0], n_range[1] + 1, 5)
    fig, ax = plt.subplots(figsize=(8, 5))

    for es in effect_sizes:
        if test == 'ttest_ind':
            powers = [TTestIndPower().solve_power(effect_size=es, nobs1=n, alpha=alpha)
                      for n in ns]
            xlabel = 'N per group'
        elif test == 'ttest_paired':
            powers = [TTestPower().solve_power(effect_size=es, nobs=n, alpha=alpha)
                      for n in ns]
            xlabel = 'N pairs'
        elif test == 'anova_k3':
            powers = [FtestAnovaPower().solve_power(effect_size=es, nobs=n, alpha=alpha,
                                                     k_groups=3)
                      for n in ns]
            xlabel = 'N per group'
        else:
            raise ValueError(f"Unknown test: {test}")

        ax.plot(ns, powers, label=f'ES={es}')

    ax.axhline(0.80, color='gray', linestyle='--', linewidth=0.8, label='80% power')
    ax.axhline(0.90, color='gray', linestyle=':', linewidth=0.8, label='90% power')
    ax.set_xlabel(xlabel)
    ax.set_ylabel('Power (1 − β)')
    ax.set_title(f'Power curve — {test} (α={alpha})')
    ax.legend(framealpha=0.5)
    ax.set_ylim(0, 1)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    print(f"Saved: {output}")
    return output


# ── Effect size conversions ───────────────────────────────────────────────────

def d_from_means(m1, m2, sd_pooled):
    return (m1 - m2) / sd_pooled

def d_from_t(t, n1, n2):
    return t * np.sqrt((n1 + n2) / (n1 * n2))

def r_from_d(d):
    return d / np.sqrt(d**2 + 4)

def d_from_r(r):
    return 2 * r / np.sqrt(1 - r**2)

def f_from_eta2(eta2):
    return np.sqrt(eta2 / (1 - eta2))

def eta2_from_f(f):
    return f**2 / (1 + f**2)

def d_from_OR(OR):
    return np.log(OR) * (np.sqrt(3) / np.pi)


# ── CLI ──────────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Statistical power analysis')
    sub = parser.add_subparsers(dest='command')

    p_ttest = sub.add_parser('ttest-ind', help='Independent t-test')
    p_ttest.add_argument('--d', type=float, required=True, help="Cohen's d")
    p_ttest.add_argument('--power', type=float, default=0.80)
    p_ttest.add_argument('--alpha', type=float, default=0.05)

    p_anova = sub.add_parser('anova', help='One-way ANOVA')
    p_anova.add_argument('--f', type=float, required=True, help="Cohen's f")
    p_anova.add_argument('--k', type=int, required=True, help='Number of groups')
    p_anova.add_argument('--power', type=float, default=0.80)
    p_anova.add_argument('--alpha', type=float, default=0.05)

    p_prop = sub.add_parser('proportions', help='Two proportions test')
    p_prop.add_argument('--p1', type=float, required=True)
    p_prop.add_argument('--p2', type=float, required=True)
    p_prop.add_argument('--power', type=float, default=0.80)
    p_prop.add_argument('--alpha', type=float, default=0.05)

    p_curve = sub.add_parser('curve', help='Plot power curve')
    p_curve.add_argument('--test', default='ttest_ind',
                         choices=['ttest_ind', 'ttest_paired', 'anova_k3'])
    p_curve.add_argument('--alpha', type=float, default=0.05)
    p_curve.add_argument('--output', default='power_curve.png')

    p_clust = sub.add_parser('clustered', help='Clustered RCT power (simulation)')
    p_clust.add_argument('--clusters', type=int, required=True, help='Clusters per arm')
    p_clust.add_argument('--n-per-cluster', type=int, required=True)
    p_clust.add_argument('--icc', type=float, required=True)
    p_clust.add_argument('--delta', type=float, required=True, help='Mean difference')
    p_clust.add_argument('--sigma', type=float, default=1.0)
    p_clust.add_argument('--alpha', type=float, default=0.05)
    p_clust.add_argument('--nsim', type=int, default=2000)

    args = parser.parse_args()

    if args.command == 'ttest-ind':
        n = n_ttest_ind(args.d, args.power, args.alpha)
        print(f"n per group = {n}  (total = {2*n})")

    elif args.command == 'anova':
        n = n_anova(args.f, args.k, args.power, args.alpha)
        print(f"n per group = {n}  (total = {args.k*n})")

    elif args.command == 'proportions':
        n, h = n_proportions(args.p1, args.p2, args.power, args.alpha)
        print(f"Cohen's h = {h:.4f},  n per group = {n}  (total = {2*n})")

    elif args.command == 'curve':
        plot_power_curve(test=args.test, alpha=args.alpha, output=args.output)

    elif args.command == 'clustered':
        pwr = simulate_power_clustered(
            args.clusters, args.n_per_cluster, args.icc, args.delta,
            sigma_total=args.sigma, alpha=args.alpha, n_sim=args.nsim
        )
        deff = design_effect(args.icc, args.n_per_cluster)
        print(f"Simulated power: {pwr:.3f}  |  DEFF: {deff:.2f}")

    else:
        parser.print_help()
