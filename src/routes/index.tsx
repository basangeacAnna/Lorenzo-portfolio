import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Instagram, Mail, Maximize2, Phone, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

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

// "top" = la primissima schermata (hero, senza scroll): prima non aveva un suo posto nel menu/rotazione,
// ora è la sezione 01 a tutti gli effetti, e "Bio" (la scheda biografica più sotto) diventa la 02.
const sections = ["Home", "Bio", "Lavori", "Galleria", "Parlano di me", "Contatti"];
const ids = ["top", "bio", "lavori", "galleria", "press", "contatti"];

// --- Geometria della bobina (disco decorativo in alto a destra) ---
// Tutte le misure sono legate a queste poche costanti: cambiandole, cerchi e testo
// restano sempre coerenti e concentrici tra loro.
const NAV_SIZE = 32;      // rem — lato del <nav> quadrato: il contenitore di riferimento per bobina ed etichetta
const REEL_BOX = 24;      // rem — lato del riquadro che contiene l'intera bobina
const REEL_OFFSET = 3;    // (in unità Tailwind, = 0.75rem) distanza dal bordo alto e dal bordo destro del nav: STESSA su entrambi i lati — più basso = bobina più incastrata nell'angolo
const RING_SIZE = 22;     // rem — diametro dell'anello rosa esterno
const RING_BORDER = 1;    // rem — spessore dell'anello rosa (uguale su tutto il perimetro per costruzione: è un cerchio CSS)
const HUB_SIZE = 12;      // rem — diametro del mozzo centrale chiaro
const HUB_BORDER = 0.6;   // rem — spessore del bordo del mozzo
const DOT_ORBIT = (HUB_SIZE / 2) * 0.55; // rem — raggio a cui girano i 5 forellini dentro il mozzo
// Centro della bobina rispetto al box <nav> (che è il contenitore di riferimento per gli elementi absolute):
const REEL_CENTER_LEFT = NAV_SIZE - REEL_OFFSET * 0.25 - REEL_BOX / 2; // rem dal bordo sinistro del nav
const REEL_CENTER_TOP = REEL_OFFSET * 0.25 + REEL_BOX / 2;             // rem dal bordo superiore del nav
// Le etichette girano su un arco attorno allo stesso centro della bobina (non in verticale, non incollate al centro)
const ARC_RADIUS = RING_SIZE / 3  ; // rem dal centro della bobina
const ANGLE_STEP = 35; // gradi tra un'etichetta e la successiva sull'arco
const ARC_TILT_FACTOR = 1; // 0 = testo sempre dritto, 1 = tangente piena alla curva (troppo verticale ai bordi)

