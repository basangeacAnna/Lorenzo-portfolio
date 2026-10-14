import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Maximize2 } from "lucide-react";
import { useState } from "react";
import { ReelNav, ids } from "@/components/reel-nav";
import { Lightbox } from "@/components/lightbox";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/galleria")({
  head: () => ({ meta: [
    { title: "Galleria — Lorenzo Blaconà" },
    { name: "description", content: "Tutte le foto di Lorenzo Blaconà: scena, backstage e ritratti." },
  ]}),
  component: GalleriaPage,
});

// Due gruppi "di evento" (griglia pulita, 3 scatti i più diversi fra loro ciascuno — niente laurea né
// doppioni) + un terzo gruppo "personale" trattato in modo diverso (collage, vedi sotto): non cartelle
// o filtri, ma una sezione visivamente distinta per dare un'idea di Lorenzo a chi apre il sito per la
// prima volta, invece della solita griglia uniforme.
const eventi: { titolo: string; foto: { label: string; src: string; pos?: "top" }[] }[] = [
  {
    // Spettacolo più recente in ordine cronologico (dopo quello di Teatro Utile 2026 qui sotto): per
    // questo va per primo, stessa logica "più recente in cima" già usata per le altre categorie eventi.
    titolo: "Cosa desideri? Al TeCa",
    foto: [
      { label: "Mezzo busto", src: "/media/cosa-desideri-mezzo-busto.webp" },
      { label: "Dialogo in scena", src: "/media/cosa-desideri-dialogo.webp" },
      { label: "Sul palco con la band", src: "/media/cosa-desideri-canzone.webp" },
    ],
  },
  {
    titolo: "Teatro Filodrammatici 2026",
    foto: [
      { label: "In scena con l'altro attore", src: "/media/teatro-dialogo-proiezione-01.webp" },
      { label: "Monologo", src: "/media/teatro-monologo-buio-01.webp" },
      { label: "Applausi finali", src: "/media/teatro-applausi-finali-01.webp" },
    ],
  },
  {
    // Spettacolo "Brasserie", 2025 — stesso formato della serie "monologo" sopra ma un'annata diversa:
    // 3 scatti "teatro-monologo" (non della serie "buio", quella appartiene al 2026), stesso numero di
    // foto delle altre categorie qui sotto — "al leggio" tolta perché troppo simile a "mezza figura".
    // Esclusivi di questa categoria: tolti da ogni altro punto del sito dove comparivano prima (Book da
    // attore, galleria personale, teaser home) e sostituiti lì con altre foto.
    titolo: "Teatro Filodrammatici 2025",
    // pos: "top" — questi 3 scatti sono ritratti stretti col viso vicino alla cima: col ritaglio
    // centrato di default la testa spariva. Non è un problema di TUTTE le foto (es. quelle del concerto
    // sotto hanno il soggetto in basso, "top" le romperebbe allo stesso modo all'opposto) — per questo il
    // posizionamento del ritaglio è per-foto, non una regola unica per tutta la griglia.
    foto: [
      { label: "Primo piano", src: "/media/teatro-monologo-primo-piano-01.webp", pos: "top" },
      { label: "Mezza figura", src: "/media/teatro-monologo-mezza-figura-02.webp", pos: "top" },
      { label: "Figura intera", src: "/media/teatro-monologo-figura-intera-04.webp", pos: "top" },
    ],
  },
  {
    titolo: "Concerto per la prevenzione",
    foto: [
      { label: "Voce e microfono", src: "/media/concerto-voce-microfono-02.webp" },
      { label: "Voce e microfono", src: "/media/concerto-voce-microfono-03.webp" },
      { label: "Voce e microfono", src: "/media/concerto-voce-microfono-04.webp" },
    ],
  },
];

