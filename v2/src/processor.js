const FORMATS = {
  retenciones: {
    name: "Retenciones",
    length: 79,
    receiptStart: 53,
    receiptWidth: 4,
    // AGIP's SIFERE TXT has an 11-character field between comprobante and importe.
    // The importe itself occupies the final 11 characters.
    amountStart: 68,
    amountWidth: 11,
  },
  percepciones: {
    name: "Percepciones",
    length: 51,
    receiptStart: 30,
    receiptWidth: 8,
    amountStart: 40,
    amountWidth: 11,
  },
};

function parseCents(field, lineNumber) {
  const amount = field.trim();
  const match = amount.match(/^(\d+),(\d{2})$/);
  if (!match) {
    throw new Error(`Línea ${lineNumber}: el importe debe terminar en coma y dos decimales.`);
  }
  return BigInt(match[1]) * 100n + BigInt(match[2]);
}

function validDate(value) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;
  const [, dd, mm, yyyy] = match;
  const date = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
  return date.getUTCFullYear() === Number(yyyy) &&
    date.getUTCMonth() === Number(mm) - 1 && date.getUTCDate() === Number(dd);
}

function detectFormat(lines) {
  const first = lines.find((line) => line.trim() !== "");
  if (!first) throw new Error("El archivo no contiene registros.");
  if (first.length === FORMATS.retenciones.length) return "retenciones";
  if (first.length === FORMATS.percepciones.length) return "percepciones";
  throw new Error(`No reconozco el formato: la primera línea tiene ${first.length} caracteres; esperaba 79 (retenciones) o 51 (percepciones).`);
}

function processFile(contents, selectedFormat = "auto") {
  if (typeof contents !== "string" || contents.length === 0) {
    throw new Error("El archivo está vacío.");
  }

  const normalized = contents.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const sourceLines = normalized.split("\n");
  const formatKey = selectedFormat === "auto" ? detectFormat(sourceLines) : selectedFormat;
  const format = FORMATS[formatKey];
  if (!format) throw new Error("Elegí Retenciones o Percepciones.");

  const records = [];
  const errors = [];
  sourceLines.forEach((line, index) => {
    if (line.trim() === "") return;
    const lineNumber = index + 1;
    try {
      if (line.length !== format.length) {
        throw new Error(`tiene ${line.length} caracteres; se esperaban ${format.length}.`);
      }
      if (!/^\d{3}\d{2}-\d{8}-\d$/.test(line.slice(0, 16))) {
        throw new Error("el código inicial o el CUIT no tiene el formato esperado.");
      }
      if (!validDate(line.slice(16, 26))) {
        throw new Error("la fecha no es válida (se espera DD/MM/AAAA).");
      }
      const comprobante = line.slice(format.receiptStart, format.receiptStart + format.receiptWidth);
      if (!/^\d+$/.test(comprobante)) {
        throw new Error("el campo comprobante debe contener solo dígitos.");
      }
      const cents = parseCents(line.slice(format.amountStart, format.amountStart + format.amountWidth), lineNumber);
      records.push({ line, lineNumber, cuit: line.slice(3, 16), comprobante, cents });
    } catch (error) {
      errors.push(error.message.startsWith("Línea ") ? error.message : `Línea ${lineNumber}: ${error.message}`);
    }
  });

  if (errors.length) {
    const error = new Error(`No se generó el archivo: hay ${errors.length} línea(s) con errores.`);
    error.details = errors;
    throw error;
  }
  if (!records.length) throw new Error("El archivo no contiene registros válidos.");

  // The approved duplicate rule applies to repeated zero receipt numbers, grouped by CUIT.
  const groups = new Map();
  const reserved = new Map();
  for (const record of records) {
    if (!reserved.has(record.cuit)) reserved.set(record.cuit, new Set());
    reserved.get(record.cuit).add(record.comprobante);
    if (/^0+$/.test(record.comprobante)) {
      const key = `${record.cuit}|${record.comprobante}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(record);
    }
  }

  let correctedCount = 0;
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const used = reserved.get(group[0].cuit);
    let candidate = 1n;
    for (const record of group.slice(1)) {
      let next;
      do {
        if (candidate >= 10n ** BigInt(format.receiptWidth)) {
          throw new Error(`No quedan números disponibles para renumerar comprobantes de ${record.cuit}.`);
        }
        next = candidate.toString().padStart(format.receiptWidth, "0");
        candidate += 1n;
      } while (used.has(next));

      const start = format.receiptStart;
      record.line = record.line.slice(0, start) + next + record.line.slice(start + format.receiptWidth);
      record.comprobante = next;
      used.add(next);
      correctedCount += 1;
    }
  }

  return {
    format: formatKey,
    label: format.name,
    records,
    correctedCount,
    totalCents: records.reduce((total, record) => total + record.cents, 0n),
    output: records.map((record) => record.line).join("\r\n"),
  };
}

function formatArs(cents) {
  const whole = cents / 100n;
  const fraction = (cents % 100n).toString().padStart(2, "0");
  const grouped = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `$ ${grouped},${fraction}`;
}

export { FORMATS, formatArs, processFile };
