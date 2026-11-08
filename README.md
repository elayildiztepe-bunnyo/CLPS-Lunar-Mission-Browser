# CLPS Lunar Mission Browser · v1.3

An educational lunar south-pole mission-planning prototype. The v1.2 branch adds a local LOLA GeoTIFF terrain workflow, elevation-derived mesh preview, metadata-dependent slope sampling, and a conceptual traverse-stop planner.

## Install as an app (phone and computer)

v1.3 is an installable Progressive Web App. Once deployed to GitHub Pages it opens at
`https://<github-user>.github.io/CLPS-Lunar-Mission-Browser/` and can be installed from there:

- **Android (Chrome):** tap **Install app** in the header, or ⋮ → *Install app*.
- **iPhone / iPad (Safari):** Share → *Add to Home Screen*.
- **Windows / macOS / Linux (Chrome or Edge):** click **Install app** in the header, or the install icon in the address bar.

The installed app runs in its own window and opens offline. GeoTIFF files are still read only on the device.

### Deploying to GitHub Pages

1. In the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to `main`. The workflow in `.github/workflows/deploy-pages.yml` builds `frontend/` and publishes it.
   It can also be started by hand from the **Actions** tab.

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

## v1.3 changes

- Installable app (web app manifest, icons, offline service worker); fonts are bundled instead of loaded from Google Fonts.
- Bottom tab navigation on phones and narrow windows; larger touch targets; inputs no longer trigger iOS zoom.
- Large rasters: anything above 4 million pixels is read from the GeoTIFF's built-in overview when one exists, otherwise streamed in strips and subsampled, so multi-GB DEMs no longer exhaust device memory. The effective spacing used for slope is shown.
- Slope fix: v1.2 divided the gradient by an extra factor of 20, under-reporting slope. Slope is now `atan(|∇z|)`, and cells next to no-data are skipped.
- Pixel spacing is pre-filled only when the GeoTIFF declares projected metre units (GeoKey 9001); otherwise it must be entered.
- The terrain mesh breaks at no-data cells instead of drawing a false cliff.

## v1.2 capabilities and limits

- Reads the first raster band of a user-selected GeoTIFF using geotiff.js.
- Generates an oblique wireframe preview from raster elevation samples.
- Computes a preliminary mean sampled slope only after the user enters pixel spacing.
- Lets the user select reference locations for a conceptual traverse sequence.
- Links NASA PGDA and PDS LOLA data catalogues.

The current build does **not** automatically download NASA data, interpret every GeoTIFF projection, perform geospatial reprojection, calculate uncertainty or coverage, generate a true 3D globe, optimize a rover-safe path, or compute date-specific sunlight / Earth-visibility / communications using SPICE. Reference coordinates and the traverse are planning placeholders. The slope estimate uses adjacent raster samples and is not a validated mobility model.

## Scientific-use notice

This is an educational research prototype, not a NASA product and not suitable for operational landing, crew safety, or mission decisions. Verify product ID/version, map projection, horizontal pixel spacing, vertical units/datum, no-data encoding, coverage, and uncertainty in the source metadata before interpreting any output. Displayed measurements are derived only from the raster file selected by the user; no illustrative values are labelled as NASA measurements.
