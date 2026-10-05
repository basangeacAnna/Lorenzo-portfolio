import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ReelNav, ids } from "@/components/reel-nav";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [
    { title: "News — Lorenzo Blaconà" },
    { name: "description", content: "Ultime notizie, interviste e rassegna stampa su Lorenzo Blaconà." },
  ]}),
  component: NewsPage,
});

// Rassegna stampa reale (titoli, testate e date verificati uno per uno sulla fonte originale prima di
// essere inseriti qui — niente di inventato). Più recenti in alto. href assente per i due ritagli di
// giornale (foto dello scan): articoli di carta stampata, nessuna pagina web a cui linkare.
type NewsItem = { title: string; outlet: string; date: string; excerpt: string; href?: string; img?: string };
const news: NewsItem[] = [
  {
    title: "«Cosa desideri?» — A Cassano la musica incontra il teatro",
    outlet: "L'Eco di Bergamo",
    date: "24 settembre 2026",
    excerpt: "Lorenzo tra gli attori in scena con la band Roundeep al TeCa Teatro di Cassano, in un viaggio tra musica, parole e momenti teatrali.",
    href: "/media/press-cosa-desideri-eco-bergamo.pdf",
  },
  {
    title: "Teatro Utile: i lavori del laboratorio su \"Clima e migrazioni\" in scena a Milano",
    outlet: "Milano Etno TV",
    date: "11 settembre 2026",
    excerpt: "Lorenzo tra gli attori del laboratorio teatrale sull'intersezione tra crisi climatica e migrazioni forzate, in scena al Teatro Filodrammatici.",
    href: "https://www.milanoetnotv.it/2026/09/11/teatro-utile-i-lavori-del-laboratorio-su-clima-e-migrazioni-in-scena-a-milano/",
  },
  {
    title: "Brasserie, di Koffi Kwahulé — regia di Tiziana Bergamaschi",
    outlet: "Slow Mill",
    date: "9 aprile 2026",
    excerpt: "Lorenzo nel cast di \"Brasserie\", commedia nera che racconta guerra e colonialismo attraverso la storia di due capi brutali in lotta per una birreria in Africa.",
    href: "https://www.slowmill.it/evento/brasserie-spettacolo-teatrale-2/",
  },
  {
    title: "Musica & Arte per la Prevenzione — Roundeep & AAP",
    outlet: "Oooh Events",
    date: "8 novembre 2025",
    excerpt: "Lorenzo tra gli artisti coinvolti nel concerto benefico, con lo spettacolo \"Le Otto Meraviglie – Pensati guarita\" insieme a Eleonora Berta.",
    href: "https://oooh.events/evento/musica-arte-per-la-prevenzione-roundeep-aap-biglietti/",
  },
  {
    title: "VFF7 — Vertigo Film Fest, \"Non Parlo Solo di Me\"",
    outlet: "Vertigo Film Fest",
    date: "2–5 luglio 2025",
    excerpt: "Documentario nato dal workshop \"Next Frame\" con i giovani collettivi milanesi, firmato insieme a Loribel Velotto (Associazione Culturale InDialogo).",
    href: "https://www.vertigofilmfest.com/programmavff7/",
  },
  {
    title: "1° FestivalBeer di Pantigliate",
    outlet: "7Giorni",
    date: "7 luglio 2025",
    excerpt: "Tre serate di musica, birra artigianale e divertimento: Lorenzo Blaconà e Jacopo Crippa in concerto con sonorità che mescolano tradizione e modernità.",
    href: "https://www.7giorni.info/eventi-spettacoli/pantigliate/1degree-festivalbeer-di-pantigliate-tre-serate-di-musica-birra-artigianale-e-divertimento-per-tutta-la-famiglia-2025-07-07.html",
  },
  {
    title: "Segrate in Musica con i solisti",
    outlet: "Quindici News",
    date: "8 marzo 2024",
    excerpt: "Lorenzo Blaconà tenore, con Marco Tencati Corino (chitarra) e Jacopo Crippa (pianoforte), in un concerto tra brani classici ed eclettici al Centro Verdi.",
    href: "https://quindicinews.it/2024/03/08/segrate-in-musica-con-i-solisti/",
  },
  {
    title: "I Solisti — Concerto della rassegna Segrate in Musica",
    outlet: "Comune di Segrate",
    date: "10 marzo 2024",
    excerpt: "Lorenzo Blaconà tenore in un concerto di chitarra, voce e pianoforte tra repertorio classico e sonorità latinoamericane.",
    href: "https://www.comune.segrate.mi.it/vivere-il-comune/eventi/dettaglio/I-Solisti.-Concerto-della-rassegna-Segrate-in-Musica/",
  },
  {
    title: "Eventi, tutti gli appuntamenti a Segrate dall'8 al 20 marzo",
    outlet: "Giornale di Segrate",
    date: "8 marzo 2024",
    excerpt: "\"I Solisti\": Marco Tencati Corino (chitarra), Lorenzo Blaconà (tenore) e Jacopo Crippa (piano) al Centro Verdi per la rassegna Segrate in Musica.",
    href: "https://giornaledisegrate.it/2024/03/08/eventi-tutti-gli-appuntamenti-a-segrate-dall8-al-20-marzo/",
  },
  {
    title: "Brasserie",
    outlet: "Teatro Utile il Viaggio",
    date: "2026",
    excerpt: "Pagina dello spettacolo \"Brasserie\" di Koffi Kwahulé, nel cartellone di Teatro Utile.",
    href: "https://teatroutileilviaggio.com/brasserie",
  },
  {
    title: "Segrate in Musica fa tris",
    outlet: "Giornale di Segrate",
    date: "16 febbraio 2023",
    excerpt: "Lorenzo Blaconà (tenore) con Lana Asija Dabovic (soprano) e Francesco Crippa (baritono), accompagnati al piano da Jacopo Crippa, per la rassegna Segrate in Musica.",
    img: "/media/press-giornale-segrate-feb2023.png",
  },
  {
    title: "Canto lirico e quintetto",
    outlet: "Giornale di Segrate",
    date: "8 giugno 2023",
    excerpt: "Lorenzo Blaconà tenore sul palco per la rassegna Segrate in Musica, accompagnato da un quartetto d'archi nella seconda parte del concerto.",
    img: "/media/press-giornale-segrate-giu2023.png",
  },
];

