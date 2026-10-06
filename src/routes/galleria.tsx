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
const eventi = [
  {
    titolo: "Spettacolo del 14 settembre",
    foto: [
      { label: "In scena con l'altro attore", src: "/media/teatro-dialogo-proiezione-01.jpg" },
      { label: "Monologo", src: "/media/teatro-monologo-buio-01.jpg" },
      { label: "Applausi finali", src: "/media/teatro-applausi-finali-01.jpg" },
    ],
  },
  {
    titolo: "Concerto per la prevenzione",
    foto: [
      { label: "Voce e microfono", src: "/media/concerto-voce-microfono-02.jpg" },
      { label: "Voce e microfono", src: "/media/concerto-voce-microfono-03.jpg" },
      { label: "Voce e microfono", src: "/media/concerto-voce-microfono-04.png" },
    ],
  },
];

// Galleria personale: un set più ampio e vario (studio, editoriale, red carpet, backstage) pensato per
// chi non conosce ancora Lorenzo — non solo "foto a sfondo neutro". Collage stile polaroid: dimensioni,
// rotazioni e sfalsamenti diversi per ogni scatto invece della griglia ordinata usata sopra.
const personali = [
  { label: "Ritratto studio", src: "/media/ritratto-studio-giacca-occhiali.jpg" },
  { label: "Red carpet", src: "/media/red-carpet-milano-film-fest.jpg" },
  { label: "Editoriale", src: "/media/editoriale-primo-piano-muro-03.jpg" },
  { label: "Catalogo", src: "/media/catalogo-casual-camicia-quadri.jpg" },
  { label: "Editoriale", src: "/media/editoriale-profilo-citta-04.jpg" },
];

// "Lorenzo" per primo (ordine di visualizzazione): l'indice nel Lightbox deve seguire lo stesso ordine,
// quindi qui personali viene prima nell'elenco piatto.
const allPhotos = [...personali, ...eventi.flatMap((g) => g.foto)].map((p) => p.src);

// Più sparpagliate ("ma sempre con ordine"): range di rotazione e sfalsamento verticale più ampio di
// prima, non però casuale/accavallato — restano in fila leggibile da sinistra a destra.
const POLAROID_ROTATE = ["-5deg", "4deg", "-3deg", "6deg", "-4deg", "3deg"];
const POLAROID_SHIFT = ["0.5rem", "3.25rem", "0rem", "4rem", "1.5rem", "2.75rem"];
const POLAROID_WIDTH = ["w-56 sm:w-64", "w-64 sm:w-72", "w-52 sm:w-60", "w-68 sm:w-80", "w-60 sm:w-68", "w-56 sm:w-64"];

function PhotoFrame({ label, src, onOpen }: { label: string; src: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Apri foto: ${label}`}
      className="group relative block min-h-72 w-full overflow-hidden border border-paper/35 bg-muted text-left"
    >
      <img src={src} alt={label} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <Maximize2 className="absolute right-5 top-5 h-5 w-5 text-hot opacity-0 transition-opacity group-hover:opacity-100" />
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
        <div className="mt-8 flex flex-wrap items-start justify-center gap-x-8 gap-y-12 py-6 sm:justify-start">
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
                <PhotoFrame key={p.src} label={p.label} src={p.src} onOpen={() => setLightboxIndex(offset + i)} />
              ))}
            </div>
          </div>
        );
      })}

      {lightboxIndex !== null && (
        <Lightbox photos={allPhotos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      )}

      <SiteFooter theme="light" />
    </main>
  );
}
