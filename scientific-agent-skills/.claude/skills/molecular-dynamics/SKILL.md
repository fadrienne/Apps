---
name: molecular-dynamics
description: Set up, run, and analyze molecular dynamics simulations using OpenMM, GROMACS, or AMBER. Covers protein preparation, force field assignment, simulation protocols, and trajectory analysis.
argument-hint: "<structure file (PDB/CIF)> [--engine openmm|gromacs] [--ensemble nvt|npt|nve] [--time ns]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /molecular-dynamics

Run molecular dynamics simulations for proteins, ligands, and protein-ligand complexes. Prepare systems, assign force fields, run equilibration and production MD, and analyze trajectories.

## When to invoke

- "run MD simulation on this protein"
- "molecular dynamics"
- "energy minimize this structure"
- "protein stability analysis"
- "analyze MD trajectory"

## Installation

```bash
# OpenMM (recommended for Python workflows)
conda install -c conda-forge openmm mdanalysis mdtraj

# GROMACS (for large-scale production simulations)
# Install from https://manual.gromacs.org/

# PDBFixer for structure preparation
pip install pdbfixer
```

## Workflow

### Step 1: Prepare structure

```python
from pdbfixer import PDBFixer
from openmm.app import PDBFile

def prepare_protein(pdb_file, output="prepared.pdb"):
    """Clean PDB: add missing residues, atoms, hydrogens."""
    fixer = PDBFixer(filename=pdb_file)
    
    # Find and fix issues
    fixer.findMissingResidues()
    fixer.findMissingAtoms()
    fixer.findNonstandardResidues()
    
    print(f"Missing residues: {fixer.missingResidues}")
    print(f"Missing atoms: {fixer.missingAtoms}")
    
    # Add missing atoms and hydrogens
    fixer.addMissingAtoms()
    fixer.addMissingHydrogens(pH=7.0)
    
    # Remove heterogens (water, ions) — optional, depends on study
    fixer.removeHeterogens(keepWater=False)
    
    with open(output, "w") as f:
        PDBFile.writeFile(fixer.topology, fixer.positions, f)
    
    return output
```

### Step 2: Set up simulation system (OpenMM)

```python
from openmm import app, unit, LangevinMiddleIntegrator, Platform, MonteCarloBarostat
from openmm.app import ForceField, Modeller, PME, HBonds, DCDReporter, StateDataReporter
import sys

def setup_simulation(pdb_file, force_field="amber14-all.xml", water_model="amber14/tip3pfb.xml"):
    """Set up explicit solvent MD simulation."""
    
    # Load structure
    pdb = app.PDBFile(pdb_file)
    
    # Define force field
    ff = ForceField(force_field, water_model)
    
    # Add solvent box
    modeller = Modeller(pdb.topology, pdb.positions)
    modeller.addSolvent(
        ff,
        model="tip3p",
        padding=10 * unit.angstroms,    # 10 Å padding around protein
        ionicStrength=0.15 * unit.molar, # 150 mM NaCl
    )
    
    # Create system
    system = ff.createSystem(
        modeller.topology,
        nonbondedMethod=PME,
        nonbondedCutoff=1.0 * unit.nanometers,
        constraints=HBonds,
    )
    
    # Add pressure coupling for NPT
    system.addForce(MonteCarloBarostat(1 * unit.bar, 300 * unit.kelvin))
    
    return modeller.topology, modeller.positions, system

topology, positions, system = setup_simulation("prepared.pdb")
```

### Step 3: Energy minimization

```python
def minimize_energy(topology, positions, system, tolerance=10, output="minimized.pdb"):
    """Energy minimize to remove clashes."""
    integrator = LangevinMiddleIntegrator(300 * unit.kelvin, 1 / unit.picosecond, 
                                          0.004 * unit.picoseconds)
    
    # Use GPU if available
    try:
        platform = Platform.getPlatformByName("CUDA")
        properties = {"DeviceIndex": "0", "Precision": "mixed"}
    except Exception:
        platform = Platform.getPlatformByName("CPU")
        properties = {}
    
    simulation = app.Simulation(topology, system, integrator, platform, properties)
    simulation.context.setPositions(positions)
    
    print(f"Initial energy: {simulation.context.getState(getEnergy=True).getPotentialEnergy()}")
    
    simulation.minimizeEnergy(tolerance=tolerance * unit.kilojoules_per_mole / unit.nanometer)
    
    print(f"Final energy: {simulation.context.getState(getEnergy=True).getPotentialEnergy()}")
    
    # Save minimized structure
    state = simulation.context.getState(getPositions=True)
    with open(output, "w") as f:
        app.PDBFile.writeFile(topology, state.getPositions(), f)
    
    return simulation

simulation = minimize_energy(topology, positions, system)
```

### Step 4: Equilibration (NVT → NPT)

