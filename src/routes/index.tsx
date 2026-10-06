import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Drama, Instagram, Mail, Maximize2, Play } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { ReelNav, sections, ids } from "@/components/reel-nav";
import { Lightbox } from "@/components/lightbox";

// Foto "teaser" accanto al video in Galleria: due scatti pensati per dare una prima impressione forte a
// chi apre il sito — un momento di scena dal vivo + un primo piano normale. La seconda era
// "teatro-monologo-mezza-figura-02", ora esclusiva della categoria "Teatro Filodrammatici 2025" in
// Galleria: sostituita qui con un'altra foto della stessa serie "buio" (non riservata al 2025).
const teaserPhotos: [string, string] = ["/media/teatro-applausi-finali-02.jpg", "/media/teatro-monologo-buio-02.jpg"];

// Lavori in evidenza: titoli, link YouTube e miniature reali forniti dal cliente.
const works = [
  // Link e titoli reali confermati dal cliente (verificati via oEmbed YouTube); le miniature sono
  // fermi immagine reali dei video stessi, forniti dal cliente.
  { title: "Shablo, Guè, Joshua – La Mia Parola (Sanremo 2025) ft. Tormento", href: "https://youtu.be/70vcIH3-4lU", img: "/media/lavoro-shablo-gue-joshua.png" },
  { title: "Costa Crociere – The Sound of Wonder (Sanremo 2024)", href: "https://youtu.be/Mh8_5D34tMo", img: "/media/lavoro-costa-crociere.png" },
  { title: "A Gift From God – Trailer ufficiale del film", href: "https://www.youtube.com/watch?v=fsx8_UggpkE", img: "/media/lavoro-gift-from-god.png" },
  { title: "Monge – \"Che poesia\", spot Natale 2025", href: "https://www.youtube.com/watch?v=D9n7UrZcv7s", img: "/media/lavoro-monge-natale.png" },
];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Lorenzo Blaconà — Attore, Cantante, Scrittore, Grafico" },
    { name: "description", content: "Portfolio artistico di Lorenzo Blaconà: teatro, musica, scrittura e grafica." },
    { property: "og:title", content: "Lorenzo Blaconà — Portfolio" },
    { property: "og:description", content: "Attore, cantante, scrittore e grafico. Scopri lavori, galleria e contatti." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

function PhotoFrame({ label, src, tall = false, compact = false, fill = false, onOpen }: { label: string; src?: string; tall?: boolean; compact?: boolean; fill?: boolean; onOpen?: () => void }) {
  // fill: riempie esattamente l'altezza del genitore (nessun min-height proprio) — per quando il box
  // deve combaciare con un'altezza decisa da fuori (es. accanto al video nella Galleria).
  // onOpen sull'intera card (non solo sull'iconcina): clic ovunque sulla foto per aprirla ingrandita.
  const sizeClass = fill ? "h-full" : tall ? "min-h-[28rem]" : compact ? "min-h-40" : "min-h-72";
  if (src && onOpen) {
    return (
      <button type="button" onClick={onOpen} aria-label={`Apri foto: ${label}`} className={`group relative block w-full overflow-hidden border border-paper/35 bg-muted text-left ${sizeClass}`}>
        <img src={src} alt={label} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <Maximize2 className="absolute right-5 top-5 h-5 w-5 text-hot opacity-0 transition-opacity group-hover:opacity-100" />
      </button>
    );
  }
  return <div className={`group relative overflow-hidden border border-paper/35 bg-muted ${sizeClass}`}>
    {src ? <img src={src} alt={label} className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-4 border border-dashed border-paper/20"/>}
  </div>;
}

// --- Icone decorative che "fluttuano" per la pagina (forme geometriche semplici, in stile con le altre
// icone del sito) — puro tratto (stroke), nessuna immagine. slow-drift è l'animazione già definita in
// styles.css. Sempre pointer-events-none: sono solo decorazione, non devono intercettare click.
function FloatingMic({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 96" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <rect x="20" y="4" width="24" height="42" rx="12" />
      <path d="M12 42a20 20 0 0 0 40 0" />
      <line x1="32" y1="62" x2="32" y2="82" />
      <line x1="16" y1="90" x2="48" y2="90" />
    </svg>
  );
}

function FloatingClapper({ className, style }: { className?: string; style?: CSSProperties }) {
  // Lastra (sotto) + bacchetta superiore come pezzo A SÉ, leggermente ruotata (cerniera a sinistra, un
  // ciak "aperto" realistico) invece del pentagono unico/deformato di prima — strisce diagonali disegnate
  // DENTRO la bacchetta stessa, non a cavallo del bordo.
  return (
    <svg viewBox="0 0 96 80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <rect x="10" y="34" width="76" height="38" />
      <g transform="rotate(-10 12 32)">
        <rect x="8" y="16" width="80" height="16" />
        <line x1="20" y1="16" x2="12" y2="32" />
        <line x1="36" y1="16" x2="28" y2="32" />
        <line x1="52" y1="16" x2="44" y2="32" />
        <line x1="68" y1="16" x2="60" y2="32" />
        <line x1="84" y1="16" x2="76" y2="32" />
      </g>
      <circle cx="12" cy="32" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Nota musicale (cantante) e penna (scrittore): completano il set a tema coi 4 mestieri di Lorenzo
// (attore/clapper+masks, cantante/mic+nota, scrittore/penna, grafico/quadrati-cerchi sparsi).
function FloatingNote({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 48 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <circle cx="12" cy="52" r="8" />
      <line x1="20" y1="52" x2="20" y2="8" />
      <path d="M20 8 L40 14 L40 24 L20 18 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FloatingPen({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M48 6 L58 16 L22 52 L10 54 L12 42 Z" />
      <line x1="10" y1="54" x2="6" y2="58" />
    </svg>
  );
}

// Stessa "famiglia" delle due curve dell'hero (linea piena + linea sottile tratteggiata che "scorre" con
// la classe neon-trail già in styles.css), ma con DUE viewBox dedicati — uno diagonale, uno verticale —
// invece di stirarne uno solo con preserveAspectRatio="none" (deformava la curva). "wild" rompe lo schema
// "1 piena + 1 tratteggiata" sempre uguale: due tratteggiate che si incrociano in direzioni opposte, per
// un po' di varietà/casino invece della stessa coppia ripetuta ovunque. Colori sempre dalla palette del
// sito (--signal, --hot, --ink, --paper), mai nuovi. pointer-events-none + aria-hidden: puro ornamento.
function FloatingSquiggle({ className, style, solidColor = "var(--signal)", dashColor = "var(--hot)", wild = false }: {
  className?: string;
  style?: CSSProperties;
  solidColor?: string;
  dashColor?: string;
  wild?: boolean;
}) {
  // Stesso identico viewBox (1200×900) e preserveAspectRatio="none" delle due curve dell'hero: va
  // posizionata con "inset-0 h-full w-full" (MAI una fascia stretta) così si stira a riempire l'INTERA
  // sezione che la ospita, esattamente come in home — non una decorazione piccola in un angolo.
  // "non-wild" riusa letteralmente lo stesso path dell'hero; "wild" è un pattern diverso per varietà.
  return (
    <svg viewBox="0 0 1200 900" fill="none" preserveAspectRatio="none" className={className} style={style} aria-hidden="true">
      {wild ? (<>
        <path className="neon-trail" d="M-100 150 C 260 700, 550 50, 900 550 S 1300 100, 1300 750" stroke={solidColor} strokeWidth="18" />
        <path className="neon-trail" d="M-100 800 C 300 250, 650 850, 950 250 S 1300 800, 1300 150" stroke={dashColor} strokeWidth="6" />
      </>) : (<>
        <path d="M-100 700 C 260 310, 500 980, 1300 160" stroke={solidColor} strokeWidth="22" />
        <path className="neon-trail" d="M-100 770 C 300 350, 650 1000, 1300 290" stroke={dashColor} strokeWidth="6" />
      </>)}
    </svg>
  );
}

function Index() {
  const [active, setActive] = useState(0);
  const [bioLightbox, setBioLightbox] = useState(false);
  const [teaserLightbox, setTeaserLightbox] = useState<number | null>(null);
  // Sezione "attiva" = quella che attraversa una fascia sottile vicino alla cima dello schermo (15%-30%
  // dall'alto), rilevata con IntersectionObserver — non più una frazione lineare di scroll totale
  // (scrollY / altezza pagina * numero sezioni), che sbagliava ogni volta che le sezioni avevano altezze
  // diverse fra loro (quasi sempre: Galleria/Rassegna stampa hanno contenuto variabile). Quello sbaglio
  // faceva sì che, cliccando un'etichetta della bobina (es. "Bio"), si atterrasse in cima alla sezione
  // giusta ma la bobina continuasse a pensare di essere ancora sulla sezione precedente finché non si
  // scrollava ancora un po' — rendendo scomodo cliccare subito la sezione SUCCESSIVA.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = ids.indexOf(entry.target.id);
            if (idx !== -1) setActive(idx);
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative bg-background text-foreground">
      <ReelNav active={active} />
      {bioLightbox && (
        <Lightbox photos={["/media/ritratto-studio-giacca-occhiali.jpg"]} index={0} onClose={() => setBioLightbox(false)} onNavigate={() => {}} />
      )}
      {teaserLightbox !== null && (
        <Lightbox photos={teaserPhotos} index={teaserLightbox} onClose={() => setTeaserLightbox(null)} onNavigate={setTeaserLightbox} />
      )}
      <svg aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70" viewBox="0 0 1200 900" preserveAspectRatio="none"><path d="M-100 700 C 260 310, 500 980, 1300 160" fill="none" stroke="var(--signal)" strokeWidth="22"/><path className="neon-trail" d="M-100 770 C 300 350, 650 1000, 1300 290" fill="none" stroke="var(--hot)" strokeWidth="6"/></svg>

      <section id="top" className="relative z-10 grid min-h-[100vh] items-center px-5 pb-14 pt-8 md:grid-cols-[1.1fr_.9fr] md:items-end md:px-10 lg:px-16">
        {/* Come nel riferimento del cliente: un anello FITTO di elementi colorati PIENI (non trasparenti)
            stretto intorno al blocco del nome — 5 icone a tema (un mestiere ciascuna) + quadrati/cerchi
            a tinta unita nei colori della palette (i quadrati/cerchi stessi sono coerenti col profilo di
            Lorenzo "grafico"). Visibili anche su telefono (prima erano "hidden md:block": sparivano del
            tutto sotto i 768px) — solo più piccole, per non affollare uno schermo stretto quanto uno largo. */}
        <FloatingMic className="slow-drift pointer-events-none absolute left-[0%] top-[34%] h-10 w-8 -rotate-6 text-hot/70 md:h-16 md:w-12" />
        <FloatingClapper className="slow-drift pointer-events-none absolute left-[40%] top-[36%] h-9 w-11 rotate-6 text-paper/60 md:h-14 md:w-18" style={{ animationDelay: "-2.5s" }} />
        <Drama strokeWidth={1.5} className="slow-drift pointer-events-none absolute left-[36%] top-[72%] h-8 w-8 -rotate-3 text-hot/60 md:h-12 md:w-12" style={{ animationDelay: "-5s" }} />
        <FloatingNote className="slow-drift pointer-events-none absolute -left-[2%] top-[66%] h-9 w-7 rotate-6 text-paper/60 md:h-14 md:w-10" style={{ animationDelay: "-1.5s" }} />
        <FloatingPen className="pointer-events-none absolute left-[14%] top-[88%] h-7 w-7 -rotate-12 text-hot/65 md:h-11 md:w-11" />
        <div className="pointer-events-none absolute left-[11%] top-[26%] h-5 w-5 rotate-12 bg-hot md:h-7 md:w-7" />
        <div className="slow-drift pointer-events-none absolute left-[28%] top-[20%] h-4 w-4 rounded-full bg-signal md:h-6 md:w-6" style={{ animationDelay: "-4s" }} />
        <div className="pointer-events-none absolute left-[50%] top-[26%] h-3 w-3 rounded-full bg-paper md:h-5 md:w-5" />
        <div className="pointer-events-none absolute left-[58%] top-[46%] h-5 w-5 -rotate-6 bg-paper/90 md:h-8 md:w-8" />
        <div className="slow-drift pointer-events-none absolute left-[2%] top-[48%] h-3 w-3 rounded-full bg-hot md:h-5 md:w-5" style={{ animationDelay: "-3s" }} />
        <div className="pointer-events-none absolute left-[7%] top-[82%] h-5 w-5 rotate-45 bg-signal md:h-7 md:w-7" />
        <div className="pointer-events-none absolute left-[24%] top-[93%] h-3 w-3 rounded-full bg-paper/80 md:h-4 md:w-4" />
        <div className="slow-drift pointer-events-none absolute left-[46%] top-[84%] h-4 w-4 rotate-12 bg-hot/85 md:h-6 md:w-6" style={{ animationDelay: "-6s" }} />
        <div className="pointer-events-none absolute left-[56%] top-[62%] h-3 w-3 rounded-full bg-signal md:h-4 md:w-4" />
        <div className="pointer-events-none absolute left-[20%] top-[42%] h-3 w-3 rotate-[20deg] bg-paper/80 md:h-5 md:w-5" />
        <div className="relative z-10 md:pb-10"><h1 className="max-w-5xl font-display text-[clamp(3.5rem,9vw,7rem)] font-bold uppercase leading-[.78]">Lorenzo<br/><span className="text-transparent [-webkit-text-stroke:1px_var(--paper)]">Blaconà</span></h1><p className="mt-6 font-display text-base uppercase md:text-xl">Attore • Cantante • Scrittore • Grafico<br/><span className="text-sm normal-case italic text-muted-foreground md:text-base">...e un gran sognatore</span></p><ArrowDownRight className="mt-6 h-10 w-10 text-hot" /></div>
        <div className="relative hidden h-[75vh] md:block"><div className="absolute inset-10 right-20 overflow-hidden rotate-2 border-2 border-hot bg-muted"><img src="/media/editoriale-scivolo-dallalto-02.jpg" alt="Lorenzo Blaconà" className="h-full w-full object-cover" /></div></div>
      </section>

      <section id="bio" className="relative z-10 flex min-h-screen items-center overflow-hidden bg-paper px-5 py-14 text-ink md:px-12 md:py-16 lg:px-20"><FloatingMic className="slow-drift pointer-events-none absolute right-16 top-16 hidden h-24 w-16 text-ink/10 lg:block" /><FloatingSquiggle solidColor="var(--ink)" dashColor="var(--hot)" className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" style={{ opacity: 0.5 }} /><div className="grid w-full max-w-6xl gap-10 md:grid-cols-[.8fr_1.2fr]"><PhotoFrame label="Ritratto" src="/media/ritratto-studio-giacca-occhiali.jpg" tall onOpen={() => setBioLightbox(true)} /><div className="md:pt-14"><p className="font-display text-sm uppercase text-hot">01 / Bio</p><h2 className="mt-3 max-w-lg font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl md:text-6xl xl:text-7xl">Dal palco alla platea, sempre con un'idea.</h2><p className="mt-6 max-w-xl text-lg leading-relaxed">Lorenzo Blaconà attraversa linguaggi e discipline con uno sguardo personale: recitazione, voce, scrittura e progetto grafico diventano parti della stessa ricerca artistica. Una biografia in movimento, costruita tra scena, ascolto e immaginazione.</p><Link to="/cv" className="mt-6 inline-flex items-center gap-2 rounded-none bg-ink px-7 py-6 font-display uppercase text-paper transition-colors hover:bg-hot">Vedi di più CV <ArrowUpRight/></Link></div></div></section>

      <section id="lavori" className="relative z-10 min-h-screen overflow-hidden bg-ink px-5 py-14 md:px-12 md:py-16 lg:px-20">
        <FloatingClapper className="slow-drift pointer-events-none absolute right-16 top-20 hidden h-20 w-24 text-paper/10 lg:block" />
        <FloatingSquiggle wild className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" style={{ opacity: 0.5 }} />
        <p className="font-display text-sm uppercase text-hot">02 / Lavori</p>
        <h2 className="mt-3 max-w-4xl font-display text-5xl font-bold uppercase leading-none xl:text-7xl">Quello<br/>sono io!</h2>
        {/* max-w-[19rem] solo su telefono: la pellicola ("rullino") che scende dalla bobina arriva fin lì
            — oltre, anche solo per l'ultima parola di riga, finiva coperta. Da sm in su torna max-w-xl. */}
        <p className="mt-4 max-w-[19rem] text-lg text-muted-foreground sm:max-w-xl">Clicca sui titoli, potrebbero portarti in posti magici... (come YouTube)</p>
        <div className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2 xl:grid-cols-4">
          {works.map((w) => (
            <a key={w.title} href={w.href} target="_blank" rel="noreferrer" className="group block">
              <div className="relative min-h-40 overflow-hidden border border-paper/20 bg-muted">
                <img src={w.img} alt={w.title} className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/10" />
                <div className="absolute inset-0 grid place-items-center">
                  <Play className="h-10 w-10 text-paper opacity-90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] transition-transform group-hover:scale-110" />
                </div>
              </div>
              <h3 className="mt-3 font-display text-base uppercase leading-snug text-paper group-hover:text-hot">{w.title}</h3>
            </a>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-5">
          <a href="https://wariboko.eu" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-display text-lg text-hot">Agenzia <ArrowUpRight className="h-5 w-5" /></a>
          <a href="https://www.filmmakers.eu/it/actors/lorenzo-blacona" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-display text-lg text-hot">Filmmakers <ArrowUpRight className="h-5 w-5" /></a>
        </div>
      </section>

      <section id="galleria" className="relative z-10 min-h-screen bg-paper px-5 py-12 text-ink md:px-12 md:py-14 lg:px-20">
        <p className="font-display text-sm uppercase text-hot">03 / Galleria</p>
        <h2 className="mt-3 font-display text-4xl font-bold uppercase sm:text-5xl xl:text-7xl">Guardami<br/>meglio.</h2>
        {/* Il pulsante "Vedi tutte le foto" prima stava qui accanto al titolo, in alto a destra — proprio dove
            finisce la bobina fissa, che lo copriva. Ora sta sotto la griglia, fuori da quella zona. */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {/* aspect-video = ESATTAMENTE il rapporto del sorgente (1920×1080 = 16:9, identico): il box ha
              quindi sempre la stessa identica proporzione del video, mai più largo né più stretto — con
              object-cover il video riempie tutto il box, zero bande nere, zero taglio (perché non c'è
              nessuna differenza di proporzioni da compensare). L'altezza segue automaticamente la
              larghezza disponibile ad ogni breakpoint, restando sempre nel budget verticale della sezione.
              La colonna foto a destra (nessuna altezza propria) si allunga per combaciare in automatico. */}
          <div className="relative aspect-video w-full overflow-hidden border border-ink/20 bg-ink md:col-span-2">
            <video controls preload="metadata" className="h-full w-full object-cover">
              <source src="/media/reel-lorenzo.mp4" type="video/mp4" />
            </video>
          </div>
          {/* min-h-[28rem] md:min-h-0: sotto "md" questa colonna non condivide più riga con il video (la
              griglia diventa a colonna unica), quindi non ha più un'altezza "presa in prestito" da lui —
              senza un minimo esplicito, "fill" (h-full) sulle PhotoFrame non aveva nulla da cui ereditare
              l'altezza e le due foto sparivano del tutto (0px) su telefono. Da md in su torna 0: l'altezza
              arriva di nuovo dallo stretch automatico della riga condivisa col video, come prima. */}
          <div className="grid min-h-[28rem] grid-rows-2 gap-4 md:min-h-0">
            <PhotoFrame label="Applausi finali" src={teaserPhotos[0]} fill onOpen={() => setTeaserLightbox(0)} />
            <PhotoFrame label="Editoriale" src={teaserPhotos[1]} fill onOpen={() => setTeaserLightbox(1)} />
          </div>
        </div>
        <Link to="/galleria" className="mt-4 inline-flex items-center justify-center gap-2 rounded-none bg-ink px-6 py-3 font-display uppercase text-paper transition-colors hover:bg-hot">Vedi tutte le foto <ArrowUpRight /></Link>
      </section>

      <section id="press" className="relative z-10 min-h-screen overflow-hidden bg-signal px-5 py-14 text-paper md:px-12 md:py-16 lg:px-20"><Drama strokeWidth={1.5} className="slow-drift pointer-events-none absolute right-16 top-20 hidden h-20 w-20 text-paper/15 lg:block" /><FloatingSquiggle solidColor="var(--paper)" dashColor="var(--ink)" className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" style={{ opacity: 0.5 }} /><p className="font-display text-sm uppercase">04 / Parlano di me</p><h2 className="mt-3 max-w-4xl font-display text-4xl font-bold uppercase leading-none sm:text-5xl xl:text-8xl">La rassegna stampa…</h2><div className="mt-8 grid gap-px bg-paper/30 md:grid-cols-3">{[
          { outlet: "L'Eco di Bergamo", date: "24 set 2026", title: "«Cosa desideri?» — A Cassano la musica incontra il teatro", href: "/media/press-cosa-desideri-eco-bergamo.pdf" },
          { outlet: "Milano Etno TV", date: "11 set 2026", title: "Teatro Utile: laboratorio su clima e migrazioni in scena a Milano", href: "https://www.milanoetnotv.it/2026/09/11/teatro-utile-i-lavori-del-laboratorio-su-clima-e-migrazioni-in-scena-a-milano/" },
          { outlet: "Slow Mill", date: "9 apr 2026", title: "Brasserie, di Koffi Kwahulé — regia di Tiziana Bergamaschi", href: "https://www.slowmill.it/evento/brasserie-spettacolo-teatrale-2/" },
        ].map((a,i)=><a key={a.title} href={a.href} target="_blank" rel="noreferrer" className={`group block min-h-56 p-7 transition-colors hover:bg-paper hover:text-ink ${i % 2 === 0 ? "bg-ink" : "bg-signal"}`}><span className="text-xs uppercase text-paper/70 group-hover:text-ink/70">{a.outlet} · {a.date}</span><h3 className="mt-10 font-display text-3xl leading-tight">{a.title}</h3><span className="mt-4 inline-flex items-center gap-2 text-paper/75 group-hover:text-ink">Leggi <ArrowUpRight className="h-4 w-4"/></span></a>)}</div><Link to="/news" className="mt-6 inline-flex items-center gap-2 rounded-none bg-paper px-6 py-3 font-display uppercase text-ink transition-colors hover:bg-ink hover:text-paper">Vedi di più news <ArrowUpRight/></Link></section>

      <footer id="contatti" className="relative z-10 min-h-screen overflow-hidden bg-ink px-5 py-14 md:px-12 md:py-16 lg:px-20">
        <FloatingSquiggle solidColor="var(--hot)" dashColor="var(--paper)" wild className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" style={{ opacity: 0.5 }} />
        <p className="font-display text-sm uppercase text-hot">05 / Contatti</p>
        <h2 className="mt-3 max-w-5xl font-display text-[clamp(2.25rem,9vw,7rem)] font-bold uppercase leading-[.82]">Facciamo<br/><span className="text-hot">qualcosa.</span></h2>
        {/* max-w-[11rem] solo su telefono: a quella larghezza il testo non entra mai nella zona che la
            bobina copre (stessa logica dei titoli già sistemati sopra) — da sm in su torna max-w-xl, invariato. */}
        <p className="mt-6 max-w-[11rem] text-lg text-muted-foreground sm:max-w-xl">Per proposte di lavoro, collaborazioni artistiche o richieste stampa: scrivimi!</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link to="/scrivimi" className="inline-flex items-center gap-2 rounded-none bg-hot px-7 py-4 font-display uppercase text-ink transition-colors hover:bg-paper">Scrivimi <ArrowUpRight/></Link>
        </div>
        <div className="mt-10 grid gap-8 border-t border-border pt-6 md:grid-cols-3"><div><span className="text-xs uppercase text-muted-foreground">Email</span><a href="mailto:loryblacona@gmail.com" className="mt-3 flex items-center gap-2 text-lg"> <Mail className="h-5 w-5 text-hot"/> loryblacona@gmail.com</a></div><div><span className="text-xs uppercase text-muted-foreground">Agenzia · Wariboko</span><a href="mailto:Charity.dago@wariboko.eu" className="mt-3 flex items-center gap-2 text-lg"><Mail className="h-5 w-5 text-hot"/> Charity.dago@wariboko.eu</a></div><div><span className="text-xs uppercase text-muted-foreground">Social</span><a href="https://instagram.com/dets.lore" target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 text-lg"><Instagram className="h-5 w-5 text-hot"/> @dets.lore</a></div></div>
        <p className="mt-14 text-xs uppercase text-muted-foreground">© 2026 Lorenzo Blaconà — Tutti i diritti riservati</p>
      </footer>
    </main>
  );
}