function ReelNav({ active }: { active: number }) {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return <nav aria-label="Navigazione principale" className="fixed bottom-0 left-0 z-150 w-full border-t border-border bg-ink/95 backdrop-blur md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-[32rem] md:w-[32rem] md:rounded-bl-[80%]">
    {/* Contenitore generale (l'angolo a quarto di cerchio in alto a destra): h-/w- = dimensione totale, rounded-bl-[%] = quanto è arrotondato l'angolo */}

    {/* Riquadro dedicato alla bobina: stesso margine (REEL_OFFSET) dal lato alto e dal lato destro del nav,
        così il disco è ancorato nell'angolo in modo simmetrico invece di sfondare fuori dallo schermo. */}
    <div className="absolute right-3 top-3 hidden h-96 w-96 md:block">
      {/* right-3/top-3 = 0.75rem su entrambi i lati (REEL_OFFSET): bobina incastrata nell'angolo, h-96/w-96 = 24rem (REEL_BOX) */}
      <motion.div
        animate={{ rotate: active * (360 / sections.length) }}
        transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        className="absolute inset-0 m-auto grid h-88 w-88 place-items-center rounded-full border-[1rem] border-hot"
      >
        {/* Anello rosa che ruota: inset-0 + m-auto lo centra nel riquadro con margine UGUALE sui 4 lati (24rem − 22rem = 2rem, 1rem per lato).
            h-88/w-88 = 22rem (RING_SIZE), border-[1rem] = spessore dell'anello (RING_BORDER).
            Ruota di 360°/numero di sezioni ad ogni passo, così il giro resta coerente qualunque sia il numero di sezioni. */}
        <div className="absolute inset-0 m-auto h-48 w-48 rounded-full border-[0.6rem] border-paper/80 bg-muted">
          {/* Mozzo interno: inset-0 + m-auto lo centra dentro l'anello con distanza UGUALE su tutti i lati (nessun offset negativo che lo tagli).
              h-48/w-48 = 12rem (HUB_SIZE), border-[0.6rem] = spessore del suo bordo (HUB_BORDER) */}
          {[0, 1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className="absolute left-1/2 top-1/2 h-[1.3rem] w-[1.3rem] rounded-full bg-ink"
              style={{ transform: `translate(-50%,-50%) rotate(${n * 72}deg) translateY(-${DOT_ORBIT}rem)` }}
            />
          ))}
          {/* I 5 forellini decorativi, equidistanti dal centro del mozzo (DOT_ORBIT = raggio) */}
          <span className="absolute left-1/2 top-1/2 h-[0.85rem] w-[0.85rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
          {/* Puntino centrale */}
        </div>
      </motion.div>
    </div>

    {/* Menu mobile: invariato, riga orizzontale in basso */}
    <div className="grid h-20 grid-cols-6 items-center gap-1 px-2 md:hidden">
      {sections.map((label, i) => (
        <Button
          key={label}
          variant="ghost"
          onClick={() => go(ids[i] ?? "top")}
          className={`h-auto min-w-0 px-1 font-display text-[10px] uppercase tracking-normal ${active === i ? "text-hot" : "text-paper hover:text-hot"}`}
        >
          {label}
        </Button>
      ))}
    </div>

    {/* Menu desktop: le etichette girano su un arco attorno allo STESSO centro della bobina (l'anello/mozzo),
        non incollate al centro: quella attiva è sulla sinistra dell'anello, le altre proseguono la curva
        sopra e sotto di lei. Restano tutte montate insieme e scivolano fluide sulla curva quando cambi sezione.
        L'elenco è "a loop": dopo l'ultima sezione si ricollega alla prima, come un giro completo di bobina.
        Verso: la sezione attiva sale progressivamente e lascia il posto a quella dopo, che sale da sotto —
        lo stesso verso in cui ruota l'anello (orario: rotate cresce con "active"). */}
    <div
      className="pointer-events-none absolute hidden md:block"
      style={{ left: `${REEL_CENTER_LEFT}rem`, top: `${REEL_CENTER_TOP}rem` }}
    >
      {/* Questo div è solo il PERNO (larghezza/altezza zero) nel centro esatto della bobina */}
      {sections.map((label, i) => {
        const n = sections.length;
        let diff = (i - active + n) % n; // distanza "in avanti" lungo il giro, sempre positiva (0..n-1)
        if (diff > n / 2) diff -= n; // riportata alla distanza più breve: così il loop si chiude (dopo l'ultima torna alla prima)
        // diff negativo = sezione già passata (sale sopra il centro), diff positivo = deve ancora arrivare (è sotto, in attesa di salire) —
        // stesso verso della rotazione oraria dell'anello.
        const angle = 180 - diff * ANGLE_STEP; // 180° = punto centrale, appena a sinistra dell'anello
        const rad = (angle * Math.PI) / 180;
        const x = ARC_RADIUS * Math.cos(rad); // rem, posizione lungo l'arco rispetto al perno
        const y = ARC_RADIUS * Math.sin(rad);
        const tilt = (angle - 180) * ARC_TILT_FACTOR; // segue la curva, smorzata per restare leggibile
        const opacity = Math.max(0, 1 - Math.abs(diff) * 0.28); // le etichette lontane dall'attiva sfumano via
        return (
          <motion.div
            key={label}
            animate={{ left: `${x}rem`, top: `${y}rem`, rotate: tilt, opacity, x: "-100%", y: "-50%" }}
            transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
            style={{ position: "absolute", transformOrigin: "100% 50%" }}
            className={opacity > 0.05 ? "pointer-events-auto" : "pointer-events-none"}
            aria-hidden={opacity <= 0.05}
          >
            {/* Stessa durata/curva di easing dell'anello (nessuna molla): tutte le etichette e la bobina si
                muovono in perfetto sincrono, come gli scatti di una rotella telefonica invece di rimbalzare
                ognuna per conto proprio. */}
            {/* x:"-100%" + y:"-50%" ancorano il BORDO destro del testo al punto sull'arco (qualunque sia la
                lunghezza dell'etichetta) e lo centrano verticalmente, così non "sbatte" mai contro l'anello rosa. */}
            <Button
              variant="ghost"
              onClick={() => go(ids[i] ?? "top")}
              className={`h-auto w-max justify-start whitespace-nowrap px-1 font-display normal-case ${active === i ? "text-3xl font-bold text-hot" : "text-2xl text-paper hover:text-hot"}`}
            >
              <span className="mr-2 text-base text-hot">0{i + 1}</span>
              {label}
            </Button>
          </motion.div>
        );
      })}
    </div>

    <div className="absolute bottom-0 right-9 hidden h-36 w-16 border-x-4 border-paper/70 md:block">
      {/* Striscia "pellicola" perforata: h-/w- del contenitore = dimensione totale striscia, h-N di ogni <span> = altezza di ogni fotogramma */}
      {[0, 1, 2, 3, 4].map(n => <span key={n} className="block h-5 border-b-4 border-paper/70" />)}
    </div>
  </nav>;
}

