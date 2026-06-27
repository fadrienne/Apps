# Social Science & Demographics Databases

## US Census Bureau APIs

**Base URL:** `https://api.census.gov/data`
**Auth:** API key (`CENSUS_API_KEY`) — free at api.census.gov/data/key_signup.html

```bash
# American Community Survey 5-year estimates
# Population and median income by county (California)
curl "https://api.census.gov/data/2022/acs/acs5?get=B01001_001E,B19013_001E&for=county:*&in=state:06&key=$CENSUS_API_KEY"

# Decennial Census 2020
curl "https://api.census.gov/data/2020/dec/pl?get=P1_001N&for=state:*&key=$CENSUS_API_KEY"
```

```python
import requests
import pandas as pd

def census_acs(variables, geo="county:*", state="*", year=2022):
    url = f"https://api.census.gov/data/{year}/acs/acs5"
    r = requests.get(url, params={
        "get": ",".join(variables),
        "for": geo,
        "in": f"state:{state}" if state != "*" else None,
        "key": os.environ.get("CENSUS_API_KEY", ""),
    })
    data = r.json()
    return pd.DataFrame(data[1:], columns=data[0])
```

## UN Data / UN Comtrade

**UN Data API:** `http://data.un.org/ws/rest`

```bash
# Population data
curl "http://data.un.org/ws/rest/data/DF_UNDATA_COUNTRYDATA,A.SP_POP_TOTL.840/?startPeriod=2015&endPeriod=2023&format=jsondata"
```

**UN Comtrade (Trade flows):**

```python
import requests

def comtrade_query(reporter, partner, year, commodity="TOTAL"):
    r = requests.get("https://comtradeapi.un.org/data/v1/get/C/A/HS", params={
        "reporterCode": reporter,  # e.g., 840 = USA
        "partnerCode": partner,    # e.g., 156 = China
        "period": year,
        "cmdCode": commodity,
        "flowCode": "X,M",         # exports and imports
        "subscription-key": os.environ["COMTRADE_KEY"],
    })
    return r.json()
```

## IPUMS (Integrated Public Use Microdata Series)

**Portal:** `https://usa.ipums.org/usa/`
**Python:** `ipumspy` library
**Auth:** API key at account.ipums.org

```python
from ipumspy import IpumsApiClient, UsaExtract

client = IpumsApiClient(os.environ["IPUMS_API_KEY"])

# Define extract
extract = UsaExtract(
    ["us2019b"],                          # sample: 2019 ACS
    ["YEAR", "STATEFIP", "AGE", "SEX", "RACE", "INCTOT"],  # variables
)

# Submit and download
client.submit_extract(extract)
client.wait_for_extract(extract)
ddi, df = client.extract_to_dataframe(extract)
```

## OpenStreetMap / Nominatim (Geocoding)

**Base URL:** `https://nominatim.openstreetmap.org`
**Rate limit:** 1 req/s; identify your app in User-Agent

```bash
# Forward geocoding
curl -H "User-Agent: MyResearchProject/1.0 (contact@example.com)" \
  "https://nominatim.openstreetmap.org/search?q=Harvard+University&format=json&limit=1"

# Reverse geocoding
curl -H "User-Agent: MyResearchProject/1.0" \
  "https://nominatim.openstreetmap.org/reverse?lat=42.3770&lon=-71.1167&format=json"
```

## Overture Maps (Population-scale places)

```python
import geopandas as gpd

# Download via DuckDB (no API key needed)
import duckdb
conn = duckdb.connect()
conn.execute("INSTALL spatial; LOAD spatial;")

places = conn.execute("""
    SELECT id, names, categories, geometry
    FROM read_parquet('s3://overturemaps-us-west-2/release/2024-09-18.0/theme=places/type=place/*', filename=true, hive_partitioning=1)
    WHERE bbox.xmin > -74.05 AND bbox.xmax < -73.90
      AND bbox.ymin > 40.67 AND bbox.ymax < 40.80
    LIMIT 100
""").df()
```

## Common Identifiers

| Entity | Identifier | Example |
|---|---|---|
| US county | FIPS code | `06037` (LA County) |
| US state | FIPS code | `06` (California) |
| Country | ISO-3 | `USA`, `DEU`, `CHN` |
| Country | UN M49 | `840` (USA) |
| Census tract | FIPS+tract | `06037101101` |
| OSM object | OSM ID | `node/158817708` |
| IPUMS sample | IPUMS code | `us2019b` |
| HS trade code | HS-6 | `870322` |
