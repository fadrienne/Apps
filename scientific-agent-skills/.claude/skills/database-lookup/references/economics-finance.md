# Economics & Finance Databases

## World Bank Open Data

**Base URL:** `https://api.worldbank.org/v2`
**Rate limit:** No key needed; 500 req/min

```bash
# GDP per capita for all countries (most recent year)
curl "https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.CD?format=json&mrv=1&per_page=300"

# Country metadata
curl "https://api.worldbank.org/v2/country/US?format=json"

# Indicator search
curl "https://api.worldbank.org/v2/indicator?format=json&search=poverty&per_page=10"

# Time series for a country
curl "https://api.worldbank.org/v2/country/US/indicator/SP.POP.TOTL?format=json&date=2010:2023"
```

```python
import requests

def wb_series(country_code, indicator, start=2000, end=2023):
    url = f"https://api.worldbank.org/v2/country/{country_code}/indicator/{indicator}"
    r = requests.get(url, params={"format": "json", "date": f"{start}:{end}", "per_page": 500})
    pages = r.json()
    if len(pages) < 2:
        return []
    return [(row["date"], row["value"]) for row in pages[1] if row["value"] is not None]
```

## IMF Data (International Monetary Fund)

**Base URL:** `https://www.imf.org/external/datamapper/api/v1`
**Rate limit:** No key needed

```bash
# Available indicators
curl "https://www.imf.org/external/datamapper/api/v1/indicators"

# GDP growth for US
curl "https://www.imf.org/external/datamapper/api/v1/NGDP_RPCH/USA"

# World Economic Outlook data
curl "https://www.imf.org/external/datamapper/api/v1/PCPIPCH"
```

## FRED (Federal Reserve Economic Data)

**Base URL:** `https://api.stlouisfed.org/fred`
**Auth:** API key (`FRED_API_KEY`) — free at fred.stlouisfed.org/docs/api

```bash
# Series data (GDP)
curl "https://api.stlouisfed.org/fred/series/observations?series_id=GDP&api_key=$FRED_API_KEY&file_type=json&observation_start=2020-01-01"

# Search for series
curl "https://api.stlouisfed.org/fred/series/search?search_text=unemployment+rate&api_key=$FRED_API_KEY&file_type=json&limit=5"

# Series metadata
curl "https://api.stlouisfed.org/fred/series?series_id=UNRATE&api_key=$FRED_API_KEY&file_type=json"
```

```python
from fredapi import Fred  # pip install fredapi

fred = Fred(api_key=os.environ["FRED_API_KEY"])

# GDP data
gdp = fred.get_series("GDP", observation_start="2020-01-01")

# Unemployment rate
unrate = fred.get_series("UNRATE")
```

## OECD Statistics

**Base URL:** `https://stats.oecd.org/SDMX-JSON/data`
**Rate limit:** No key needed

```bash
# Health expenditure as % of GDP
curl "https://stats.oecd.org/SDMX-JSON/data/SHA/AUS+AUT.HF1.HP1.HC1_HC2/OECD?startTime=2015&endTime=2022&dimensionAtObservation=allDimensions"
```

## Eurostat

**Base URL:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1`
**Python:** `eurostat` library

```python
import eurostat

# GDP data for EU countries
df = eurostat.get_data_df("namq_10_gdp", flags=False)

# Available datasets
toc = eurostat.get_toc()
```

## Common Indicators

| Indicator | Source | Code |
|---|---|---|
| GDP (nominal) | World Bank | `NY.GDP.MKTP.CD` |
| GDP per capita | World Bank | `NY.GDP.PCAP.CD` |
| GDP growth | IMF | `NGDP_RPCH` |
| Inflation (CPI) | IMF | `PCPIPCH` |
| Unemployment | FRED | `UNRATE` |
| Federal Funds Rate | FRED | `FEDFUNDS` |
| 10Y Treasury | FRED | `GS10` |
| Population | World Bank | `SP.POP.TOTL` |
| Poverty headcount | World Bank | `SI.POV.DDAY` |
| Gini index | World Bank | `SI.POV.GINI` |