```python
def equilibrate(simulation, n_steps_nvt=50000, n_steps_npt=100000, 
                temperature=300, output_prefix="equilibration"):
    """NVT then NPT equilibration."""
    
    # NVT equilibration (1 ns, 2 fs timestep → 500,000 steps)
    print("Running NVT equilibration...")
    simulation.reporters.append(
        StateDataReporter(f"{output_prefix}_nvt.log", 1000, step=True, 
                          potentialEnergy=True, temperature=True, volume=True)
    )
    simulation.context.setVelocitiesToTemperature(temperature * unit.kelvin)
    simulation.step(n_steps_nvt)
    
    # NPT equilibration
    print("Running NPT equilibration...")
    simulation.reporters[-1] = StateDataReporter(
        f"{output_prefix}_npt.log", 1000, step=True,
        potentialEnergy=True, temperature=True, density=True
    )
    simulation.step(n_steps_npt)
    
    return simulation
```

### Step 5: Production run

```python
def production_run(simulation, n_ns=100, save_interval_ps=10, output_prefix="production"):
    """Run production MD."""
    dt_ps = 0.002  # 2 fs timestep
    total_steps = int(n_ns * 1000 / dt_ps)   # convert ns to steps
    save_every = int(save_interval_ps / dt_ps)
    
    print(f"Running {n_ns} ns production MD ({total_steps:,} steps)...")
    
    simulation.reporters.append(
        app.DCDReporter(f"{output_prefix}.dcd", save_every)
    )
    simulation.reporters.append(
        StateDataReporter(
            f"{output_prefix}.log", save_every,
            step=True, time=True, potentialEnergy=True, kineticEnergy=True,
            temperature=True, density=True, speed=True,
        )
    )
    
    from time import time
    start = time()
    simulation.step(total_steps)
    elapsed = time() - start
    
    ns_per_day = n_ns / elapsed * 86400
    print(f"Done. Elapsed: {elapsed/3600:.1f} h, Speed: {ns_per_day:.1f} ns/day")
```

### Step 6: Trajectory analysis

```python
import MDAnalysis as mda
from MDAnalysis.analysis import rms, rmsf, contacts

def analyze_trajectory(topology_file, trajectory_file):
    u = mda.Universe(topology_file, trajectory_file)
    
    # RMSD (backbone deviation from initial structure)
    protein = u.select_atoms("protein and backbone")
    rmsd_analysis = rms.RMSD(protein, select="backbone")
    rmsd_analysis.run()
    rmsd_data = rmsd_analysis.results.rmsd[:, 2]  # column 2 = RMSD values
    
    # RMSF (per-residue flexibility)
    rmsf_analysis = rmsf.RMSF(protein)
    rmsf_analysis.run()
    
    # Radius of gyration (protein compactness)
    Rg = [protein.radius_of_gyration() for ts in u.trajectory]
    
    # Secondary structure contacts
    # ...
    
    return {
        "rmsd": rmsd_data,
        "rmsf": rmsf_analysis.results.rmsf,
        "Rg": Rg,
        "n_frames": len(u.trajectory),
        "n_residues": len(protein.residues),
    }
```

## GROMACS workflow (brief)

```bash
# 1. Prepare topology
gmx pdb2gmx -f protein.pdb -o processed.gro -water spce -ff amber03

# 2. Define box and solvate
gmx editconf -f processed.gro -o newbox.gro -c -d 1.0 -bt cubic
gmx solvate -cp newbox.gro -cs spc216.gro -o solvated.gro -p topol.top

# 3. Add ions
gmx grompp -f ions.mdp -c solvated.gro -p topol.top -o ions.tpr
gmx genion -s ions.tpr -o ions.gro -p topol.top -pname NA -nname CL -neutral

# 4. Energy minimization
gmx grompp -f em.mdp -c ions.gro -p topol.top -o em.tpr
gmx mdrun -v -deffnm em

# 5. NVT equilibration
gmx grompp -f nvt.mdp -c em.gro -r em.gro -p topol.top -o nvt.tpr
gmx mdrun -deffnm nvt

# 6. NPT equilibration
gmx grompp -f npt.mdp -c nvt.gro -r nvt.gro -t nvt.cpt -p topol.top -o npt.tpr
gmx mdrun -deffnm npt

# 7. Production MD
gmx grompp -f md.mdp -c npt.gro -t npt.cpt -p topol.top -o md.tpr
gmx mdrun -deffnm md
```

## Output files

- `minimized.pdb` — energy-minimized structure
- `equilibration_nvt.log`, `equilibration_npt.log` — equilibration logs
- `production.dcd` — trajectory file
- `production.log` — simulation statistics
- `analysis_rmsd.png` — RMSD over time
- `analysis_rmsf.png` — per-residue flexibility
- `analysis_summary.md` — analysis report

## Force fields

| System | Recommended FF |
|---|---|
| Proteins | AMBER14, CHARMM36 |
| Nucleic acids | AMBER14, CHARMM36 |
| Lipid bilayers | CHARMM36, SLIPIDS |
| Small molecules | GAFF2, CGenFF |
| Carbohydrates | GLYCAM06, CHARMM36 |
| Coarse-grained | MARTINI 3 |