// Book da attore trattato a parte (non nella griglia "eventi" sopra): le 5 foto condivise dal cliente
// (shooting vero da book, sfondo neutro) sono TUTTE esattamente nello stesso formato 2:3 — niente ritaglio
// forzato come nella griglia eventi, si vedono intere alla loro proporzione originale, affiancate "a mo di
// collage" ma ordinate (niente rotazioni come nel collage "Lorenzo" qui sotto), sempre centrate.
const bookDaAttore = [
  { label: "Primo piano, barba", src: "/media/book-primo-piano-barba.webp" },
  { label: "Primo piano, ragazzo", src: "/media/book-primo-piano-ragazzo.webp" },
  { label: "Figura intera, ragazzo", src: "/media/book-figura-intera-ragazzo.webp" },
  { label: "Figura intera, camicia casual", src: "/media/catalogo-casual-camicia-quadri.webp" },
  { label: "Mezzo busto, barba", src: "/media/book-mezzo-busto-barba.webp" },
];

// Galleria personale: un set più ampio e vario (studio, editoriale, red carpet, primi piani, mezzi busti)
// pensato per chi non conosce ancora Lorenzo — soprattutto per chi valuta di lavorarci come attore, quindi
// deve vedergli bene il viso ed espressioni diverse, non solo foto a figura intera o a sfondo neutro.
// Collage stile polaroid: dimensioni, rotazioni e sfalsamenti diversi per ogni scatto invece della griglia
// ordinata usata sopra.
// Solo foto casual, niente teatro. "Backstage luna park" 2 tolta (era la stessa scena della 1, doppione
// vero e proprio — nessuna sostituzione, non ne serve una seconda). "Casual sorriso" e l'ultima foto
// sostituite con altre due mai usate altrove sul sito.
const personali = [
  { label: "Red carpet", src: "/media/red-carpet-milano-film-fest.webp" },
  { label: "Editoriale notturno", src: "/media/editoriale-luce-blu-notturno.webp" },
  { label: "Primo piano, muro", src: "/media/editoriale-primo-piano-muro-03.webp" },
  { label: "Backstage luna park", src: "/media/backstage-luna-park-01.webp" },
  { label: "Ritratto studio", src: "/media/ritratto-studio-giacca-occhiali.webp" },
  { label: "Editoriale, profilo città", src: "/media/editoriale-profilo-citta-04.webp" },
  { label: "Dialogo, cortometraggio", src: "/media/cortometraggio-dialogo-occhiali.webp" },
];

// "Lorenzo" per primo, poi gli eventi, poi il book (stesso ordine della pagina): l'indice nel Lightbox
// deve seguire lo stesso ordine di visualizzazione.
const allPhotos = [...personali, ...eventi.flatMap((g) => g.foto), ...bookDaAttore].map((p) => p.src);

// Sfalsamento verticale RIDOTTO (era 0-4rem, lasciava vuoti vistosi sotto le foto più "alte" della riga):
// range più stretto (0-1.75rem) così lo spazio tra una riga e l'altra resta omogeneo — la rotazione
// (che non "mangia" spazio, solo inclina) resta invece ampia per il look "sparpagliato".
const POLAROID_ROTATE = ["-5deg", "4deg", "-3deg", "6deg", "-4deg", "3deg"];
const POLAROID_SHIFT = ["0.5rem", "1.5rem", "0rem", "1.75rem", "1rem", "1.25rem"];
const POLAROID_WIDTH = ["w-56 sm:w-64", "w-60 sm:w-68", "w-52 sm:w-60", "w-60 sm:w-68", "w-56 sm:w-64", "w-52 sm:w-60"];

