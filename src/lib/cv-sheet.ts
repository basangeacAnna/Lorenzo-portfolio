import { createServerFn } from "@tanstack/react-start";
import { SHEET_ID, parseCsv } from "@/lib/news-sheet";

// CV aggiornato da Lorenzo in autonomia dallo STESSO Google Sheet delle news, scheda "CV" (letta per nome,
// come "News": l'ordine delle schede non conta). Il CV resta la SUA grafica (il PDF che ha impaginato lui),
// non viene riscritto in testo: nel foglio incolla solo il link al PDF caricato su Google Drive.
// La scheda è una sola cella utile: intestazione in A1, link in A2.
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=CV`;

// ID del file da tutti i formati di link che Drive dà ("Condividi" → /file/d/ID/view, link vecchi con
// ?id=ID, /open?id=ID).
function driveFileId(link: string): string | null {
  const m = link.match(/\/d\/([\w-]{10,})/) ?? link.match(/[?&]id=([\w-]{10,})/);
  return m?.[1] ?? null;
}

// URL dell'immagine da mostrare in pagina. Per un file Drive si usa l'anteprima che Drive genera da solo
// (la prima pagina del PDF come immagine, sz=w2400 = 2400px di larghezza, leggibile anche ingrandita):
// funziona solo se il file è condiviso come "Chiunque abbia il link". Un link diretto a un'immagine
// (es. /media/nomefile.webp) viene usato così com'è.
function toImageUrl(link: string): string | null {
  const id = driveFileId(link);
  if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w2400`;
  if (/\.(webp|png|jpe?g)(\?.*)?$/i.test(link)) return link;
  return null;
}

export const getCvImageFromSheet = createServerFn({ method: "GET" }).handler(async (): Promise<string | null> => {
  let text: string;
  try {
    const res = await fetch(CSV_URL);
    if (!res.ok) return null;
    text = await res.text();
  } catch {
    return null;
  }

  const link = parseCsv(text)[1]?.[0] ?? ""; // riga 2, colonna A (la riga 1 è l'intestazione)
  const imageUrl = toImageUrl(link.trim());
  if (!imageUrl?.startsWith("https://drive.google.com/")) return imageUrl;

  // Un file Drive NON condiviso come "Chiunque abbia il link" non dà errore nel foglio, ma la sua
  // anteprima non si carica: in pagina comparirebbe un'immagine rotta. Meglio verificarlo qui e, se
  // l'anteprima non arriva davvero come immagine, ricadere sul CV di riserva.
  try {
    const res = await fetch(imageUrl, { method: "HEAD", redirect: "follow" });
    return res.ok && (res.headers.get("content-type") ?? "").startsWith("image/") ? imageUrl : null;
  } catch {
    return null;
  }
});
