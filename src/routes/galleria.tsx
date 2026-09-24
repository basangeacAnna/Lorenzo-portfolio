import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Maximize2 } from "lucide-react";
import { ReelNav, ids } from "@/components/reel-nav";

export const Route = createFileRoute("/galleria")({
  head: () => ({ meta: [
    { title: "Galleria — Lorenzo Blaconà" },
    { name: "description", content: "Tutte le foto di Lorenzo Blaconà: scena, backstage e ritratti." },
  ]}),
  component: GalleriaPage,
});

// Tutte le foto reali non usate altrove nel sito (hero, bio, lavori e i 2 teaser della sezione Galleria
// in home): raggruppate per sessione/contesto, nell'ordine in cui compaiono nella griglia.
const photos = [
  // Laurea
  { label: "Laurea", src: "/media/laurea-ritratto-frontale-01.jpg" },
  { label: "Laurea", src: "/media/laurea-mezza-figura-02.jpg" },
  { label: "Laurea", src: "/media/laurea-ritratto-primo-piano-03.jpg" },
  { label: "Laurea", src: "/media/laurea-profilo-04.jpg" },
  { label: "Laurea", src: "/media/laurea-ritratto-sorriso-05.jpg" },
  // Concerto
  { label: "Concerto", src: "/media/concerto-voce-microfono-02.jpg" },
  { label: "Concerto", src: "/media/concerto-voce-microfono-03.jpg" },
  { label: "Concerto", src: "/media/concerto-voce-microfono-04.png" },
  // Teatro classico e monologo
  { label: "Teatro", src: "/media/teatro-classico-scena-notturna.jpg" },
  { label: "Teatro", src: "/media/teatro-monologo-primo-piano-01.jpg" },
  { label: "Teatro", src: "/media/teatro-monologo-mezza-figura-02.jpg" },
  { label: "Teatro", src: "/media/teatro-monologo-leggio-03.jpg" },
  { label: "Teatro", src: "/media/teatro-monologo-figura-intera-04.jpg" },
  { label: "Teatro", src: "/media/teatro-costume-epoca-pugnale.jpg" },
  // Editoriale / moda
  { label: "Editoriale", src: "/media/editoriale-altalena-ritratto-01.jpg" },
  { label: "Editoriale", src: "/media/editoriale-primo-piano-muro-03.jpg" },
  { label: "Editoriale", src: "/media/editoriale-profilo-citta-04.jpg" },
  // Backstage
  { label: "Backstage", src: "/media/backstage-luna-park-01.jpg" },
  { label: "Backstage", src: "/media/backstage-luna-park-02.jpg" },
  { label: "Backstage", src: "/media/backstage-set-risate.jpg" },
  // Cortometraggi
  { label: "Cortometraggio", src: "/media/cortometraggio-scena-giardino-sottotitoli.png" },
  { label: "Cortometraggio", src: "/media/cortometraggio-dialogo-occhiali.png" },
  { label: "Cortometraggio", src: "/media/cortometraggio-scena-notturna-duo.png" },
  // Red carpet
  { label: "Red carpet", src: "/media/red-carpet-milano-film-fest.jpg" },
  // Spettacolo teatrale con proiezione
  { label: "Teatro", src: "/media/teatro-dialogo-proiezione-01.jpg" },
  { label: "Teatro", src: "/media/teatro-dialogo-proiezione-02.jpg" },
  { label: "Teatro", src: "/media/teatro-dialogo-proiezione-03.jpg" },
  { label: "Teatro", src: "/media/teatro-dialogo-proiezione-05.jpg" },
  { label: "Teatro", src: "/media/teatro-dialogo-proiezione-06.jpg" },
  { label: "Teatro", src: "/media/teatro-dialogo-proiezione-07.jpg" },
  { label: "Teatro", src: "/media/teatro-dialogo-proiezione-08.jpg" },
  { label: "Teatro", src: "/media/teatro-dialogo-proiezione-09.jpg" },
  { label: "Teatro", src: "/media/teatro-dialogo-proiezione-10.jpg" },
  { label: "Teatro", src: "/media/teatro-dialogo-proiezione-11.jpg" },
  { label: "Teatro", src: "/media/teatro-dialogo-proiezione-12.jpg" },
  { label: "Teatro", src: "/media/teatro-dialogo-buio-13.jpg" },
  // Monologo in scena buia
  { label: "Teatro", src: "/media/teatro-monologo-buio-01.jpg" },
  { label: "Teatro", src: "/media/teatro-monologo-buio-02.jpg" },
  { label: "Teatro", src: "/media/teatro-monologo-buio-03.jpg" },
  { label: "Teatro", src: "/media/teatro-monologo-buio-04.jpg" },
  { label: "Teatro", src: "/media/teatro-monologo-buio-05.jpg" },
  { label: "Teatro", src: "/media/teatro-monologo-buio-06.jpg" },
  // Applausi finali e incontro col pubblico
  { label: "Teatro", src: "/media/teatro-applausi-finali-01.jpg" },
  { label: "Teatro", src: "/media/teatro-applausi-finali-02.jpg" },
  { label: "Teatro", src: "/media/teatro-incontro-pubblico.jpg" },
];

function PhotoFrame({ label, src }: { label: string; src: string }) {
  return (
    <div className="group relative min-h-72 overflow-hidden border border-paper/35 bg-muted">
      <img src={src} alt={label} className="absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute bottom-5 left-5 font-display text-xs uppercase text-paper drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">{label} · foto</div>
      <Maximize2 className="absolute right-5 top-5 h-5 w-5 text-hot transition-transform group-hover:scale-125" />
    </div>
  );
}

function GalleriaPage() {
  return (
    <main className="relative min-h-screen bg-paper px-5 pb-16 pt-28 text-ink sm:pt-16 md:px-12 lg:px-20">
      <ReelNav active={ids.indexOf("galleria")} />
      <Link to="/" hash="galleria" className="inline-flex items-center gap-2 font-display text-sm uppercase text-hot">
        <ArrowLeft className="h-4 w-4" /> Torna al portfolio
      </Link>
      <h1 className="mt-8 font-display text-6xl font-bold uppercase leading-none md:text-8xl">Tutte le foto.</h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">La galleria completa di Lorenzo Blaconà — scena, backstage e ritratti.</p>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => <PhotoFrame key={p.src} label={p.label} src={p.src} />)}
      </div>
    </main>
  );
}
