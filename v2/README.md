# AGIP → SIFERE TXT tool (v2)

Static browser app for importing AGIP's SIFERE-ready TXT files, validating every row, calculating the total locally, and correcting repeated zero identifiers.

## Run locally

Serve this directory with any static web server. For example:

```sh
python3 -m http.server 4173
```

Open `http://localhost:4173`. No package installation or backend is required.

## Tests

```sh
node --test
```

## Record layouts supported

- Retenciones: 79 characters. The 16-character certificate at offsets 30–45 is checked for duplicate zero values and renumbered; fields after the type letter are preserved. The importe is read from the final 11 characters.
- Percepciones: 51 characters. The `comprobante` field has 8 digits at offsets 30–37.

Repeated all-zero identifiers are grouped by CUIT, in source row order. The first keeps its zero value and later occurrences receive the next available number at the same width. Other fields, line ordering, and amounts are preserved. Totals are accumulated as integer cents to avoid floating-point errors.

The browser does not upload imported TXT contents. The selected file remains local to the user's device. The interface accepts one TXT per run; retenciones and percepciones are processed separately. The downloaded filename ends in `-para-sifere.txt`, whether or not any identifier needed renumbering.

## Vercel

Create a Vercel project pointed at this repository with the project root set to `v2`. The files are static and need no build step.
