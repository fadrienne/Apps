---
name: datamol
description: Molecular manipulation, visualization, and ADMET property prediction using datamol and RDKit. Handles SMILES, InChI, SDF, and mol2 formats.
argument-hint: "<SMILES or SDF file> [--task properties|admet|similarity|scaffold|visualize]"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /datamol

Manipulate molecules, calculate properties, predict ADMET profiles, and visualize chemical structures using datamol (a modern RDKit wrapper).

## When to invoke

- "calculate molecular properties for X"
- "predict ADMET for this compound"
- "visualize this molecule"
- "find similar molecules"
- "scaffold analysis"
- "standardize these SMILES"

## Installation

```bash
pip install datamol molfeat
conda install -c conda-forge rdkit  # or pip install rdkit
```

## Core operations

### Load and standardize molecules

```python
import datamol as dm

# From SMILES string
mol = dm.to_mol("CC(=O)Oc1ccccc1C(=O)O")  # aspirin

# From SDF file
mols = dm.read_sdf("compounds.sdf")

# Standardize (fix charges, remove salts, normalize)
mol_std = dm.standardize_mol(mol)

# Convert formats
smiles = dm.to_smiles(mol)
inchi = dm.to_inchi(mol)
inchikey = dm.to_inchikey(mol)

# From InChI
mol = dm.from_inchi("InChI=1S/C9H8O4/c1-6(10)13-8-5-3-2-4-7(8)9(11)12/h2-5H,1H3,(H,11,12)")
```

### Calculate molecular descriptors

```python
# Drug-like properties (Lipinski, Veber)
props = dm.descriptors.compute_many_descriptors(mol)
# Returns dict with: MW, logP, HBA, HBD, TPSA, rotatable_bonds, rings, ...

# Lipinski's Rule of 5
mw = dm.descriptors.mw(mol)           # molecular weight
logp = dm.descriptors.clogp(mol)      # calculated logP
hba = dm.descriptors.n_hba(mol)       # H-bond acceptors
hbd = dm.descriptors.n_hbd(mol)       # H-bond donors
tpsa = dm.descriptors.tpsa(mol)       # topological polar surface area
rot = dm.descriptors.n_rotatable_bonds(mol)

# Drug-likeness check
is_drug_like = (mw <= 500 and logp <= 5 and hba <= 10 and hbd <= 5)

# Batch computation
df = dm.descriptors.batch_compute_many_descriptors(mols)
```

### ADMET prediction

```python
import molfeat
from molfeat.trans.pretrained import PretrainedMolTransformer

# ChemBERTa-based ADMET predictions
transformer = PretrainedMolTransformer(kind="ChemBERTa-77M-MTR")
features = transformer.transform([smiles])

# Or use ADMET-AI (more specific predictions)
# pip install admet-ai
from admet_ai import ADMETModel
model = ADMETModel()
predictions = model.predict(smiles=smiles)
# Returns: absorption, distribution, metabolism, excretion, toxicity endpoints
```

### Molecular fingerprints

```python
from rdkit.Chem import AllChem
import numpy as np

# Morgan fingerprints (ECFP)
fp = AllChem.GetMorganFingerprintAsBitVect(mol, radius=2, nBits=2048)
fp_array = np.array(fp)

# MACCS keys
from rdkit.Chem import MACCSkeys
maccs = MACCSkeys.GenMACCSKeys(mol)

# Tanimoto similarity
from rdkit.DataStructs import TanimotoSimilarity
similarity = TanimotoSimilarity(fp1, fp2)
```

### Similarity search