// pos per-foto (non una regola unica per tutta la griglia): i ritratti stretti col viso vicino alla cima
// hanno bisogno di "top" (altrimenti il ritaglio centrato tagliava via la testa), ma le foto dove il
// soggetto è più in basso nell'inquadratura (es. concerto, molto spazio vuoto sopra) si rompono allo
// stesso modo con "top" — lì va bene il default "center" di prima.
function PhotoFrame({ label, src, pos = "center", onOpen }: { label: string; src: string; pos?: "center" | "top" | undefined; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Apri foto: ${label}`}
      className="group relative block min-h-72 w-full overflow-hidden border border-paper/35 bg-muted text-left"
    >
      <img src={src} alt={label} className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${pos === "top" ? "object-top" : "object-center"}`} />
      <Maximize2 className="absolute right-5 top-5 h-5 w-5 text-hot opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

// Book da attore: le 5 foto sono tutte esattamente nel formato 2:3 (verificato), quindi un contenitore
// con la stessa proporzione le mostra INTERE, senza alcun ritaglio — "a grandezza originale". Affiancate
// strette (gap minimo, "incastrate a mo di collage") ma dritte e allineate, non sparse come "Lorenzo".
function BookPhotoFrame({ label, src, onOpen }: { label: string; src: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Apri foto: ${label}`}
      className="group relative block aspect-[2/3] h-72 overflow-hidden border border-paper/35 bg-muted text-left sm:h-80 md:h-96"
    >
      <img src={src} alt={label} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <Maximize2 className="absolute right-3 top-3 h-5 w-5 text-hot opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

function GalleriaPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <main className="relative min-h-screen bg-paper px-5 pb-16 pt-28 text-ink sm:pt-16 md:px-12 lg:px-20">
      <ReelNav active={ids.indexOf("galleria")} />
      <Link to="/" hash="galleria" className="inline-flex items-center gap-2 font-display text-xs uppercase text-hot sm:text-sm">
        <ArrowLeft className="h-4 w-4" /> <span className="sm:hidden">Portfolio</span><span className="hidden sm:inline">Torna al portfolio</span>
      </Link>
      <h1 className="mt-8 font-display text-6xl font-bold uppercase leading-none md:text-8xl">Tutte le foto.</h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">La galleria completa di Lorenzo Blaconà — scena, backstage e ritratti. Clicca una foto per ingrandirla e scorri tra le altre senza uscire.</p>

      {/* Galleria personale per prima (prima di scendere nei singoli eventi): niente griglia uniforme —
          un collage sparso stile polaroid, per dare subito un'idea di Lorenzo a chi apre il sito per la
          prima volta, invece di partire da un singolo evento specifico. */}
      <div className="mt-14">
        <h2 className="font-display text-2xl font-bold uppercase text-hot">Lorenzo</h2>
        {/* justify-center SEMPRE (prima da sm in su diventava justify-start, spostando il mucchio a
            sinistra/non centrato): il collage deve restare centrato a ogni larghezza di schermo. */}
        <div className="mt-8 flex flex-wrap items-start justify-center gap-x-6 gap-y-8 py-6">
          {personali.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setLightboxIndex(i)}
              aria-label={`Apri foto: ${p.label}`}
              className={`group relative block ${POLAROID_WIDTH[i % POLAROID_WIDTH.length]} bg-ink p-3 pb-8 text-left shadow-xl transition-transform duration-300 hover:z-10 hover:scale-105`}
              style={{
                transform: `rotate(${POLAROID_ROTATE[i % POLAROID_ROTATE.length]})`,
                marginTop: POLAROID_SHIFT[i % POLAROID_SHIFT.length],
              }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                <img src={p.src} alt={p.label} className="absolute inset-0 h-full w-full object-cover" />
                <Maximize2 className="absolute right-2 top-2 h-4 w-4 text-hot opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {eventi.map((g, gi) => {
        const offset = personali.length + eventi.slice(0, gi).reduce((n, e) => n + e.foto.length, 0);
        return (
          <div key={g.titolo} className="mt-20">
            <h2 className="font-display text-2xl font-bold uppercase text-hot">{g.titolo}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.foto.map((p, i) => (
                <PhotoFrame key={p.src} label={p.label} src={p.src} pos={p.pos} onOpen={() => setLightboxIndex(offset + i)} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Book da attore: niente griglia a ritaglio fisso come sopra — foto intere, affiancate strette e
          centrate, ordinate (vedi BookPhotoFrame). */}
      <div className="mt-20">
        <h2 className="font-display text-2xl font-bold uppercase text-hot">Book da attore</h2>
        <div className="mt-5 flex flex-wrap justify-center gap-1">
          {bookDaAttore.map((p, i) => {
            const offset = personali.length + eventi.reduce((n, e) => n + e.foto.length, 0);
            return (
              <BookPhotoFrame key={p.src} label={p.label} src={p.src} onOpen={() => setLightboxIndex(offset + i)} />
            );
          })}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox photos={allPhotos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      )}

      <SiteFooter theme="light" />
    </main>
  );
}