function NewsPage() {
  return (
    <main className="relative min-h-screen bg-signal px-5 pb-16 pt-28 text-paper sm:pt-16 md:px-12 lg:px-20">
      <ReelNav active={ids.indexOf("press")} />
      <Link to="/" hash="press" className="inline-flex items-center gap-2 font-display text-sm uppercase">
        <ArrowLeft className="h-4 w-4" /> Torna al portfolio
      </Link>
      <h1 className="mt-8 font-display text-6xl font-bold uppercase leading-none md:text-8xl">News & press.</h1>
      <p className="mt-4 max-w-xl text-lg text-paper/80">Interviste, recensioni e nuove pubblicazioni su Lorenzo Blaconà.</p>

      <div className="mt-16 grid gap-px bg-paper/30 border-t border-paper/30 md:grid-cols-3">
        {news.map((n) => (
          <article key={n.title} className="flex min-h-80 flex-col bg-signal p-7">
            {n.img && <img src={n.img} alt={n.title} className="mb-5 h-40 w-full border border-paper/20 object-cover object-top" />}
            <span className="text-xs uppercase text-paper/70">{n.outlet} · {n.date}</span>
            <h3 className="mt-3 font-display text-2xl leading-tight">{n.title}</h3>
            <p className="mt-4 text-sm text-paper/75">{n.excerpt}</p>
            {n.href && (
              <a href={n.href} target="_blank" rel="noreferrer" className="mt-auto inline-flex w-fit items-center gap-2 pt-5 font-display text-sm uppercase text-paper hover:text-ink">
                Leggi <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
