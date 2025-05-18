"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/web/main.ts -----------------------------------------------------------
const soapToNormalized_1 = require("../converters/soapToNormalized");
const restToNormalized_1 = require("../converters/restToNormalized");
const file = document.getElementById('file');
const rawBox = document.getElementById('raw');
const outBox = document.getElementById('out');
const dlBtn = document.getElementById('download');
// remember which converter we last used (needed for live-editing)
let lastWasXML = false;
/* --------------------------- helpers ------------------------------------ */
async function convert(text) {
    if (!text.trim()) {
        dlBtn.hidden = true;
        return '—';
    }
    try {
        const parsed = lastWasXML
            ? await (0, soapToNormalized_1.soapToNormalized)(text)
            : (0, restToNormalized_1.restToNormalized)(JSON.parse(text));
        // enable download
        const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' });
        dlBtn.href = URL.createObjectURL(blob);
        dlBtn.hidden = false;
        return JSON.stringify(parsed, null, 2);
    }
    catch (err) {
        dlBtn.hidden = true;
        return ` ${err.message}`;
    }
}
/* ---------------------- debounce utility (30 loc) ----------------------- */
function debounce(fn, ms = 300) {
    let id;
    return (...args) => {
        clearTimeout(id);
        id = window.setTimeout(() => fn(...args), ms);
    };
}
/* ------------------------ live-editing logic ---------------------------- */
rawBox.addEventListener('input', debounce(async () => {
    // on edit, re-detect JSON vs XML
    lastWasXML = rawBox.value.trimStart().startsWith('<');
    outBox.textContent = await convert(rawBox.value);
}, 300));
/* ------------------------- file-upload logic ---------------------------- */
file.addEventListener('change', async (e) => {
    var _a;
    const blob = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!blob)
        return;
    const text = await blob.text();
    rawBox.value = text;
    // detect XML by content, not just extension
    lastWasXML = text.trimStart().startsWith('<');
    outBox.textContent = await convert(text);
});
