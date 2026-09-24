import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Instagram, Mail, Maximize2, Phone, Play, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ReelNav, sections, ids } from "@/components/reel-nav";

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

function PhotoFrame({ label, src, tall = false, compact = false, fill = false }: { label: string; src?: string; tall?: boolean; compact?: boolean; fill?: boolean }) {
  // fill: riempie esattamente l'altezza del genitore (nessun min-height proprio) — per quando il box
  // deve combaciare con un'altezza decisa da fuori (es. accanto al video nella Galleria).
  return <div className={`group relative overflow-hidden border border-paper/35 bg-muted ${fill ? "h-full" : tall ? "min-h-[28rem]" : compact ? "min-h-40" : "min-h-72"}`}>
    {src ? <img src={src} alt={label} className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-4 border border-dashed border-paper/20"/>}
    <div className="pointer-events-none absolute bottom-5 left-5 font-display text-xs uppercase text-paper drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">{label} · foto</div>
    <Maximize2 className="absolute right-5 top-5 h-5 w-5 text-hot transition-transform group-hover:scale-125" />
  </div>;
}

// --- Icone decorative che "fluttuano" per la pagina (forme geometriche semplici, in stile con le altre
// icone del sito) — puro tratto (stroke), nessuna immagine. slow-drift è l'animazione già definita in
// styles.css. Sempre pointer-events-none: sono solo decorazione, non devono intercettare click.
function FloatingMic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 96" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="20" y="4" width="24" height="42" rx="12" />
      <path d="M12 42a20 20 0 0 0 40 0" />
      <line x1="32" y1="62" x2="32" y2="82" />
      <line x1="16" y1="90" x2="48" y2="90" />
    </svg>
  );
}

function FloatingClapper({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="6" y="26" width="84" height="48" />
      <path d="M6 26 14 6 90 6 82 26Z" />
      <line x1="24" y1="6" x2="16" y2="26" />
      <line x1="42" y1="6" x2="34" y2="26" />
      <line x1="60" y1="6" x2="52" y2="26" />
      <line x1="78" y1="6" x2="70" y2="26" />
    </svg>
  );
}

