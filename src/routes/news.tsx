import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ReelNav, ids } from "@/components/reel-nav";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [
    { title: "News — Lorenzo Blaconà" },
    { name: "description", content: "Ultime notizie, interviste e rassegna stampa su Lorenzo Blaconà." },
  ]}),
  component: NewsPage,
});

// Elenco vuoto per ora: qui verranno aggiunte le news via codice (o un feed esterno) in autonomia.
// Ogni voce: { title, date, excerpt, href? }
const news: { title: string; date: string; excerpt: string }[] = [];

function NewsPage() {
  return (
    <main className="relative min-h-screen bg-signal px-5 pb-16 pt-28 text-paper sm:pt-16 md:px-12 lg:px-20">
      <ReelNav active={ids.indexOf("press")} />
      <Link to="/" hash="press" className="inline-flex items-center gap-2 font-display text-sm uppercase">
        <ArrowLeft className="h-4 w-4" /> Torna al portfolio
      </Link>
      <h1 className="mt-8 font-display text-6xl font-bold uppercase leading-none md:text-8xl">News & press.</h1>
      <p className="mt-4 max-w-xl text-lg text-paper/80">Interviste, recensioni e nuove pubblicazioni su Lorenzo Blaconà.</p>

      {news.length === 0 ? (
        <p className="mt-16 max-w-md border-t border-paper/30 pt-8 text-paper/70">
          Nessuna news pubblicata ancora — questa pagina si aggiornerà a breve.
        </p>
      ) : (
        <div className="mt-16 grid gap-px bg-paper/30 border-t border-paper/30 md:grid-cols-3">
          {news.map((n) => (
            <article key={n.title} className="min-h-80 bg-signal p-7">
              <span className="text-xs uppercase">{n.date}</span>
              <h3 className="mt-4 font-display text-3xl leading-tight">{n.title}</h3>
              <p className="mt-5 text-paper/75">{n.excerpt}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
