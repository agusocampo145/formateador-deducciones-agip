import { formatArs, processFile } from "./processor.js";

const fileInput = document.querySelector("#file-input");
const fileName = document.querySelector("#file-name");
const kindSelect = document.querySelector("#kind");
const processButton = document.querySelector("#process");
const downloadButton = document.querySelector("#download");
const errorBox = document.querySelector("#error-box");
const resultPanel = document.querySelector("#results");
const statusPill = document.querySelector("#status-pill");
const dropzone = document.querySelector("#dropzone");

let currentFile;
let currentResult;

function showError(error) {
  const items = error.details?.map((lineError) => `<li>${escapeHtml(lineError)}</li>`).join("") || "";
  errorBox.innerHTML = `<strong>${escapeHtml(error.message)}</strong>${items ? `<ul>${items}</ul>` : ""}`;
  errorBox.hidden = false;
  resultPanel.hidden = true;
  resultPanel.classList.remove("is-entering");
  statusPill.classList.remove("is-success");
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

function startProcessingAnimation() {
  processButton.classList.remove("is-processing");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    processButton.classList.add("is-processing");
    return Promise.resolve();
  }

  const sheet = processButton.querySelector(".process-sheet");
  const animationFinished = new Promise((resolve) => {
    let timeoutId;
    const finish = () => {
      window.clearTimeout(timeoutId);
      resolve();
    };
    sheet.addEventListener("animationend", finish, { once: true });
    timeoutId = window.setTimeout(finish, 1500);
  });
  void processButton.offsetWidth;
  processButton.classList.add("is-processing");
  return animationFinished;
}

function chooseFile(file) {
  currentFile = file;
  currentResult = undefined;
  fileName.textContent = file ? `${file.name} · ${(file.size / 1024).toFixed(1)} KB` : "TXT de retenciones o percepciones SIFERE";
  processButton.disabled = !file;
  resultPanel.hidden = true;
  resultPanel.classList.remove("is-entering");
  statusPill.classList.remove("is-success");
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
  const files = event.dataTransfer?.files;
  if (files?.length > 1) {
    showError(new Error("Cargá un solo TXT por vez. Retenciones y percepciones se procesan por separado."));
    return;
  }
  if (files?.[0]) chooseFile(files[0]);
});

processButton.addEventListener("click", async () => {
  if (!currentFile) return;
  clearError();
  processButton.disabled = true;
  processButton.setAttribute("aria-busy", "true");
  processButton.setAttribute("aria-label", "Procesando archivo");
  const animationFinished = startProcessingAnimation();
  try {
    const contents = await currentFile.text();
    currentResult = processFile(contents, kindSelect.value);
    document.querySelector("#result-kind").textContent = currentResult.label;
    document.querySelector("#result-count").textContent = currentResult.records.length.toLocaleString("es-AR");
    document.querySelector("#result-total").textContent = formatArs(currentResult.totalCents);
    const duplicateNote = document.querySelector("#duplicate-note");
    const identifierName = currentResult.format === "retenciones" ? "certificado(s)" : "comprobante(s)";
    duplicateNote.hidden = false;
    duplicateNote.textContent = currentResult.correctedCount
      ? `Se renumeraron ${currentResult.correctedCount} ${identifierName} repetido(s) que estaban en cero. Revisá la vista previa antes de descargar.`
      : `No hubo ${identifierName} repetido(s) en cero para renumerar. El contenido del archivo se conserva.`;
    document.querySelector("#preview").textContent = currentResult.records.slice(0, 6).map(({ line }) => line).join("\n");
    await animationFinished;
    resultPanel.classList.remove("is-entering");
    statusPill.classList.remove("is-success");
    resultPanel.hidden = false;
    void resultPanel.offsetWidth;
    resultPanel.classList.add("is-entering");
    statusPill.classList.add("is-success");
  } catch (error) {
    await animationFinished;
    showError(error);
  } finally {
    processButton.disabled = false;
    processButton.classList.remove("is-processing");
    processButton.removeAttribute("aria-busy");
    processButton.removeAttribute("aria-label");
  }
});

downloadButton.addEventListener("click", () => {
  if (!currentResult || !currentFile) return;
  const contents = new Blob([currentResult.output], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(contents);
  const link = document.createElement("a");
  link.href = url;
  link.download = currentFile.name.replace(/\.txt$/i, "") + "-para-sifere.txt";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
});