function FloatingMasks({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="40" cy="40" r="32" />
      <circle cx="80" cy="40" r="32" />
      <path d="M26 48q14 14 28 0" />
      <path d="M66 52q14-14 28 0" />
      <circle cx="30" cy="30" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="50" cy="30" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="70" cy="30" r="2.5" fill="currentColor" stroke="none" />
      <circle cx="90" cy="30" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Modal({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] grid place-items-center bg-ink/90 p-5" onClick={close}><motion.div initial={{ y: 40, rotate: -1 }} animate={{ y: 0, rotate: 0 }} exit={{ y: 30, opacity: 0 }} onClick={e => e.stopPropagation()} className="max-h-[85vh] w-full max-w-4xl overflow-y-auto border border-hot bg-card p-6 md:p-12"><div className="mb-10 flex items-start justify-between gap-4"><h2 className="font-display text-4xl md:text-6xl">{title}</h2><Button size="icon" variant="ghost" aria-label="Chiudi" onClick={close}><X /></Button></div>{children}</motion.div></motion.div>;
}

function Index() {
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState<"cv" | null>(null);
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", v => setActive(Math.min(sections.length - 1, Math.floor(v * sections.length))));

  return (
    <main className="relative bg-background text-foreground">
      <ReelNav active={active} />
      <svg aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70" viewBox="0 0 1200 900" preserveAspectRatio="none"><path d="M-100 700 C 260 310, 500 980, 1300 160" fill="none" stroke="var(--signal)" strokeWidth="22"/><path className="neon-trail" d="M-100 770 C 300 350, 650 1000, 1300 290" fill="none" stroke="var(--hot)" strokeWidth="6"/></svg>

      <section id="top" className="relative z-10 grid min-h-[100vh] items-center px-5 pb-14 pt-8 md:grid-cols-[1.1fr_.9fr] md:items-end md:px-10 lg:px-16">
        <div className="relative z-10 md:pb-10"><div className="mb-6 font-display text-sm uppercase text-hot">Portfolio / 2026</div><h1 className="max-w-5xl font-display text-[clamp(3.5rem,9vw,7rem)] font-bold uppercase leading-[.78]">Lorenzo<br/><span className="text-transparent [-webkit-text-stroke:1px_var(--paper)]">Blaconà</span></h1><p className="mt-6 font-display text-base uppercase md:text-xl">Attore • Cantante • Scrittore • Grafico</p><blockquote className="mt-8 border-l-2 border-hot pl-5 text-xl italic text-muted-foreground">“Un inguaribile sognatore...”</blockquote><ArrowDownRight className="mt-6 h-10 w-10 text-hot" /></div>
        <div className="relative hidden h-[75vh] md:block"><div className="absolute inset-10 right-20 overflow-hidden rotate-2 border-2 border-hot bg-muted"><img src="/media/editoriale-scivolo-dallalto-02.jpg" alt="Lorenzo Blaconà" className="h-full w-full object-cover" /></div></div>
      </section>

      <section id="bio" className="relative z-10 min-h-screen bg-paper px-5 py-14 text-ink md:px-12 md:py-16 lg:px-20"><FloatingMic className="slow-drift pointer-events-none absolute right-16 top-16 hidden h-24 w-16 text-ink/10 lg:block" /><div className="grid max-w-6xl gap-10 md:grid-cols-[.8fr_1.2fr]"><PhotoFrame label="Ritratto" src="/media/ritratto-studio-giacca-occhiali.jpg" tall/><div className="md:pt-14"><p className="font-display text-sm uppercase text-hot">02 / Bio</p><h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none md:text-7xl">Tra palco<br/>e immagine.</h2><p className="mt-6 max-w-xl text-lg leading-relaxed">Lorenzo Blaconà attraversa linguaggi e discipline con uno sguardo personale: recitazione, voce, scrittura e progetto grafico diventano parti della stessa ricerca artistica. Una biografia in movimento, costruita tra scena, ascolto e immaginazione.</p><Button onClick={() => setModal("cv")} className="mt-6 rounded-none bg-ink px-7 py-6 text-paper hover:bg-hot">Vedi di più CV <ArrowUpRight/></Button></div></div></section>

      <section id="lavori" className="relative z-10 min-h-screen bg-ink px-5 py-14 md:px-12 md:py-16 lg:px-20">
        <FloatingClapper className="slow-drift pointer-events-none absolute right-16 top-20 hidden h-20 w-24 text-paper/10 lg:block" />
        <p className="font-display text-sm uppercase text-hot">03 / Lavori</p>
        <h2 className="mt-3 max-w-4xl font-display text-5xl font-bold uppercase leading-none xl:text-7xl">Quello<br/>sono io!</h2>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">Clicca sui titoli, potrebbero portarti in posti magici... (come YouTube)</p>
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
          {/* Link segnaposto ("#"): sostituire con gli URL veri di agenzia, sito filmmakers di riferimento e accademia. */}
          <a href="#" className="inline-flex items-center gap-2 font-display text-lg text-hot">Agenzia <ArrowUpRight className="h-5 w-5" /></a>
          <a href="#" className="inline-flex items-center gap-2 font-display text-lg text-hot">Filmmakers <ArrowUpRight className="h-5 w-5" /></a>
          <a href="#" className="inline-flex items-center gap-2 font-display text-lg text-hot">Accademia <ArrowUpRight className="h-5 w-5" /></a>
        </div>
      </section>

      <section id="galleria" className="relative z-10 min-h-screen bg-paper px-5 py-14 text-ink md:px-12 md:py-16 lg:px-20">
        <p className="font-display text-sm uppercase text-hot">04 / Galleria</p>
        <h2 className="mt-3 break-words font-display text-5xl font-bold uppercase xl:text-7xl">Fotogrammi.</h2>
        {/* Il pulsante "Vedi tutte le foto" prima stava qui accanto al titolo, in alto a destra — proprio dove
            finisce la bobina fissa, che lo copriva. Ora sta sotto la griglia, fuori da quella zona. */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {/* Altezza FISSA (non aspect-video libero): cresce per breakpoint ma resta sempre entro il
              budget verticale della sezione (che deve stare nel 100% di schermo, non oltre). object-contain
              (non -cover): il video .mp4 (1920×1080, H.264/AAC) resta SEMPRE intero e proporzionato — mai
              tagliato né deformato — eventuali bande nere ai lati sono normali se il box è più largo del 16:9. */}
          <div className="relative flex h-56 items-center justify-center overflow-hidden border border-ink/20 bg-ink sm:h-64 md:col-span-2 md:h-72 lg:h-80">
            <video controls preload="metadata" className="h-full w-full object-contain">
              <source src="/media/reel-lorenzo.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="grid h-56 grid-rows-2 gap-4 sm:h-64 md:h-72 lg:h-80">
            <PhotoFrame label="Teatro" src="/media/teatro-dialogo-proiezione-04.jpg" fill />
            <PhotoFrame label="Editoriale" src="/media/editoriale-altalena-laterale-05.jpg" fill />
          </div>
        </div>
        <Link to="/galleria" className="mt-6 inline-flex items-center justify-center gap-2 rounded-none bg-ink px-6 py-3 font-display uppercase text-paper transition-colors hover:bg-hot">Vedi tutte le foto <ArrowUpRight /></Link>
      </section>

      <section id="press" className="relative z-10 min-h-screen bg-signal px-5 py-14 text-paper md:px-12 md:py-16 lg:px-20"><FloatingMasks className="slow-drift pointer-events-none absolute right-16 top-20 hidden h-16 w-24 text-paper/15 lg:block" /><p className="font-display text-sm uppercase">05 / Parlano di me</p><h2 className="mt-3 max-w-4xl font-display text-5xl font-bold uppercase leading-none xl:text-8xl">Rassegna<br/>stampa.</h2><div className="mt-8 grid gap-px bg-paper/30 md:grid-cols-3">{["Una presenza scenica magnetica","Nuove voci della scena italiana","Il segno incontra la parola"].map((t,i)=><article key={t} className="min-h-56 bg-signal p-7"><span className="text-xs uppercase">Articolo 0{i+1} / Placeholder</span><h3 className="mt-10 font-display text-3xl leading-tight">{t}</h3><p className="mt-4 text-paper/75">Testata, data e breve estratto saranno inseriti qui.</p></article>)}</div><Link to="/news" className="mt-6 inline-flex items-center gap-2 rounded-none bg-paper px-6 py-3 font-display uppercase text-ink transition-colors hover:bg-ink hover:text-paper">Vedi di più news <ArrowUpRight/></Link></section>

      <footer id="contatti" className="relative z-10 min-h-screen bg-ink px-5 py-14 md:px-12 md:py-16 lg:px-20">
        <p className="font-display text-sm uppercase text-hot">06 / Contatti</p>
        <h2 className="mt-3 max-w-5xl font-display text-[clamp(3.5rem,9vw,7rem)] font-bold uppercase leading-[.82]">Facciamo<br/><span className="text-hot">qualcosa.</span></h2>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">Per proposte di lavoro, collaborazioni artistiche o richieste stampa: scrivimi direttamente, oppure passa dal booking.</p>
        <div className="mt-6 flex flex-wrap gap-4">
          {/* wa.me usa lo stesso numero segnaposto del resto della pagina (+39 000 000 0000) — aggiornalo
              qui insieme agli altri link "tel:" quando avrai il numero WhatsApp vero. */}
          <a href="https://wa.me/390000000000" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-none bg-hot px-7 py-4 font-display uppercase text-ink transition-colors hover:bg-paper">Scrivimi <ArrowUpRight/></a>
          <a href="tel:+390000000000" className="inline-flex items-center gap-2 rounded-none border border-paper/30 px-7 py-4 font-display uppercase text-paper transition-colors hover:border-hot hover:text-hot">Chiamami <Phone className="h-4 w-4"/></a>
        </div>
        <div className="mt-10 grid gap-8 border-t border-border pt-6 md:grid-cols-3"><div><span className="text-xs uppercase text-muted-foreground">Booking</span><a href="mailto:booking@lorenzoblacona.it" className="mt-3 flex items-center gap-2 text-lg"> <Mail className="h-5 w-5 text-hot"/> booking@lorenzoblacona.it</a></div><div><span className="text-xs uppercase text-muted-foreground">Telefono</span><a href="tel:+390000000000" className="mt-3 flex items-center gap-2 text-lg"><Phone className="h-5 w-5 text-hot"/> +39 000 000 0000</a></div><div><span className="text-xs uppercase text-muted-foreground">Social</span><a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 text-lg"><Instagram className="h-5 w-5 text-hot"/> Instagram</a></div></div>
        <p className="mt-14 text-xs uppercase text-muted-foreground">© 2026 Lorenzo Blaconà — Tutti i diritti riservati</p>
      </footer>

      <AnimatePresence>{modal === "cv" && <Modal title="Curriculum" close={() => setModal(null)}><p className="text-lg text-muted-foreground">Il curriculum completo in PDF sarà disponibile qui. Nel frattempo, puoi richiederlo direttamente via email.</p><a href="mailto:booking@lorenzoblacona.it?subject=Richiesta%20CV" className="mt-8 inline-flex items-center gap-2 text-hot">Richiedi il CV <ArrowUpRight/></a></Modal>}</AnimatePresence>
    </main>
  );
}