function PhotoFrame({ label, tall = false }: { label: string; tall?: boolean }) {
  return <div className={`group relative overflow-hidden border border-paper/35 bg-muted ${tall ? "min-h-[34rem]" : "min-h-72"}`}><div className="absolute inset-4 border border-dashed border-paper/20"/><div className="absolute bottom-5 left-5 font-display text-xs uppercase text-muted-foreground">{label} · foto</div><Maximize2 className="absolute right-5 top-5 h-5 w-5 text-hot transition-transform group-hover:scale-125" /></div>;
}

function Modal({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] grid place-items-center bg-ink/90 p-5" onClick={close}><motion.div initial={{ y: 40, rotate: -1 }} animate={{ y: 0, rotate: 0 }} exit={{ y: 30, opacity: 0 }} onClick={e => e.stopPropagation()} className="max-h-[85vh] w-full max-w-4xl overflow-y-auto border border-hot bg-card p-6 md:p-12"><div className="mb-10 flex items-start justify-between gap-4"><h2 className="font-display text-4xl md:text-6xl">{title}</h2><Button size="icon" variant="ghost" aria-label="Chiudi" onClick={close}><X /></Button></div>{children}</motion.div></motion.div>;
}

function Index() {
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState<"cv" | "gallery" | "news" | null>(null);
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", v => setActive(Math.min(sections.length - 1, Math.floor(v * sections.length))));
  useEffect(() => { document.body.style.paddingBottom = "0"; }, []);

  return (
    <main className="relative bg-background pb-20 text-foreground md:pb-0">
      <ReelNav active={active} />
      <svg aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70" viewBox="0 0 1200 900" preserveAspectRatio="none"><path d="M-100 700 C 260 310, 500 980, 1300 160" fill="none" stroke="var(--signal)" strokeWidth="22"/><path className="neon-trail" d="M-100 770 C 300 350, 650 1000, 1300 290" fill="none" stroke="var(--hot)" strokeWidth="6"/></svg>

      <section id="top" className="relative z-10 grid min-h-[100vh] items-end px-5 pb-14 pt-8 md:grid-cols-[1.1fr_.9fr] md:px-10 lg:px-16">
        <div className="relative z-10 md:pb-10"><div className="mb-8 font-display text-sm uppercase text-hot">Portfolio / 2026</div><h1 className="max-w-5xl font-display text-[clamp(4rem,10vw,9rem)] font-bold uppercase leading-[.78]">Lorenzo<br/><span className="text-transparent [-webkit-text-stroke:1px_var(--paper)]">Blaconà</span></h1><p className="mt-8 font-display text-base uppercase md:text-xl">Attore • Cantante • Scrittore • Grafico</p><blockquote className="mt-12 border-l-2 border-hot pl-5 text-xl italic text-muted-foreground">“Un inguaribile sognatore...”</blockquote><ArrowDownRight className="mt-10 h-10 w-10 text-hot" /></div>
        <div className="relative hidden h-[75vh] md:block"><div className="absolute inset-10 right-20 rotate-2 border-2 border-hot bg-muted"><span className="absolute bottom-5 left-5 text-xs uppercase text-muted-foreground">Ritratto principale · placeholder</span></div></div>
      </section>

      <section id="bio" className="relative z-10 min-h-screen bg-paper px-5 py-24 text-ink md:px-12 lg:px-20"><div className="grid max-w-6xl gap-12 md:grid-cols-[.8fr_1.2fr]"><PhotoFrame label="Ritratto bio" tall/><div className="md:pt-24"><p className="font-display text-sm uppercase text-hot">02 / Bio</p><h2 className="mt-4 font-display text-5xl font-bold uppercase leading-none md:text-8xl">Tra palco<br/>e immagine.</h2><p className="mt-10 max-w-xl text-lg leading-relaxed">Lorenzo Blaconà attraversa linguaggi e discipline con uno sguardo personale: recitazione, voce, scrittura e progetto grafico diventano parti della stessa ricerca artistica. Una biografia in movimento, costruita tra scena, ascolto e immaginazione.</p><Button onClick={() => setModal("cv")} className="mt-10 rounded-none bg-ink px-7 py-6 text-paper hover:bg-hot">Vedi di più CV <ArrowUpRight/></Button></div></div></section>

      <section id="lavori" className="relative z-10 min-h-screen bg-ink px-5 py-24 md:px-12 lg:px-20"><p className="font-display text-sm uppercase text-hot">03 / Lavori</p><h2 className="mt-4 max-w-4xl font-display text-6xl font-bold uppercase leading-none md:text-9xl">Quattro<br/>linguaggi.</h2><div className="mt-16 border-t border-border">{[["Attore","Teatro, cinema e performance"],["Cantante","Voce, musica e presenza scenica"],["Scrittore","Testi, drammaturgia e narrazione"],["Grafico","Identità, manifesti e comunicazione"]].map((x,i)=><motion.article whileHover={{ x: 12 }} key={x[0]} className="grid grid-cols-[3rem_1fr_auto] items-center border-b border-border py-7"><span className="text-hot">0{i+1}</span><h3 className="font-display text-3xl md:text-5xl">{x[0]}</h3><p className="hidden text-muted-foreground md:block">{x[1]}</p></motion.article>)}</div><a href="mailto:booking@lorenzoblacona.it?subject=Richiesta%20scheda%20agenzia" className="mt-12 inline-flex items-center gap-2 font-display text-lg text-hot">Vedi di più → Scheda Agenzia <ArrowUpRight className="h-5 w-5"/></a></section>

      <section id="galleria" className="relative z-10 min-h-screen bg-paper px-5 py-24 text-ink md:px-12 lg:px-20"><div className="flex items-end justify-between gap-6"><div><p className="font-display text-sm uppercase text-hot">04 / Galleria</p><h2 className="mt-4 font-display text-6xl font-bold uppercase md:text-9xl">Fotogrammi.</h2></div><Button onClick={() => setModal("gallery")} variant="outline" className="hidden rounded-none border-ink bg-transparent md:flex">Vedi tutte le foto <ArrowUpRight/></Button></div><div className="mt-14 grid gap-4 md:grid-cols-3"><div className="md:col-span-2"><PhotoFrame label="Scena 01"/></div><PhotoFrame label="Ritratto 02"/><PhotoFrame label="Backstage 03"/><div className="md:col-span-2"><PhotoFrame label="Performance 04"/></div></div><Button onClick={() => setModal("gallery")} className="mt-8 rounded-none md:hidden">Vedi tutte le foto</Button></section>

      <section id="press" className="relative z-10 min-h-screen bg-signal px-5 py-24 text-paper md:px-12 lg:px-20"><p className="font-display text-sm uppercase">05 / Parlano di me</p><h2 className="mt-4 max-w-4xl font-display text-6xl font-bold uppercase leading-none md:text-9xl">Rassegna<br/>stampa.</h2><div className="mt-16 grid gap-px bg-paper/30 md:grid-cols-3">{["Una presenza scenica magnetica","Nuove voci della scena italiana","Il segno incontra la parola"].map((t,i)=><article key={t} className="min-h-80 bg-signal p-7"><span className="text-xs uppercase">Articolo 0{i+1} / Placeholder</span><h3 className="mt-20 font-display text-3xl leading-tight">{t}</h3><p className="mt-5 text-paper/75">Testata, data e breve estratto saranno inseriti qui.</p></article>)}</div><Button onClick={() => setModal("news")} className="mt-10 rounded-none bg-paper text-ink hover:bg-ink hover:text-paper">Vedi di più news <ArrowUpRight/></Button></section>

      <footer id="contatti" className="relative z-10 min-h-[85vh] bg-ink px-5 py-24 md:px-12 lg:px-20"><p className="font-display text-sm uppercase text-hot">06 / Contatti</p><h2 className="mt-4 max-w-5xl font-display text-[clamp(4rem,10vw,9rem)] font-bold uppercase leading-[.82]">Facciamo<br/><span className="text-hot">qualcosa.</span></h2><div className="mt-20 grid gap-10 border-t border-border pt-8 md:grid-cols-3"><div><span className="text-xs uppercase text-muted-foreground">Booking</span><a href="mailto:booking@lorenzoblacona.it" className="mt-3 flex items-center gap-2 text-lg"> <Mail className="h-5 w-5 text-hot"/> booking@lorenzoblacona.it</a></div><div><span className="text-xs uppercase text-muted-foreground">Telefono</span><a href="tel:+390000000000" className="mt-3 flex items-center gap-2 text-lg"><Phone className="h-5 w-5 text-hot"/> +39 000 000 0000</a></div><div><span className="text-xs uppercase text-muted-foreground">Social</span><a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 text-lg"><Instagram className="h-5 w-5 text-hot"/> Instagram</a></div></div><p className="mt-28 text-xs uppercase text-muted-foreground">© 2026 Lorenzo Blaconà — Tutti i diritti riservati</p></footer>

      <AnimatePresence>{modal === "cv" && <Modal title="Curriculum" close={() => setModal(null)}><p className="text-lg text-muted-foreground">Il curriculum completo in PDF sarà disponibile qui. Nel frattempo, puoi richiederlo direttamente via email.</p><a href="mailto:booking@lorenzoblacona.it?subject=Richiesta%20CV" className="mt-8 inline-flex items-center gap-2 text-hot">Richiedi il CV <ArrowUpRight/></a></Modal>}{modal === "gallery" && <Modal title="Galleria" close={() => setModal(null)}><div className="grid gap-4 sm:grid-cols-2"><PhotoFrame label="Galleria 01"/><PhotoFrame label="Galleria 02"/><PhotoFrame label="Galleria 03"/><PhotoFrame label="Galleria 04"/></div></Modal>}{modal === "news" && <Modal title="News & Press" close={() => setModal(null)}><div className="space-y-7">{[1,2,3].map(n=><div key={n} className="border-b border-border pb-7"><span className="text-xs uppercase text-hot">News 0{n}</span><h3 className="mt-2 font-display text-2xl">Titolo dell’articolo in arrivo</h3><p className="mt-2 text-muted-foreground">Spazio predisposto per interviste, recensioni e nuove pubblicazioni.</p></div>)}</div></Modal>}</AnimatePresence>
    </main>
  );
}