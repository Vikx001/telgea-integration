// src/web/main.ts 
import { soapToNormalized } from '../converters/soapToNormalized';
import { restToNormalized } from '../converters/restToNormalized';

const file   = document.getElementById('file')      as HTMLInputElement;
const rawBox = document.getElementById('raw')       as HTMLTextAreaElement;
const outBox = document.getElementById('out')       as HTMLPreElement;
const dlBtn  = document.getElementById('download')  as HTMLAnchorElement;

// remember which converter we last used (needed for live-editing)
let lastWasXML = false;

/* helpers  */
async function convert(text: string): Promise<string> {
  if (!text.trim()) {
    dlBtn.hidden = true;
    return '—';
  }

  try {
    const parsed = lastWasXML
      ? await soapToNormalized(text)
      : restToNormalized(JSON.parse(text));

    // enable download
    const blob = new Blob(
      [JSON.stringify(parsed, null, 2)],
      { type: 'application/json' }
    );
    dlBtn.href   = URL.createObjectURL(blob);
    dlBtn.hidden = false;

    return JSON.stringify(parsed, null, 2);
  } catch (err) {
    dlBtn.hidden = true;
    return ` ${(err as Error).message}`;
  }
}

/* debounce utility (30 loc)  */
function debounce<F extends (...args: any[]) => void>(fn: F, ms = 300) {
  let id: number;
  return (...args: Parameters<F>) => {
    clearTimeout(id);
    id = window.setTimeout(() => fn(...args), ms);
  };
}

/* live-editing */
rawBox.addEventListener('input', debounce(async () => {
  // on edit, re-detect JSON vs XML
  lastWasXML = rawBox.value.trimStart().startsWith('<');
  outBox.textContent = await convert(rawBox.value);
}, 300));

/*  file-upload */
file.addEventListener('change', async e => {
  const blob = (e.target as HTMLInputElement).files?.[0];
  if (!blob) return;

  const text = await blob.text();
  rawBox.value = text;

  // detect XML by content, not just extension
  lastWasXML = text.trimStart().startsWith('<');
  outBox.textContent = await convert(text);
});
