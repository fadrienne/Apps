# Physics & Astronomy Databases

## NASA/IPAC Extragalactic Database (NED)

**Base URL:** `https://ned.ipac.caltech.edu/api`
**Rate limit:** No key needed

```bash
# Object by name
curl "https://ned.ipac.caltech.edu/api/objsearch?objname=NGC+4889&of=json_main"

# Position search (cone search)
curl "https://ned.ipac.caltech.edu/api/objsearch?search_type=Near+Position+Search&ra=194.354&dec=27.977&radius=1.0&of=json_main"

# Photometry data
curl "https://ned.ipac.caltech.edu/api/datasearch?search_type=Photometry&objname=M31&of=json_main"
```

## SIMBAD (Astronomical Objects)

**Base URL:** `http://simbad.u-strasbg.fr/simbad/sim-tap/sync`
**Protocol:** TAP/ADQL queries

```bash
# Object by name
curl "http://simbad.u-strasbg.fr/simbad/sim-id?output.format=JSON&Ident=M31"

# TAP query (ADQL)
curl -X POST "http://simbad.u-strasbg.fr/simbad/sim-tap/sync" \
  --data-urlencode "REQUEST=doQuery" \
  --data-urlencode "LANG=ADQL" \
  --data-urlencode "QUERY=SELECT TOP 10 oid, main_id, ra, dec, otype FROM basic WHERE otype='G..' ORDER BY ra"
```

```python
from astroquery.simbad import Simbad

# Query object
result = Simbad.query_object("M31")
print(result["RA", "DEC", "FLUX_V"])

# Query region
from astropy.coordinates import SkyCoord
import astropy.units as u
coord = SkyCoord("10h41m04.0s", "+41d16m09s", frame="icrs")
results = Simbad.query_region(coord, radius=5 * u.arcmin)
```

## NASA ADS (Astrophysics Data System)

**Base URL:** `https://api.adsabs.harvard.edu/v1`
**Auth:** Bearer token — free at ui.adsabs.harvard.edu/user/settings/token

```bash
# Paper search
curl -H "Authorization: Bearer $ADS_TOKEN" \
  "https://api.adsabs.harvard.edu/v1/search/query?q=author:Einstein+title:relativity&fl=bibcode,title,author,year&rows=5"

# Cite paper (get references)
curl -H "Authorization: Bearer $ADS_TOKEN" \
  "https://api.adsabs.harvard.edu/v1/search/query?q=references(bibcode:2019ApJ...875L...1E)&fl=bibcode,title"

# Export BibTeX
curl -H "Authorization: Bearer $ADS_TOKEN" \
  "https://api.adsabs.harvard.edu/v1/export/bibtex" \
  -d '{"bibcode": ["2019ApJ...875L...1E"]}'
```

## NIST Physical Reference Data

**Base URL:** `https://physics.nist.gov/cgi-bin`

```bash
# Atomic spectral lines
curl "https://physics.nist.gov/cgi-bin/ASD/lines1.pl?spectra=Fe+I&low_w=3000&upp_w=7000&unit=1&submit=Retrieve+Data&de=0&format=3&line_out=0&no_spaces=on&remove_js=on"

# Physical constants (JSON not available; use CODATA)
```

```python
# Use scipy for CODATA constants
from scipy.constants import physical_constants

c = physical_constants["speed of light in vacuum"]
# (value, unit, uncertainty)

# Or:
import scipy.constants as const
print(const.c)        # speed of light
print(const.h)        # Planck constant
print(const.N_A)      # Avogadro number
```

## arXiv (Physics Preprints)

**Base URL:** `https://export.arxiv.org/api/query`
**Rate limit:** 3 req/s

```bash
# Search physics papers
curl "https://export.arxiv.org/api/query?search_query=cat:hep-ph+AND+ti:Higgs+boson&start=0&max_results=5"

# Recent submissions
curl "https://export.arxiv.org/api/query?search_query=cat:astro-ph.CO&sortBy=submittedDate&sortOrder=descending&max_results=10"
```

## Common Identifiers

| Entity | Identifier | Example |
|---|---|---|
| Star/galaxy | SIMBAD name | `M31`, `NGC 4889` |
| Star | HD catalog | `HD 189733` |
| Exoplanet | NASA Exoplanet Archive ID | `TOI-1234 b` |
| Particle/element | PDG ID | `11` (electron) |
| Paper | ADS bibcode | `2019ApJ...875L...1E` |
| arXiv paper | arXiv ID | `astro-ph/0005114` |
| Spectral line | NIST designation | `Fe I 6302.494` |

## arXiv Subject Categories (Physics)

| Code | Subject |
|---|---|
| `astro-ph` | Astrophysics |
| `cond-mat` | Condensed Matter |
| `gr-qc` | General Relativity |
| `hep-ex/ph/th` | High Energy Physics |
| `math-ph` | Mathematical Physics |
| `nucl-ex/th` | Nuclear Physics |
| `physics` | General Physics |
| `quant-ph` | Quantum Physics |
