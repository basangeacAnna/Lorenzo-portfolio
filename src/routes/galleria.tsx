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

// Segnaposto: quando le foto vere saranno disponibili, basta sostituire questo array con i percorsi reali
// (es. "/media/scena-01.jpg") e passarli a PhotoFrame come immagine invece che come solo testo.
const photos = [
  "Scena 01", "Ritratto 02", "Backstage 03", "Performance 04",
  "Scena 05", "Ritratto 06", "Backstage 07", "Performance 08",
];

function PhotoFrame({ label }: { label: string }) {
  return (
    <div className="group relative min-h-72 overflow-hidden border border-paper/35 bg-muted">
      <div className="absolute inset-4 border border-dashed border-paper/20" />
      <div className="absolute bottom-5 left-5 font-display text-xs uppercase text-muted-foreground">{label} · foto</div>
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
        {photos.map((label) => <PhotoFrame key={label} label={label} />)}
      </div>
    </main>
  );
}
