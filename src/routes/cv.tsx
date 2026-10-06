import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ReelNav, ids } from "@/components/reel-nav";

export const Route = createFileRoute("/cv")({
  head: () => ({ meta: [
    { title: "CV — Lorenzo Blaconà" },
    { name: "description", content: "Curriculum di Lorenzo Blaconà: attore, cantante, scrittore e grafico." },
  ]}),
  component: CvPage,
});

// Il CV è un PDF curato a mano dal cliente (impaginazione, grafica): mostriamo QUELLO, non una
// ricostruzione in HTML — visibile nella pagina ma senza un link "scarica" diretto. "#toolbar=0" nasconde
// la barra del visualizzatore PDF nativo del browser (incluso il bottone di download), dove supportato.
function CvPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-ink pt-28 text-paper sm:pt-16">
      <ReelNav active={ids.indexOf("bio")} />
      <div className="px-5 md:px-12 lg:px-20">
        <Link to="/" hash="bio" className="inline-flex items-center gap-2 font-display text-sm uppercase text-hot">
          <ArrowLeft className="h-4 w-4" /> Torna al portfolio
        </Link>
        <h1 className="mt-8 font-display text-5xl font-bold uppercase leading-none md:text-7xl">Curriculum.</h1>
      </div>
      <div className="mt-8 flex-1 px-5 pb-10 md:px-12 lg:px-20">
        <iframe
          src="/cv-lorenzo-blacona.pdf#toolbar=0&navpanes=0"
          title="Curriculum di Lorenzo Blaconà"
          className="h-[80vh] w-full border border-paper/20 bg-paper md:h-[85vh]"
        />
      </div>
    </main>
  );
}
