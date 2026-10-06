import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ReelNav, ids } from "@/components/reel-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/cv")({
  head: () => ({ meta: [
    { title: "CV — Lorenzo Blaconà" },
    { name: "description", content: "Curriculum di Lorenzo Blaconà: attore, cantante, scrittore e grafico." },
  ]}),
  component: CvPage,
});

// Il CV è un'immagine (pagina del PDF del cliente convertita in PNG ad alta risoluzione), non più un
// PDF incassato in un iframe: i visualizzatori PDF nei browser mobili sono incoerenti (a volte non
// renderizzano affatto, a volte mostrano la pagina minuscola o deformata) — una <img> con object-contain
// invece si vede sempre esattamente come un'immagine qualunque del sito, mai stirata né ingrandita a caso,
// con zoom nativo della pagina (pinch-to-zoom) per leggere i dettagli, esattamente come per le altre foto.
function CvPage() {
  return (
    <main className="relative min-h-screen bg-ink px-5 pb-16 pt-28 text-paper sm:pt-16 md:px-12 lg:px-20">
      <ReelNav active={ids.indexOf("bio")} />
      <Link to="/" hash="bio" className="inline-flex items-center gap-2 font-display text-xs uppercase text-hot sm:text-sm">
        <ArrowLeft className="h-4 w-4" /> <span className="sm:hidden">Portfolio</span><span className="hidden sm:inline">Torna al portfolio</span>
      </Link>
      <h1 className="mt-8 font-display text-4xl font-bold uppercase leading-none sm:text-6xl md:text-8xl">
        <span className="block sm:inline">Curricu</span><span className="block sm:inline">lum.</span>
      </h1>
      <img
        src="/media/cv-lorenzo-blacona.png"
        alt="Curriculum di Lorenzo Blaconà"
        className="mx-auto mt-10 w-full max-w-3xl border border-paper/20"
      />
      <SiteFooter theme="dark" />
    </main>
  );
}
