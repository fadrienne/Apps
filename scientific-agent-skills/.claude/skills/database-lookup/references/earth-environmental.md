# Earth & Environmental Databases

## NOAA Climate Data Online (CDO)

**Base URL:** `https://www.ncdc.noaa.gov/cdo-web/api/v2`
**Auth:** Token in header (`token: $NOAA_TOKEN`) — free at ncdc.noaa.gov/cdo-web/token

```bash
# Available datasets
curl -H "token: $NOAA_TOKEN" "https://www.ncdc.noaa.gov/cdo-web/api/v2/datasets?limit=10"

# Stations near a location
curl -H "token: $NOAA_TOKEN" \
  "https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?locationid=CITY:US170006&limit=10"

# Daily temperature data
curl -H "token: $NOAA_TOKEN" \
  "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&stationid=GHCND:USW00094728&startdate=2023-01-01&enddate=2023-01-31&datatypeid=TMAX,TMIN&limit=100"
```

## NASA Earthdata / MODIS

**Python:** `earthaccess` library
**Portal:** `earthdata.nasa.gov`

```python
import earthaccess

# Authenticate (uses ~/.netrc or env vars)
earthaccess.login()

# Search for datasets
results = earthaccess.search_data(
    short_name="MOD11A1",        # MODIS Land Surface Temperature daily
    bounding_box=(-180, -90, 180, 90),
    temporal=("2023-01-01", "2023-01-31"),
    count=10,
)

# Download
files = earthaccess.download(results, local_path="/tmp/modis/")
```

## GBIF (Global Biodiversity Information Facility)

**Base URL:** `https://api.gbif.org/v1`
**Rate limit:** Generous; use auth for bulk downloads

```bash
# Species search
curl "https://api.gbif.org/v1/species/search?q=Quercus+robur&limit=5"

# Occurrence records
curl "https://api.gbif.org/v1/occurrence/search?scientificName=Quercus+robur&country=DE&limit=10"

# Species summary
curl "https://api.gbif.org/v1/species/5264631"
```

## OpenAQ (Air Quality)

**Base URL:** `https://api.openaq.org/v3`
**Auth:** API key header `X-API-Key: $OPENAQ_KEY` (free tier available)

```bash
# Locations with sensors
curl -H "X-API-Key: $OPENAQ_KEY" \
  "https://api.openaq.org/v3/locations?coordinates=40.71,-74.00&radius=10000&limit=10"

# Recent measurements
curl -H "X-API-Key: $OPENAQ_KEY" \
  "https://api.openaq.org/v3/locations/8118/latest"

# Historical measurements
curl -H "X-API-Key: $OPENAQ_KEY" \
  "https://api.openaq.org/v3/measurements?location_id=8118&parameter_id=2&date_from=2024-01-01&date_to=2024-01-07"
```

## USGS Water Resources

**Base URL:** `https://waterservices.usgs.gov/nwis`

```bash
# Streamflow data (JSON)
curl "https://waterservices.usgs.gov/nwis/iv/?sites=01646500&parameterCd=00060&startDT=2023-01-01&endDT=2023-01-31&format=json"

# Site information
curl "https://waterservices.usgs.gov/nwis/site/?sites=01646500&format=json"
```

## Copernicus Climate Data Store (CDS)

**Python:** `cdsapi` library
**Registration:** cds.climate.copernicus.eu

```python
import cdsapi

c = cdsapi.Client()

# ERA5 reanalysis data
c.retrieve(
    "reanalysis-era5-single-levels",
    {
        "product_type": "reanalysis",
        "variable": ["2m_temperature", "total_precipitation"],
        "year": "2023",
        "month": ["01", "02"],
        "day": [f"{d:02d}" for d in range(1, 32)],
        "time": ["00:00", "06:00", "12:00", "18:00"],
        "format": "netcdf",
    },
    "era5_jan_feb_2023.nc",
)
```

## Common Identifiers

| Entity | Identifier | Example |
|---|---|---|
| Weather station | GHCND ID | `GHCND:USW00094728` |
| NOAA location | City ID | `CITY:US170006` |
| MODIS tile | H/V grid | `h10v05` |
| Species | GBIF taxon key | `5264631` |
| Air sensor | OpenAQ location ID | `8118` |
| River gauge | USGS site | `01646500` |
| Geologic unit | Macrostrat ID | `UNIT_ID` |
