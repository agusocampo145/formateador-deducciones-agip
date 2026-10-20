import { formatArs, processFile } from "./processor.js";

const fileInput = document.querySelector("#file-input");
const fileName = document.querySelector("#file-name");
const kindSelect = document.querySelector("#kind");
const processButton = document.querySelector("#process");
const downloadButton = document.querySelector("#download");
const errorBox = document.querySelector("#error-box");
const resultPanel = document.querySelector("#results");
const dropzone = document.querySelector("#dropzone");

let currentFile;
let currentResult;

function showError(error) {
  const items = error.details?.map((lineError) => `<li>${escapeHtml(lineError)}</li>`).join("") || "";
  errorBox.innerHTML = `<strong>${escapeHtml(error.message)}</strong>${items ? `<ul>${items}</ul>` : ""}`;
  errorBox.hidden = false;
  resultPanel.hidden = true;
}

function clearError() {
  errorBox.hidden = true;
  errorBox.replaceChildren();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function chooseFile(file) {
  currentFile = file;
  currentResult = undefined;
  fileName.textContent = file ? `${file.name} · ${(file.size / 1024).toFixed(1)} KB` : "TXT de retenciones o percepciones SIFERE";
  processButton.disabled = !file;
  resultPanel.hidden = true;
  clearError();
}

fileInput.addEventListener("change", () => chooseFile(fileInput.files?.[0]));
kindSelect.addEventListener("change", () => {
  currentResult = undefined;
  resultPanel.hidden = true;
});

for (const eventName of ["dragenter", "dragover"]) {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add("is-dragging");
  });
}
for (const eventName of ["dragleave", "drop"]) {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.remove("is-dragging");
  });
}
dropzone.addEventListener("drop", (event) => {
  const file = event.dataTransfer?.files?.[0];
  if (file) chooseFile(file);
});

processButton.addEventListener("click", async () => {
  if (!currentFile) return;
  clearError();
  processButton.disabled = true;
  processButton.textContent = "Analizando…";
  try {
    const contents = await currentFile.text();
    currentResult = processFile(contents, kindSelect.value);
    document.querySelector("#result-kind").textContent = currentResult.label;
    document.querySelector("#result-count").textContent = currentResult.records.length.toLocaleString("es-AR");
    document.querySelector("#result-total").textContent = formatArs(currentResult.totalCents);
    const duplicateNote = document.querySelector("#duplicate-note");
    const identifierName = currentResult.format === "retenciones" ? "certificado(s)" : "comprobante(s)";
    duplicateNote.hidden = currentResult.correctedCount === 0;
    duplicateNote.textContent = currentResult.correctedCount
      ? `Se renumeraron ${currentResult.correctedCount} ${identifierName} repetido(s) que estaban en cero. Revisá la vista previa antes de descargar.`
      : `No se encontraron ${identifierName} en cero repetidos para corregir.`;
    document.querySelector("#preview").textContent = currentResult.records.slice(0, 6).map(({ line }) => line).join("\n");
    resultPanel.hidden = false;
  } catch (error) {
    showError(error);
  } finally {
    processButton.disabled = false;
    processButton.innerHTML = 'Analizar archivo <span aria-hidden="true">→</span>';
  }
});

downloadButton.addEventListener("click", () => {
  if (!currentResult || !currentFile) return;
  const contents = new Blob([currentResult.output], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(contents);
  const link = document.createElement("a");
  link.href = url;
  link.download = currentFile.name.replace(/\.txt$/i, "") + "-corregido.txt";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
});
