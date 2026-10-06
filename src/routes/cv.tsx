import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ReelNav, ids } from "@/components/reel-nav";

export const Route = createFileRoute("/cv")({
  head: () => ({ meta: [
    { title: "CV — Lorenzo Blaconà" },
    { name: "description", content: "Curriculum di Lorenzo Blaconà: attore, cantante, scrittore e grafico." },
  ]}),
  component: CvPage,
});

// Il CV è un PDF curato a mano dal cliente (impaginazione, grafica): mostriamo QUELLO, non una
// ricostruzione in HTML. Intestazione ridotta al minimo (niente più titolo enorme a piena pagina) per
// lasciare il MASSIMO spazio verticale possibile al visualizzatore — "deve vedersi a pagina intera", non
// uno spazio ridotto dove scrollare dentro un riquadro piccolo. L'iframe nativo da solo non basta su tutti
// i telefoni (il supporto PDF-in-iframe è incoerente, specie su Safari/Chrome mobile): "Apri a schermo
// intero" apre lo stesso file nel visualizzatore nativo del browser a piena pagina, che su mobile offre
// zoom e scroll molto più comodi di qualunque iframe incassato nella pagina.
function CvPage() {
  return (
    <main className="relative flex h-screen flex-col overflow-hidden bg-ink pt-20 text-paper sm:pt-14">
      <ReelNav active={ids.indexOf("bio")} />
      {/* Niente "justify-between" che spinge il bottone fino al bordo destro: proprio lì finisce la
          bobina fissa (stesso errore già evitato altrove sul sito, es. "Vedi tutte le foto" in Galleria,
          spostato per lo stesso motivo) — qui il bottone resta impilato sotto, mai alla destra dello schermo. */}
      <div className="shrink-0 px-5 pb-4 md:px-12 lg:px-20">
        <Link to="/" hash="bio" className="inline-flex items-center gap-2 font-display text-xs uppercase text-hot sm:text-sm">
          <ArrowLeft className="h-4 w-4" /> <span className="sm:hidden">Portfolio</span><span className="hidden sm:inline">Torna al portfolio</span>
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <h1 className="font-display text-2xl font-bold uppercase leading-none sm:text-3xl">Curriculum.</h1>
          <a
            href="/cv-lorenzo-blacona.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-none bg-hot px-5 py-2.5 font-display text-sm uppercase text-ink transition-colors hover:bg-paper"
          >
            Apri a schermo intero <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="min-h-0 flex-1 px-5 pb-5 md:px-12 lg:px-20">
        <iframe
          src="/cv-lorenzo-blacona.pdf#toolbar=0&navpanes=0&view=FitH"
          title="Curriculum di Lorenzo Blaconà"
          className="h-full w-full border border-paper/20 bg-paper"
        />
      </div>
    </main>
  );
}
