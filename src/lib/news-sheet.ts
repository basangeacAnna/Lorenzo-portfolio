import { createServerFn } from "@tanstack/react-start";

// Rassegna stampa gestita da Lorenzo in autonomia tramite Google Sheet (niente più modifiche al codice
// per ogni nuovo articolo): il foglio deve essere condiviso come "Chiunque abbia il link - Visualizzatore"
// (sola lettura, mai modifica) perché questa export CSV pubblica non richiede login — è l'unico modo per
// leggerlo da un sito statico senza dover gestire credenziali Google lato server.
const SHEET_ID = "1supJKXDxkM-ZPYCLlAXGzPs6Ux6IMM05axyoqcVmdSQ";
// IMPORTANTE: per NOME della scheda ("News"), non per posizione. "export?format=csv" (senza gid) prende
// sempre la PRIMA scheda dello spreadsheet per posizione — quando è stata aggiunta una scheda di istruzioni
// prima di "News", il sito ha iniziato a leggere quella invece dei dati veri (le news sono sparite). Questo
// endpoint ("gviz") prende la scheda per nome: funziona qualunque sia il suo ordine tra le altre schede,
// basta non rinominare la scheda "News" stessa.
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=News`;

export type NewsItem = {
  title: string;
  outlet: string;
  date: string;
  excerpt: string;
  href?: string;
  img?: string;
};

// Parser CSV minimo ma corretto per i campi tra virgolette (titoli/descrizioni possono contenere virgole,
// virgolette doppie o andare a capo): split "a mano" su virgola si romperebbe su questi casi reali.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

const MONTHS_IT = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

// Il formato della colonna "Data" dipende da come Google Sheets la esporta (di solito segue il formato
// visualizzato in cella, es. "24/09/2026" in stile italiano) — parse tollerante per gg/mm/aaaa e aaaa-mm-gg.
function parseSheetDate(raw: string): Date | null {
  const s = raw.trim();
  const dmy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmy) return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
  const ymd = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymd) return new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
  return null;
}

function formatItDate(d: Date): string {
  return `${d.getDate()} ${MONTHS_IT[d.getMonth()]} ${d.getFullYear()}`;
}

export const getNewsFromSheet = createServerFn({ method: "GET" }).handler(async (): Promise<NewsItem[]> => {
  let text: string;
  try {
    const res = await fetch(CSV_URL);
    if (!res.ok) return [];
    text = await res.text();
  } catch {
    return [];
  }

  const rows = parseCsv(text);
  const dataRows = rows.slice(1); // salta l'intestazione

  const withDate = dataRows
    .map((r) => {
      const [pubblica, dataRaw, dataMostrata, outlet, title, excerpt, href, img] = r;
      return { pubblica, dataRaw, dataMostrata, outlet, title, excerpt, href, img };
    })
    .filter((r) => (r.title ?? "").trim().length > 0)
    .filter((r) => {
      const v = (r.pubblica ?? "").trim().toUpperCase();
      return v === "TRUE" || v === "VERO" || v === "SI" || v === "SÌ" || v === "1" || v === "X";
    })
    .map((r) => {
      const parsed = parseSheetDate(r.dataRaw ?? "");
      const displayDate = (r.dataMostrata ?? "").trim() || (parsed ? formatItDate(parsed) : (r.dataRaw ?? "").trim());
      const item: NewsItem = {
        title: (r.title ?? "").trim(),
        outlet: (r.outlet ?? "").trim(),
        date: displayDate,
        excerpt: (r.excerpt ?? "").trim(),
      };
      const href = (r.href ?? "").trim();
      const img = (r.img ?? "").trim();
      if (href) item.href = href;
      if (!href && img) item.img = img;
      return { item, sortKey: parsed ? parsed.getTime() : 0 };
    });

  withDate.sort((a, b) => b.sortKey - a.sortKey);
  return withDate.map((x) => x.item);
});
