import test from "node:test";
import assert from "node:assert/strict";
import { formatArs, processFile } from "../src/processor.js";

function perception({ cuit = "30-12345678-9", date = "04/09/2026", agent = "6622", receipt = "00000000", type = "R ", amount = "00000581,84" } = {}) {
  return `901${cuit}${date}${agent}${receipt}${type}${amount}`;
}

function retention({ cuit = "30-12345678-9", date = "30/09/2026", agent = "3001", certificate = "0000000000000000", type = "O ", receipt = "0000", amount = "581,84" } = {}) {
  return `901${cuit}${date}${agent}${certificate}${type}00000${receipt}00000000000${amount.padStart(11, "0")}`;
}

test("detects and renumbers duplicated zero perception numbers while preserving other fields", () => {
  const first = perception();
  const second = perception({ agent: "9722", date: "30/09/2026", amount: "00114163,55" });
  const result = processFile(`${first}\r\n${second}`);
  assert.equal(result.format, "percepciones");
  assert.equal(result.correctedCount, 1);
  assert.equal(result.records[0].line, first);
  assert.equal(result.records[1].line.slice(30, 38), "00000001");
  assert.equal(result.records[1].line.slice(38), second.slice(38));
  assert.equal(result.totalCents, 11474539n);
});

test("changes only the duplicate field and preserves BOM, blank lines, line endings and final newline", () => {
  const first = perception();
  const second = perception({ agent: "9722", date: "30/09/2026" });
  const source = `\uFEFF${first}\r\n\r\n${second}\r\n`;
  const updatedSecond = second.slice(0, 30) + "00000001" + second.slice(38);

  const result = processFile(source);

  assert.equal(result.output, `\uFEFF${first}\r\n\r\n${updatedSecond}\r\n`);
});

test("leaves an unchanged file byte-for-byte identical", () => {
  const source = `\uFEFF${perception({ receipt: "00000017" })}\r\n`;
  assert.equal(processFile(source).output, source);
});

test("renumbers duplicate zero certificate numbers without touching fields after the type", () => {
  const first = retention();
  const second = retention({ amount: "1260,00" });
  const result = processFile(`${first}\n${second}`, "retenciones");
  assert.equal(result.correctedCount, 1);
  assert.equal(result.records[0].line.slice(30, 46), "0000000000000000");
  assert.equal(result.records[1].line.slice(30, 46), "0000000000000001");
  assert.equal(result.records[1].line.slice(46), second.slice(46));
  assert.equal(result.totalCents, 184184n);
});

test("reads AGIP retention amounts from the final 11-character field", () => {
  const sample = [
    "90130-50053085-130/09/202630010000000000004231O 0000000000000008098600257853,33",
    "90130-52532274-922/09/202640000000202600086707O 0000000000000000424200001260,00",
    "90130-52532274-922/09/202640000000202600086748O 0000000000000000433400113400,00",
    "90130-52532274-928/09/202640000000202600086848O 0000000000000000475400233240,00",
    "90130-65511804-330/09/202630000000000000000973O 0000000000000001543700231699,95",
    "90130-68731043-415/09/202640945688000000210258O 0000000000000000045500093949,24",
  ].join("\n");
  const result = processFile(sample);
  assert.equal(result.format, "retenciones");
  assert.deepEqual(result.records.map(({ cents }) => cents), [
    25785333n, 126000n, 11340000n, 23324000n, 23169995n, 9394924n,
  ]);
  assert.equal(result.totalCents, 93140252n);
  assert.equal(result.correctedCount, 0);
  assert.deepEqual(result.records.slice(1, 4).map(({ line }) => line.slice(30, 46)), [
    "0000202600086707", "0000202600086748", "0000202600086848",
  ]);
  assert.equal(result.records[1].line.slice(46), sample.split("\n")[1].slice(46));
});

test("duplicate zero sequences restart for a different CUIT", () => {
  const a = perception();
  const b = perception({ cuit: "30-87654321-0", agent: "8365" });
  const result = processFile(`${a}\n${b}`);
  assert.equal(result.records[0].line.slice(30, 38), "00000000");
  assert.equal(result.records[1].line.slice(30, 38), "00000000");
  assert.equal(result.correctedCount, 0);
});

test("avoids assigning a number already present on a nonzero comprobante", () => {
  const zeroA = perception();
  const existingOne = perception({ receipt: "00000001", agent: "8365" });
  const zeroB = perception({ agent: "9722" });
  const result = processFile(`${zeroA}\n${existingOne}\n${zeroB}`);
  assert.equal(result.records[2].line.slice(30, 38), "00000002");
  assert.equal(result.records[1].line, existingOne);
  assert.equal(result.records.every((record) => record.line.length === 51), true);
});

test("rejects malformed rows as a batch and reports the source line", () => {
  assert.throws(() => processFile(`${perception()}\nnot a SIFERE row`), (error) => {
    assert.match(error.message, /No se generó el archivo/);
    assert.match(error.details[0], /Línea 2/);
    return true;
  });
});

test("sums comma decimals exactly in Argentine currency format", () => {
  assert.equal(formatArs(123456789n), "$ 1.234.567,89");
});

test("detects ARBA perceptions and numbers zero comprobantes across the file", () => {
  const sample = [
    "0290230-50000845-414/09/20260000000000000000000000000O 000000000340,00",
    "0290230-50000845-415/09/20260000000000000000000000000O 000000000988,11",
    "0290230-50000845-411/09/20260000000000000000000000000O 000000002557,29",
    "0290233-99924210-924/09/20260000000000000000000000000O 000000048257,74",
    "0290230-50000845-424/09/20260000000000000000000000000O 000000000358,72",
    "0290230-50000845-416/09/20260000000000000000000000000O 000000001144,00",
  ].join("\r\n");
  const result = processFile(sample);
  assert.equal(result.format, "arba-percepciones");
  assert.equal(result.correctedCount, 5);
  assert.deepEqual(result.records.map(({ line }) => line.slice(28, 53)), [
    "0000000000000000000000000",
    "0000000000000000000000001",
    "0000000000000000000000002",
    "0000000000000000000000003",
    "0000000000000000000000004",
    "0000000000000000000000005",
  ]);
  assert.equal(result.totalCents, 5364586n);
  assert.equal(result.records[1].line.slice(53), sample.split("\r\n")[1].slice(53));
  assert.equal(result.output, result.records.map(({ line }) => line).join("\r\n"));
});

test("detects ARBA retentions, totals the final amount and preserves nonzero identifiers", () => {
  const sample = [
    "0190230-71666176-410/09/20260000100000000000000000165O 00000000000000210761000000041695,23",
    "0190230-68865335-115/09/20260000100000000000000000530O 00000000000000212967000000105445,65",
  ].join("\n");
  const result = processFile(sample);
  assert.equal(result.format, "arba-retenciones");
  assert.equal(result.correctedCount, 0);
  assert.equal(result.totalCents, 14714088n);
  assert.equal(result.output, sample);
});
