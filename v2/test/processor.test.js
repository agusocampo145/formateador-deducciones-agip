import test from "node:test";
import assert from "node:assert/strict";
import { formatArs, processFile } from "../src/processor.js";

function perception({ cuit = "30-12345678-9", date = "04/09/2026", agent = "6622", receipt = "00000000", type = "R ", amount = "00000581,84" } = {}) {
  return `901${cuit}${date}${agent}${receipt}${type}${amount}`;
}

function retention({ cuit = "30-12345678-9", date = "30/09/2026", agent = "3001", certificate = "0000000000004231", type = "O ", receipt = "0000", amount = "581,84" } = {}) {
  return `901${cuit}${date}${agent}${certificate}${type}00000${receipt}${amount.padStart(22, "0")}`;
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

test("renumbers duplicate zero retention numbers even when certificate values differ", () => {
  const first = retention();
  const second = retention({ certificate: "0000000000004232", amount: "1260,00" });
  const result = processFile(`${first}\n${second}`, "retenciones");
  assert.equal(result.correctedCount, 1);
  assert.equal(result.records[0].line.slice(53, 57), "0000");
  assert.equal(result.records[1].line.slice(53, 57), "0001");
  assert.equal(result.records[1].line.slice(30, 53), second.slice(30, 53));
  assert.equal(result.totalCents, 184184n);
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
