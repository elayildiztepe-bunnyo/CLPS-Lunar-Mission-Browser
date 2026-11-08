# CLPS Lunar Mission Browser · v1.2

An educational lunar south-pole mission-planning prototype. The v1.2 branch adds a local LOLA GeoTIFF terrain workflow, elevation-derived mesh preview, metadata-dependent slope sampling, and a conceptual traverse-stop planner.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Load NASA elevation data

1. Obtain a suitable south-pole LOLA DEM GeoTIFF from the NASA GSFC PDS Geosciences Node / Planetary Geodesy and Cartography Working Group resources linked in the application.
2. Use the **Load LOLA GeoTIFF** control to load a local `.tif` or `.tiff` file. The browser reads the raster locally; no raster is uploaded.
3. The application displays raster dimensions and computes its sampled elevation range.
4. To calculate slope, enter the projected pixel spacing in metres from the exact product metadata. Do not assume that a geographic-degree raster uses metres or that all LOLA products have the same resolution.

## v1.2 capabilities and limits

- Reads the first raster band of a user-selected GeoTIFF using geotiff.js.
- Generates an oblique wireframe preview from raster elevation samples.
- Computes a preliminary mean sampled slope only after the user enters pixel spacing.
- Lets the user select reference locations for a conceptual traverse sequence.
- Links NASA PGDA and PDS LOLA data catalogues.

The current build does **not** automatically download NASA data, interpret every GeoTIFF projection, perform geospatial reprojection, calculate uncertainty or coverage, generate a true 3D globe, optimize a rover-safe path, or compute date-specific sunlight / Earth-visibility / communications using SPICE. Reference coordinates and the traverse are planning placeholders. The slope estimate uses adjacent raster samples and is not a validated mobility model.

## Scientific-use notice

This is an educational research prototype, not a NASA product and not suitable for operational landing, crew safety, or mission decisions. Verify product ID/version, map projection, horizontal pixel spacing, vertical units/datum, no-data encoding, coverage, and uncertainty in the source metadata before interpreting any output. Displayed measurements are derived only from the raster file selected by the user; no illustrative values are labelled as NASA measurements.
