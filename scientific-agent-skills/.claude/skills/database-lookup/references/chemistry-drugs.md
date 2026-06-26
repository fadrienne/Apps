# Chemistry & Drug Databases

## PubChem

**Base URL:** `https://pubchem.ncbi.nlm.nih.gov/rest/pug`
**Rate limit:** 5 req/s; use PUG REST for bulk
**Docs:** `https://pubchemdocs.ncbi.nlm.nih.gov/pug-rest`

```bash
# Compound by name → CID
curl "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/aspirin/cids/JSON"

# Compound by CID → properties
curl "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/2244/property/MolecularFormula,MolecularWeight,IUPACName,XLogP,TPSA/JSON"

# Compound by SMILES
curl "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/CC(=O)Oc1ccccc1C(O)=O/cids/JSON"

# 2D structure image
curl "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/2244/PNG" -o aspirin.png

# Bioassays for a compound
curl "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/2244/aids/JSON"
```

## ChEMBL

**Base URL:** `https://www.ebi.ac.uk/chembl/api/data`
**Python:** `chembl_webresource_client`
**Rate limit:** 1 req/s recommended

```python
from chembl_webresource_client.new_client import new_client

# Molecule search
molecule = new_client.molecule
results = molecule.filter(molecule_synonyms__molecule_synonym__iexact="aspirin")

# Bioactivity data
activity = new_client.activity
acts = activity.filter(
    target_chembl_id="CHEMBL203",
    standard_type="IC50",
    standard_units="nM",
)

# Target search
target = new_client.target
targets = target.filter(target_synonym__icontains="kinase", organism="Homo sapiens")
```

```bash
# REST equivalent
curl "https://www.ebi.ac.uk/chembl/api/data/molecule?molecule_synonyms__molecule_synonym__iexact=aspirin&format=json"
```

## DrugBank (requires account)

**Base URL:** `https://go.drugbank.com/drugs/`
**API:** Requires subscription; public XML available
**Identifier:** `DBXXXXX` (e.g., `DB00945` = aspirin)

```bash
# Public XML download: https://go.drugbank.com/releases/latest
# Search via open data (limited)
curl "https://go.drugbank.com/drugs/DB00945.json"  # requires auth
```

## OpenFDA / FDA

**Base URL:** `https://api.fda.gov`
**Rate limit:** 1,000 req/day unauthenticated; 120,000 with key (`FDA_API_KEY`)

```bash
# Drug adverse events
curl "https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:aspirin&limit=5"

# Drug label
curl "https://api.fda.gov/drug/label.json?search=openfda.brand_name:aspirin&limit=1"

# NDC lookup
curl "https://api.fda.gov/drug/ndc.json?search=brand_name:aspirin&limit=5"
```

## RxNorm (Drug Terminology)

**Base URL:** `https://rxnav.nlm.nih.gov/REST`
**Rate limit:** No hard limit

```bash
# Drug name → RxNorm CUI
curl "https://rxnav.nlm.nih.gov/REST/rxcui.json?name=aspirin"

# Drug interactions
curl "https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=1049502+1049900"

# Drug by NDC
curl "https://rxnav.nlm.nih.gov/REST/ndcstatus.json?ndc=00536-3180-01"
```

## ChEBI (Chemical Entities of Biological Interest)

**Base URL:** `https://www.ebi.ac.uk/webservices/chebi/`
**Python:** `libChEBI`

```bash
# Compound by name
curl "https://www.ebi.ac.uk/webservices/chebi/2.0/getLiteEntity?search=aspirin&searchCategory=ALL&maximumResults=5&starsCategory=ALL"
```

## Common Identifiers

| Entity | Identifier | Example |
|---|---|---|
| Chemical | PubChem CID | `2244` |
| Chemical | SMILES | `CC(=O)Oc1ccccc1C(O)=O` |
| Chemical | InChI Key | `BSYNRYMUTXBXSQ-UHFFFAOYSA-N` |
| Drug | ChEMBL ID | `CHEMBL25` |
| Drug | DrugBank ID | `DB00945` |
| Drug | RxNorm CUI | `1191` |
| Drug (US) | NDC code | `00536-3180-01` |
| Target | ChEMBL target | `CHEMBL203` |
| Enzyme | EC number | `3.1.1.1` |
| Lipid | LIPID MAPS ID | `LMFA01030001` |