```python
def find_similar(query_smiles, library_smiles, threshold=0.7):
    """Find molecules in library with Tanimoto similarity ≥ threshold."""
    from rdkit.Chem import AllChem
    from rdkit.DataStructs import BulkTanimotoSimilarity
    
    query_mol = dm.to_mol(query_smiles)
    query_fp = AllChem.GetMorganFingerprintAsBitVect(query_mol, 2, 2048)
    
    library_mols = [dm.to_mol(s) for s in library_smiles]
    library_fps = [AllChem.GetMorganFingerprintAsBitVect(m, 2, 2048) 
                   for m in library_mols if m is not None]
    
    similarities = BulkTanimotoSimilarity(query_fp, library_fps)
    
    results = [(library_smiles[i], sim) 
               for i, sim in enumerate(similarities) if sim >= threshold]
    return sorted(results, key=lambda x: x[1], reverse=True)
```

### Scaffold analysis

```python
from rdkit.Chem.Scaffolds import MurckoScaffold

def get_scaffold(mol):
    """Get Murcko scaffold."""
    scaffold = MurckoScaffold.GetScaffoldForMol(mol)
    return dm.to_smiles(scaffold)

# Group compounds by scaffold
scaffolds = {}
for smi in library_smiles:
    mol = dm.to_mol(smi)
    if mol:
        scaf = get_scaffold(mol)
        scaffolds.setdefault(scaf, []).append(smi)

# Top scaffolds by frequency
top_scaffolds = sorted(scaffolds.items(), key=lambda x: len(x[1]), reverse=True)[:10]
```

### Substructure filtering

```python
from rdkit.Chem import MolFromSmarts

def has_pains(mol):
    """Check for PAINS alerts (pan-assay interference compounds)."""
    from rdkit.Chem.FilterCatalog import FilterCatalog, FilterCatalogParams
    params = FilterCatalogParams()
    params.AddCatalog(FilterCatalogParams.FilterCatalogs.PAINS)
    catalog = FilterCatalog(params)
    return catalog.HasMatch(mol)

def has_brenk(mol):
    """Check for Brenk structural alerts."""
    from rdkit.Chem.FilterCatalog import FilterCatalog, FilterCatalogParams
    params = FilterCatalogParams()
    params.AddCatalog(FilterCatalogParams.FilterCatalogs.BRENK)
    catalog = FilterCatalog(params)
    return catalog.HasMatch(mol)
```

### Visualization

```python
# Single molecule
img = dm.viz.to_image(mol)

# Grid of molecules with labels
grid_img = dm.viz.to_image(
    mols[:12],
    legends=[f"Mol {i+1}" for i in range(12)],
    n_cols=4,
    mol_size=(200, 150),
)
grid_img.save("molecules.png")

# Highlight substructure
query = dm.from_smarts("c1ccccc1")  # benzene ring
img = dm.viz.to_image(mol, highlight_mol=query)

# Color by property
imgs = dm.viz.to_image(
    mols,
    legends=[f"logP: {dm.descriptors.clogp(m):.2f}" for m in mols],
)
```

## Standard analysis workflow

```python
import datamol as dm
import pandas as pd

# 1. Load compounds
mols = dm.read_sdf("library.sdf")
smiles_list = [dm.to_smiles(m) for m in mols if m]

# 2. Standardize
clean_mols = [dm.standardize_mol(m) for m in mols]
clean_mols = [m for m in clean_mols if m is not None]

# 3. Calculate properties
props = dm.descriptors.batch_compute_many_descriptors(clean_mols)
df = pd.DataFrame(props)
df["smiles"] = [dm.to_smiles(m) for m in clean_mols]

# 4. Filter drug-like compounds (Lipinski RO5)
ro5_filter = (
    (df["mw"] <= 500) &
    (df["clogp"] <= 5) &
    (df["n_hba"] <= 10) &
    (df["n_hbd"] <= 5)
)
df_drug_like = df[ro5_filter]
print(f"Drug-like: {len(df_drug_like)}/{len(df)} ({100*len(df_drug_like)/len(df):.1f}%)")

# 5. Filter PAINS
df_drug_like["has_pains"] = [has_pains(dm.to_mol(s)) for s in df_drug_like["smiles"]]
df_clean = df_drug_like[~df_drug_like["has_pains"]]

print(f"After PAINS filter: {len(df_clean)}")
df_clean.to_csv("filtered_library.csv", index=False)
```
