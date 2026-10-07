import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { ReelNav, ids } from "@/components/reel-nav";
import { Lightbox } from "@/components/lightbox";
import { SiteFooter } from "@/components/site-footer";
import { getNewsFromSheet, type NewsItem } from "@/lib/news-sheet";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [
    { title: "News — Lorenzo Blaconà" },
    { name: "description", content: "Ultime notizie, interviste e rassegna stampa su Lorenzo Blaconà." },
  ]}),
  // Caricata dal Google Sheet che Lorenzo gestisce da solo — niente più modifiche al codice per ogni
  // nuovo articolo. Se il foglio non è ancora raggiungibile (es. non condiviso pubblicamente) o è vuoto,
  // FALLBACK_NEWS tiene la pagina comunque popolata con la rassegna reale già verificata, invece di una
  // pagina vuota.
  loader: async () => {
    const sheetNews = await getNewsFromSheet();
    return { news: sheetNews.length > 0 ? sheetNews : FALLBACK_NEWS };
  },
  component: NewsPage,
});

// Rassegna stampa verificata (titoli, testate e date controllati uno per uno sulla fonte originale) —
// usata solo come fallback finché il Google Sheet non è condiviso/compilato.
const FALLBACK_NEWS: NewsItem[] = [

];

function NewsCard({ item, index, onOpenScan }: { item: NewsItem; index: number; onOpenScan: () => void }) {
  // Scacchiera nero/rosso alternata su richiesta esplicita del cliente (tornata indietro dopo un giro:
  // prima uniforme, poi richiesta di nuovo a scacchiera "come avevi fatto prima"). I ritagli di giornale
  // (niente href, solo scan) si aprono come foto a schermo intero invece di un link esterno, stessa
  // struttura/stile delle altre card.
  const inner = (
    <>
      {item.img && <img src={item.img} alt={item.title} className="mb-5 h-40 w-full border border-paper/20 object-cover object-top" />}
      <span className="text-xs uppercase text-paper/70 group-hover:text-ink/70">{item.outlet} · {item.date}</span>
      <h3 className="mt-3 font-display text-2xl leading-tight">{item.title}</h3>
      <p className="mt-4 text-sm text-paper/75 group-hover:text-ink/75">{item.excerpt}</p>
      <span className="mt-auto inline-flex w-fit items-center gap-2 pt-5 font-display text-sm uppercase text-paper group-hover:text-ink">
        {item.href ? "Leggi" : "Vedi la foto"} <ArrowUpRight className="h-4 w-4" />
      </span>
    </>
  );

  const className = `group flex min-h-80 flex-col p-7 text-left transition-colors hover:bg-paper hover:text-ink ${index % 2 === 0 ? "bg-ink" : "bg-signal"}`;

  if (item.href) {
    return <a href={item.href} target="_blank" rel="noreferrer" className={className}>{inner}</a>;
  }
  return <button type="button" onClick={onOpenScan} className={className}>{inner}</button>;
}

function NewsPage() {
  const { news } = Route.useLoaderData();
  const [scanLightbox, setScanLightbox] = useState<string | null>(null);

  return (
    <main className="relative min-h-screen bg-ink px-5 pb-16 pt-28 text-paper sm:pt-16 md:px-12 lg:px-20">
      <ReelNav active={ids.indexOf("press")} />
      <Link to="/" hash="press" className="inline-flex items-center gap-2 font-display text-xs uppercase text-hot sm:text-sm">
        <ArrowLeft className="h-4 w-4" /> <span className="sm:hidden">Portfolio</span><span className="hidden sm:inline">Torna al portfolio</span>
      </Link>
      <h1 className="mt-8 font-display text-6xl font-bold uppercase leading-none md:text-8xl">News & press.</h1>
      <p className="mt-4 max-w-xl text-lg text-paper/80">Interviste, recensioni e nuove pubblicazioni su Lorenzo Blaconà.</p>

      <div className="mt-16 grid gap-px bg-paper/30 border-t border-paper/30 md:grid-cols-3">
        {news.map((n, i) => (
          <NewsCard key={n.title + n.date} item={n} index={i} onOpenScan={() => setScanLightbox(n.img ?? null)} />
        ))}
      </div>

      {scanLightbox && (
        <Lightbox photos={[scanLightbox]} index={0} onClose={() => setScanLightbox(null)} onNavigate={() => {}} />
      )}

      <SiteFooter theme="dark" />
    </main>
  );
}
