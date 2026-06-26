---
name: biopython
description: Computational biology toolkit for sequence analysis, NCBI database access, BLAST searches, protein structure analysis, and phylogenetics. Powered by Biopython 1.87.
argument-hint: "<task: sequence|blast|structure|align|phylo|entrez> <input>"
version: 1.0
author: K-Dense, Inc. (adapted)
---

# /biopython

Use Biopython for computational biology tasks: parse sequences, search NCBI databases, run BLAST, analyze protein structures, build phylogenetic trees.

## Requirements

```bash
pip install biopython numpy
```

Set NCBI email (required for Entrez):
```bash
export NCBI_EMAIL="your@email.com"
# Optional: higher rate limits (10 req/s vs 3 req/s)
export NCBI_API_KEY="your_key_here"
```

## Task Guide

### Sequence parsing and manipulation

```python
from Bio import SeqIO
from Bio.Seq import Seq

# Parse FASTA
records = list(SeqIO.parse("sequences.fasta", "fasta"))
for rec in records:
    print(f"{rec.id}: {len(rec.seq)} bp, GC={gc_fraction(rec.seq)*100:.1f}%")

# Transcribe and translate
dna = Seq("ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG")
rna = dna.transcribe()           # AUGGCCAUUGUAAUGGGCCGCUGAAAGGGU...
protein = dna.translate()        # MAIVMGR*

# Reverse complement
rc = dna.reverse_complement()

# Format conversion
SeqIO.write(records, "output.gb", "genbank")
SeqIO.convert("input.fasta", "fasta", "output.fastq", "fastq")
```

### NCBI Entrez database access

```python
from Bio import Entrez
import os

Entrez.email = os.environ["NCBI_EMAIL"]
Entrez.api_key = os.environ.get("NCBI_API_KEY", "")

# Search PubMed
handle = Entrez.esearch(db="pubmed", term="CRISPR AND cancer", retmax=20)
record = Entrez.read(handle)
pmids = record["IdList"]

# Fetch abstracts
handle = Entrez.efetch(db="pubmed", id=",".join(pmids), rettype="abstract", retmode="text")
print(handle.read())

# Search NCBI Gene
handle = Entrez.esearch(db="gene", term="TP53[gene] AND Homo sapiens[organism]")
record = Entrez.read(handle)

# Fetch nucleotide sequence by accession
handle = Entrez.efetch(db="nucleotide", id="NM_000546", rettype="fasta", retmode="text")
seq_record = SeqIO.read(handle, "fasta")
```

### BLAST

```python
from Bio.Blast import NCBIWWW, NCBIXML

# Remote BLAST (slow; use for small queries)
result_handle = NCBIWWW.qblast(
    "blastp",           # program: blastn, blastp, blastx, tblastn, tblastx
    "nr",               # database: nr, nt, swissprot, pdb
    query_sequence,
    hitlist_size=10,
    expect=0.001,
)
blast_records = list(NCBIXML.parse(result_handle))

for blast_record in blast_records:
    for alignment in blast_record.alignments[:5]:
        for hsp in alignment.hsps:
            print(f"Title: {alignment.title}")
            print(f"Score: {hsp.score}, E-value: {hsp.expect}")
            print(f"Identities: {hsp.identities}/{hsp.align_length}")
```

### Multiple sequence alignment

```python
from Bio.Align import MultipleSeqAlignment
from Bio import AlignIO
from Bio.Phylo.TreeConstruction import DistanceCalculator, DistanceTreeConstructor

# Read alignment
alignment = AlignIO.read("sequences.aln", "clustal")

# Alignment statistics
print(f"Number of sequences: {len(alignment)}")
print(f"Alignment length: {alignment.get_alignment_length()}")

# Pairwise alignment (Biopython 1.80+)
from Bio import Align
aligner = Align.PairwiseAligner()
aligner.mode = "global"   # or "local"
aligner.match_score = 2
aligner.mismatch_score = -1
aligner.open_gap_score = -0.5
aligner.extend_gap_score = -0.1

alignments = aligner.align(seq1, seq2)
print(f"Score: {alignments[0].score}")
print(alignments[0])
```

### Protein structure analysis

```python
from Bio.PDB import PDBParser, PDBIO, Select
from Bio.PDB.DSSP import DSSP

parser = PDBParser(QUIET=True)
structure = parser.get_structure("protein", "1TUP.pdb")

model = structure[0]

# Iterate chains, residues, atoms
for chain in model:
    print(f"Chain {chain.id}: {len(list(chain.get_residues()))} residues")
    
for residue in model["A"]:
    if residue.id[0] == " ":  # ATOM records only (not HETATM)
        print(f"{residue.resname} {residue.id[1]}")

# Secondary structure (requires DSSP installed)
dssp = DSSP(model, "1TUP.pdb")
for key in dssp.property_keys:
    print(dssp[key])

# Distance between residues
ca1 = model["A"][50]["CA"]
ca2 = model["A"][100]["CA"]
distance = ca1 - ca2
print(f"CA distance: {distance:.2f} Å")
```

### Phylogenetics

```python
from Bio import Phylo
from Bio.Phylo.TreeConstruction import DistanceCalculator, DistanceTreeConstructor
from Bio import AlignIO

alignment = AlignIO.read("alignment.fasta", "fasta")

# Build distance matrix and tree
calculator = DistanceCalculator("identity")
dm = calculator.get_distance(alignment)

constructor = DistanceTreeConstructor(calculator)
tree_upgma = constructor.upgma(dm)    # UPGMA
tree_nj = constructor.nj(dm)          # Neighbor-joining

# Draw ASCII tree
Phylo.draw_ascii(tree_nj)

# Save tree
Phylo.write(tree_nj, "tree.nwk", "newick")
```

## Common workflows

**Workflow: Fetch protein and run BLAST**
```python
from Bio import Entrez, SeqIO
from Bio.Blast import NCBIWWW, NCBIXML
import os

Entrez.email = os.environ["NCBI_EMAIL"]

# Fetch protein
handle = Entrez.efetch(db="protein", id="NP_000537", rettype="fasta", retmode="text")
record = SeqIO.read(handle, "fasta")

# BLAST against SwissProt
result = NCBIWWW.qblast("blastp", "swissprot", record.seq, hitlist_size=10)
blast_records = list(NCBIXML.parse(result))

# Report top hits
for aln in blast_records[0].alignments[:10]:
    for hsp in aln.hsps:
        print(f"{aln.title[:60]}: score={hsp.score}, E={hsp.expect:.2e}, id={hsp.identities}/{hsp.align_length}")
```

## Troubleshooting

- **SSL errors with NCBI**: Update Python certificates or set `ssl._create_default_https_context = ssl._create_unverified_context` (dev only)
- **Rate limit exceeded**: Add `time.sleep(0.34)` between Entrez calls without API key
- **Large alignments slow**: Use local BLAST via `Bio.Blast.Applications.NcbiblastpCommandline`
- **DSSP not found**: Install separately via `conda install -c salilab dssp` or `apt install dssp`
