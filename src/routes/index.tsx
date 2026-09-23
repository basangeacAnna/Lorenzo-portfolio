import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Instagram, Mail, Maximize2, Phone, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
const REEL_BOX = 28;      // rem — lato del riquadro che contiene l'intera bobina
const REEL_OFFSET = 3;    // (in unità Tailwind, = 0.75rem) distanza dal bordo alto e dal bordo destro del nav: STESSA su entrambi i lati — più basso = bobina più incastrata nell'angolo
const RING_SIZE = 26;     // rem — diametro dell'anello rosa esterno
const RING_BORDER = 1;    // rem — spessore dell'anello rosa (uguale su tutto il perimetro per costruzione: è un cerchio CSS)
const HUB_SIZE = 14;      // rem — diametro del mozzo centrale chiaro
const HUB_BORDER = 0.6;   // rem — spessore del bordo del mozzo
const DOT_ORBIT = (HUB_SIZE / 2) * 0.55; // rem — raggio a cui girano i 5 forellini dentro il mozzo
// Centro della bobina rispetto al box <nav> (che è il contenitore di riferimento per gli elementi absolute):
const REEL_CENTER_LEFT = NAV_SIZE - REEL_OFFSET * 0.25 - REEL_BOX / 2; // rem dal bordo sinistro del nav
const REEL_CENTER_TOP = REEL_OFFSET * 0.25 + REEL_BOX / 2;             // rem dal bordo superiore del nav
// Le etichette girano su un arco attorno allo stesso centro della bobina (non in verticale, non incollate al centro).
// ARC_RADIUS è calcolato per stare esattamente a metà tra le due "strisce bianche": il bordo esterno del mozzo
// (HUB_SIZE/2) e il bordo interno dell'anello (RING_SIZE/2 − RING_BORDER) — così il testo, qualunque sia la sua
// larghezza, resta sempre nello spazio libero tra le due, senza toccarle.
const ARC_RADIUS = (HUB_SIZE / 2 + (RING_SIZE / 2 - RING_BORDER)) / 2; // rem dal centro della bobina
// 360°/numero di sezioni: le etichette riempiono l'INTERO cerchio (non solo un arco su un lato), così sembra
// sempre pieno di scritte che girano — anche quelle "dietro" (di fronte all'attiva) restano presenti, solo più fioche.
const ANGLE_STEP = 360 / sections.length; // gradi tra un'etichetta e la successiva, distribuite su tutto il giro
const ARC_TILT_FACTOR = 1; // 0 = testo sempre dritto, 1 = tangente piena alla curva (troppo verticale ai bordi)

function ReelNav({ active }: { active: number }) {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Un solo valore condiviso guida SIA la rotazione dell'anello SIA quella di ogni etichetta: invece di
  // animare le posizioni finali (che "taglierebbero dritto" da un punto all'altro), ruotiamo un angolo
  // continuo da cui derivano in ogni istante posizione/inclinazione/opacità — quindi il movimento segue
  // davvero la curva, come una ruota vera che gira, non un salto in linea retta tra due punti.
  const wheelAngle = useMotionValue(active * ANGLE_STEP);
  const prevActive = useRef(active);
  useEffect(() => {
    if (prevActive.current === active) return;
    prevActive.current = active;
    const target = active * ANGLE_STEP;
    const current = wheelAngle.get();
    let delta = (target - current) % 360; // percorso più breve verso il target (mai più di mezzo giro)
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    const controls = animate(wheelAngle, current + delta, { duration: 0.6, ease: [0.65, 0, 0.35, 1] });
    return () => controls.stop();
  }, [active, wheelAngle]);

  return <nav aria-label="Navigazione principale" className="fixed right-0 top-0 z-150 h-[32rem] w-[32rem] origin-top-right rounded-bl-[80%] scale-[0.38] sm:scale-[0.5] md:-right-25 md:-top-25 md:scale-[0.65] xl:scale-100">
    {/* La STESSA identica bobina ad ogni larghezza di schermo (nessuna barra/stile diverso su mobile): cambia
        solo la scala, ancorata all'angolo in alto a destra. Cellulare piccolo → tablet → desktop: 0.38 → 0.5
        (da 640px) → 0.65 (da 768px, spostata fuori bordo come voluto) → 1 (piena, da 1280px). */}
    {/* Contenitore generale (l'angolo a quarto di cerchio in alto a destra): h-/w- = dimensione totale, rounded-bl-[%] = quanto è arrotondato l'angolo */}

    <FilmStrip />
    {/* Disegnata PRIMA (quindi resta dietro, in basso nello stack) rispetto all'anello e alle etichette
        sotto: così dove tocca il bordo della bobina resta sempre sotto di essa e non sopra. */}

    {/* Riquadro dedicato alla bobina: stesso margine (REEL_OFFSET) dal lato alto e dal lato destro del nav,
        così il disco è ancorato nell'angolo in modo simmetrico invece di sfondare fuori dallo schermo. */}
    <div className="pointer-events-none absolute right-3 top-3 h-112 w-112">
      {/* right-3/top-3 = 0.75rem su entrambi i lati (REEL_OFFSET): bobina incastrata nell'angolo, h-112/w-112 = 28rem (REEL_BOX) */}
      <div className="pointer-events-none absolute inset-0 m-auto h-104 w-104 rounded-full bg-ink" />
      {/* Sfondo nero SOLO della bobina: stesso centro e stesso diametro esatto dell'anello (h-104/w-104 = 26rem,
          RING_SIZE) — un cerchio pieno, non un quadrato/quarto di cerchio, quindi non sborda mai oltre il disco.
          pointer-events-none: è solo decorazione, altrimenti "ruba" i click destinati alle etichette che gli
          passano sopra (le scritte stanno a ARC_RADIUS, più vicine al centro del raggio dell'anello stesso). */}
      <motion.div
        style={{ rotate: wheelAngle }}
        className="pointer-events-none absolute inset-0 m-auto grid h-104 w-104 place-items-center rounded-full border-[1rem] border-paper"
      >
        {/* Anello rosa che ruota: inset-0 + m-auto lo centra nel riquadro con margine UGUALE sui 4 lati (28rem − 26rem = 2rem, 1rem per lato).
            h-104/w-104 = 26rem (RING_SIZE), border-[1rem] = spessore dell'anello (RING_BORDER).
            Ruota di 360°/numero di sezioni ad ogni passo, così il giro resta coerente qualunque sia il numero di sezioni.
            pointer-events-none anche qui (decorativo, vedi sopra). */}
        <div className="absolute inset-0 m-auto h-56 w-56 rounded-full border-[0.6rem] border-paper/80 bg-muted">
          {/* Mozzo interno: inset-0 + m-auto lo centra dentro l'anello con distanza UGUALE su tutti i lati (nessun offset negativo che lo tagli).
              h-56/w-56 = 14rem (HUB_SIZE), border-[0.6rem] = spessore del suo bordo (HUB_BORDER) */}
          {[0, 1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className="absolute left-1/2 top-1/2 h-[1.3rem] w-[1.3rem] rounded-full bg-ink ring-1 ring-paper/30"
              style={{ transform: `translate(-50%,-50%) rotate(${n * 72}deg) translateY(-${DOT_ORBIT}rem)` }}
            />
          ))}
          {/* I 5 forellini decorativi, equidistanti dal centro del mozzo (DOT_ORBIT = raggio).
              ring-1 ring-paper/30: un sottile bordo chiaro che li stacca dal mozzo (bg-muted), che essendo
              scuro anch'esso li rendeva poco visibili — senza il bordo si "perdevano" nello sfondo. */}
          <span className="absolute left-1/2 top-1/2 h-[0.85rem] w-[0.85rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink ring-1 ring-paper/30" />
          {/* Puntino centrale, stesso trattamento */}
        </div>
      </motion.div>
    </div>

    {/* Etichette: girano su un arco attorno allo STESSO centro della bobina (l'anello/mozzo), non incollate al
        centro: quella attiva è sulla sinistra dell'anello, le altre proseguono la curva sopra e sotto di lei.
        Restano tutte montate insieme e scivolano fluide sulla curva quando cambi sezione — su ogni larghezza di
        schermo, dato che ora tutta la bobina (con le sue etichette) scala insieme invece di sparire su mobile.
        L'elenco è "a loop": dopo l'ultima sezione si ricollega alla prima, come un giro completo di bobina.
        Verso: la sezione attiva sale progressivamente e lascia il posto a quella dopo, che sale da sotto —
        lo stesso verso in cui ruota l'anello (orario: rotate cresce con "active"). */}
    <div
      className="pointer-events-none absolute"
      style={{ left: `${REEL_CENTER_LEFT}rem`, top: `${REEL_CENTER_TOP}rem` }}
    >
      {/* Questo div è solo il PERNO (larghezza/altezza zero) nel centro esatto della bobina */}
      {sections.map((label, i) => (
        <ReelLabel
          key={label}
          label={label}
          index={i}
          active={active}
          wheelAngle={wheelAngle}
          onNavigate={() => go(ids[i] ?? "top")}
        />
      ))}
    </div>
  </nav>;
}

// --- Pellicola che scende dalla bobina ---
// Vista di fronte (non di taglio), come una vera pellicola: striscia NERA con due colonne di forellini
// BIANCHI ai bordi, e un riquadro BIANCO (il "fotogramma") al centro di ognuna — non il contrario.
const FILM_WIDTH = 4.2;    // rem — larghezza della striscia (allargata per dare respiro ai margini neri ai lati)
const FILM_FRAME = 6;      // rem — altezza totale di un ciclo (un fotogramma + lo spazio nero prima del successivo)
const FILM_FRAME_GAP = 0.5; // rem — spazio nero tra un fotogramma bianco e il successivo
const FILM_FRAME_WIDTH = 1.8; // rem — larghezza del riquadro bianco centrale (il fotogramma)
const FILM_HOLE = 0.45;    // rem — lato di ogni forellino (quadrato)
const FILM_HOLE_GAP = 1.4; // rem — passo tra un forellino e il successivo (forellino + spazio vuoto)
// Margine nero da entrambi i lati del forellino: (spazio nero totale ai lati del fotogramma − larghezza del
// forellino) diviso 2 — così il forellino resta sempre esattamente a metà del bordo nero, qualunque sia
// FILM_WIDTH, invece di un valore fisso che poteva finire storto se la striscia cambiava larghezza.
const FILM_HOLE_INSET = ((FILM_WIDTH - FILM_FRAME_WIDTH) / 2 - FILM_HOLE) / 2; // rem
const FILM_MAX_VH = 82;    // fino a che percentuale dell'altezza schermo può arrivare, a scroll ultimato

function FilmStrip() {
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, [0, 1], ["0vh", `${FILM_MAX_VH}vh`]);
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute overflow-hidden"
      style={{ right: "6.5rem", top: "22.25rem", width: `${FILM_WIDTH}rem`, height }}
    >
      {/* Ora dentro al <nav>, POSIZIONATA nelle sue stesse coordinate (non più "fixed" indipendente): eredita
          automaticamente la stessa scala/posizione della bobina ad ogni larghezza di schermo (telefono
          compreso), invece di dover essere riallineata a mano per ogni breakpoint. right/top qui sono relativi
          all'angolo del <nav> (32rem), tarati per restare appena sotto la parte visibile della bobina. */}
      {/* L'altezza di QUESTO contenitore (che taglia/nasconde ciò che eccede) cresce con lo scroll della pagina:
          non è la pellicola a stirarsi, è il contenitore che ne rivela sempre di più mano a mano che scorri —
          il motivo interno sotto è un pattern che si ripete all'infinito (repeat-y), sempre alla stessa scala. */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "400vh",
          backgroundColor: "#000000",
          backgroundImage: [
            // Forellini bianchi, colonna sinistra e destra (quadratini che si ripetono, sfondo nero a vista tra uno e l'altro)
            `repeating-linear-gradient(to bottom, #ffffff 0px, #ffffff ${FILM_HOLE}rem, transparent ${FILM_HOLE}rem ${FILM_HOLE_GAP}rem)`,
            `repeating-linear-gradient(to bottom, #ffffff 0px, #ffffff ${FILM_HOLE}rem, transparent ${FILM_HOLE}rem ${FILM_HOLE_GAP}rem)`,
            // Riquadro bianco centrale (il "fotogramma"), con uno spazio nero prima del successivo
            `repeating-linear-gradient(to bottom, #ffffff 0px, #ffffff ${FILM_FRAME - FILM_FRAME_GAP}rem, transparent ${FILM_FRAME - FILM_FRAME_GAP}rem ${FILM_FRAME}rem)`,
          ].join(", "),
          backgroundPosition: `${FILM_HOLE_INSET}rem 0, right ${FILM_HOLE_INSET}rem top 0, center top`,
          backgroundSize: `${FILM_HOLE}rem 100%, ${FILM_HOLE}rem 100%, ${FILM_FRAME_WIDTH}rem 100%`,
          backgroundRepeat: "repeat-y, repeat-y, repeat-y",
        }}
      />
    </motion.div>
  );
}

function ReelLabel({ label, index, active, wheelAngle, onNavigate }: {
  label: string;
  index: number;
  active: number;
  wheelAngle: MotionValue<number>;
  onNavigate: () => void;
}) {
  // Angolo "di riposo" (wheelAngle = 0) di questa etichetta; l'angolo reale in ogni istante è baseAngle + wheelAngle.
  const baseAngle = 180 - index * ANGLE_STEP;
  const left = useTransform(wheelAngle, (w) => `${ARC_RADIUS * Math.cos(((baseAngle + w) * Math.PI) / 180)}rem`);
  const top = useTransform(wheelAngle, (w) => `${ARC_RADIUS * Math.sin(((baseAngle + w) * Math.PI) / 180)}rem`);
  const rotate = useTransform(wheelAngle, (w) => (baseAngle + w - 180) * ARC_TILT_FACTOR);
  // "Quanti passi" questa etichetta è dall'attiva in questo istante, ricavato dall'angolo corrente: così la
  // sfumatura resta corretta anche a metà di un movimento, non solo a riposo.
  // wheelAngle non torna mai a 0 dopo un giro (si accumula, es. può finire a -60 invece di 300 dopo un loop
  // all'indietro): senza "riportarlo" nel giro corretto (mod n), qui il conteggio sballava e l'etichetta
  // davvero attiva poteva risultare quella più sbiadita invece che quella più in evidenza — da qui il bug
  // notato passando da Contatti a Home.
  const opacity = useTransform(wheelAngle, (w) => {
    const n = sections.length;
    let diff = (index - w / ANGLE_STEP) % n;
    if (diff > n / 2) diff -= n;
    if (diff < -n / 2) diff += n;
    return Math.max(0.55, 1 - Math.abs(diff) * 0.16);
  });

  return (
    <motion.div
      style={{ position: "absolute", left, top, rotate, opacity, x: "-50%", y: "-50%", transformOrigin: "50% 50%" }}
      className="pointer-events-auto"
    >
      {/* x:"-50%" + y:"-50%": il CENTRO del blocco resta sul punto dell'arco — così ogni etichetta sporge al
          massimo di metà della sua larghezza (fissa, uguale per tutte) dal proprio punto, che resta sempre
          dentro al raggio della bobina anche alla rotazione più estrema. */}
      <Button
        variant="ghost"
        onClick={onNavigate}
        style={{ textShadow: "0 0 5px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.75), 0 1px 2px rgba(0,0,0,0.9)" }}
        className={`h-auto w-[4rem] whitespace-normal break-words px-0 text-center font-display text-sm font-semibold uppercase leading-none hover:bg-transparent ${active === index ? "text-signal" : "text-paper hover:text-signal"}`}
      >
        {/* Nessun numero (tolto su richiesta), MAIUSCOLO, e — punto chiave — stessa dimensione/peso sia attiva
            che no: cambia SOLO il colore (rosso "signal", lo stesso della linea, al posto del rosa), con una
            dissolvenza morbida (transition-colors, già di base sul Button) invece di un ingrandimento — così
            l'unica cosa che si "muove" resta la bobina che gira, fluida.
            w-[6rem] fisso + centro ancorato al punto dell'arco (ARC_RADIUS, ora a metà tra le due strisce
            bianche): l'etichetta resta sempre nello spazio libero tra il mozzo e l'anello, mai sopra le strisce. */}
        {label}
      </Button>
    </motion.div>
  );
}

function PhotoFrame({ label, tall = false }: { label: string; tall?: boolean }) {
  return <div className={`group relative overflow-hidden border border-paper/35 bg-muted ${tall ? "min-h-[34rem]" : "min-h-72"}`}><div className="absolute inset-4 border border-dashed border-paper/20"/><div className="absolute bottom-5 left-5 font-display text-xs uppercase text-muted-foreground">{label} · foto</div><Maximize2 className="absolute right-5 top-5 h-5 w-5 text-hot transition-transform group-hover:scale-125" /></div>;
}

function Modal({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] grid place-items-center bg-ink/90 p-5" onClick={close}><motion.div initial={{ y: 40, rotate: -1 }} animate={{ y: 0, rotate: 0 }} exit={{ y: 30, opacity: 0 }} onClick={e => e.stopPropagation()} className="max-h-[85vh] w-full max-w-4xl overflow-y-auto border border-hot bg-card p-6 md:p-12"><div className="mb-10 flex items-start justify-between gap-4"><h2 className="font-display text-4xl md:text-6xl">{title}</h2><Button size="icon" variant="ghost" aria-label="Chiudi" onClick={close}><X /></Button></div>{children}</motion.div></motion.div>;
}

function Index() {
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState<"cv" | "gallery" | "news" | null>(null);
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", v => setActive(Math.min(sections.length - 1, Math.floor(v * sections.length))));

  return (
    <main className="relative bg-background text-foreground">
      <ReelNav active={active} />
      <FilmStrip />
      <svg aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70" viewBox="0 0 1200 900" preserveAspectRatio="none"><path d="M-100 700 C 260 310, 500 980, 1300 160" fill="none" stroke="var(--signal)" strokeWidth="22"/><path className="neon-trail" d="M-100 770 C 300 350, 650 1000, 1300 290" fill="none" stroke="var(--hot)" strokeWidth="6"/></svg>

      <section id="top" className="relative z-10 grid min-h-[100vh] items-end px-5 pb-14 pt-8 md:grid-cols-[1.1fr_.9fr] md:px-10 lg:px-16">
        <div className="relative z-10 md:pb-10"><div className="mb-8 font-display text-sm uppercase text-hot">Portfolio / 2026</div><h1 className="max-w-5xl font-display text-[clamp(4rem,10vw,9rem)] font-bold uppercase leading-[.78]">Lorenzo<br/><span className="text-transparent [-webkit-text-stroke:1px_var(--paper)]">Blaconà</span></h1><p className="mt-8 font-display text-base uppercase md:text-xl">Attore • Cantante • Scrittore • Grafico</p><blockquote className="mt-12 border-l-2 border-hot pl-5 text-xl italic text-muted-foreground">“Un inguaribile sognatore...”</blockquote><ArrowDownRight className="mt-10 h-10 w-10 text-hot" /></div>
        <div className="relative hidden h-[75vh] md:block"><div className="absolute inset-10 right-20 rotate-2 border-2 border-hot bg-muted"><span className="absolute bottom-5 left-5 text-xs uppercase text-muted-foreground">Ritratto principale · placeholder</span></div></div>
      </section>

      <section id="bio" className="relative z-10 min-h-screen bg-paper px-5 py-24 text-ink md:px-12 lg:px-20"><div className="grid max-w-6xl gap-12 md:grid-cols-[.8fr_1.2fr]"><PhotoFrame label="Ritratto bio" tall/><div className="md:pt-24"><p className="font-display text-sm uppercase text-hot">02 / Bio</p><h2 className="mt-4 font-display text-5xl font-bold uppercase leading-none md:text-8xl">Tra palco<br/>e immagine.</h2><p className="mt-10 max-w-xl text-lg leading-relaxed">Lorenzo Blaconà attraversa linguaggi e discipline con uno sguardo personale: recitazione, voce, scrittura e progetto grafico diventano parti della stessa ricerca artistica. Una biografia in movimento, costruita tra scena, ascolto e immaginazione.</p><Button onClick={() => setModal("cv")} className="mt-10 rounded-none bg-ink px-7 py-6 text-paper hover:bg-hot">Vedi di più CV <ArrowUpRight/></Button></div></div></section>

      <section id="lavori" className="relative z-10 min-h-screen bg-ink px-5 py-24 md:px-12 lg:px-20"><p className="font-display text-sm uppercase text-hot">03 / Lavori</p><h2 className="mt-4 max-w-4xl font-display text-6xl font-bold uppercase leading-none xl:text-9xl">Quattro<br/>linguaggi.</h2><div className="mt-16 border-t border-border">{[["Attore","Teatro, cinema e performance"],["Cantante","Voce, musica e presenza scenica"],["Scrittore","Testi, drammaturgia e narrazione"],["Grafico","Identità, manifesti e comunicazione"]].map((x,i)=><motion.article whileHover={{ x: 12 }} key={x[0]} className="grid grid-cols-[3rem_1fr_auto] items-center border-b border-border py-7"><span className="text-hot">0{i+1}</span><h3 className="font-display text-3xl md:text-5xl">{x[0]}</h3><p className="hidden text-muted-foreground md:block">{x[1]}</p></motion.article>)}</div><a href="mailto:booking@lorenzoblacona.it?subject=Richiesta%20scheda%20agenzia" className="mt-12 inline-flex items-center gap-2 font-display text-lg text-hot">Vedi di più → Scheda Agenzia <ArrowUpRight className="h-5 w-5"/></a></section>

      <section id="galleria" className="relative z-10 min-h-screen bg-paper px-5 py-24 text-ink md:px-12 lg:px-20"><div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4"><div><p className="font-display text-sm uppercase text-hot">04 / Galleria</p><h2 className="mt-4 break-words font-display text-5xl font-bold uppercase xl:text-8xl">Fotogrammi.</h2></div><Button onClick={() => setModal("gallery")} variant="outline" className="hidden rounded-none border-ink bg-transparent md:flex">Vedi tutte le foto <ArrowUpRight/></Button></div><div className="mt-14 grid gap-4 md:grid-cols-3"><div className="md:col-span-2"><PhotoFrame label="Scena 01"/></div><PhotoFrame label="Ritratto 02"/><PhotoFrame label="Backstage 03"/><div className="md:col-span-2"><PhotoFrame label="Performance 04"/></div></div><Button onClick={() => setModal("gallery")} className="mt-8 rounded-none md:hidden">Vedi tutte le foto</Button></section>

      <section id="press" className="relative z-10 min-h-screen bg-signal px-5 py-24 text-paper md:px-12 lg:px-20"><p className="font-display text-sm uppercase">05 / Parlano di me</p><h2 className="mt-4 max-w-4xl font-display text-6xl font-bold uppercase leading-none xl:text-9xl">Rassegna<br/>stampa.</h2><div className="mt-16 grid gap-px bg-paper/30 md:grid-cols-3">{["Una presenza scenica magnetica","Nuove voci della scena italiana","Il segno incontra la parola"].map((t,i)=><article key={t} className="min-h-80 bg-signal p-7"><span className="text-xs uppercase">Articolo 0{i+1} / Placeholder</span><h3 className="mt-20 font-display text-3xl leading-tight">{t}</h3><p className="mt-5 text-paper/75">Testata, data e breve estratto saranno inseriti qui.</p></article>)}</div><Button onClick={() => setModal("news")} className="mt-10 rounded-none bg-paper text-ink hover:bg-ink hover:text-paper">Vedi di più news <ArrowUpRight/></Button></section>

      <footer id="contatti" className="relative z-10 min-h-[85vh] bg-ink px-5 py-24 md:px-12 lg:px-20"><p className="font-display text-sm uppercase text-hot">06 / Contatti</p><h2 className="mt-4 max-w-5xl font-display text-[clamp(4rem,10vw,9rem)] font-bold uppercase leading-[.82]">Facciamo<br/><span className="text-hot">qualcosa.</span></h2><div className="mt-20 grid gap-10 border-t border-border pt-8 md:grid-cols-3"><div><span className="text-xs uppercase text-muted-foreground">Booking</span><a href="mailto:booking@lorenzoblacona.it" className="mt-3 flex items-center gap-2 text-lg"> <Mail className="h-5 w-5 text-hot"/> booking@lorenzoblacona.it</a></div><div><span className="text-xs uppercase text-muted-foreground">Telefono</span><a href="tel:+390000000000" className="mt-3 flex items-center gap-2 text-lg"><Phone className="h-5 w-5 text-hot"/> +39 000 000 0000</a></div><div><span className="text-xs uppercase text-muted-foreground">Social</span><a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 text-lg"><Instagram className="h-5 w-5 text-hot"/> Instagram</a></div></div><p className="mt-28 text-xs uppercase text-muted-foreground">© 2026 Lorenzo Blaconà — Tutti i diritti riservati</p></footer>

      <AnimatePresence>{modal === "cv" && <Modal title="Curriculum" close={() => setModal(null)}><p className="text-lg text-muted-foreground">Il curriculum completo in PDF sarà disponibile qui. Nel frattempo, puoi richiederlo direttamente via email.</p><a href="mailto:booking@lorenzoblacona.it?subject=Richiesta%20CV" className="mt-8 inline-flex items-center gap-2 text-hot">Richiedi il CV <ArrowUpRight/></a></Modal>}{modal === "gallery" && <Modal title="Galleria" close={() => setModal(null)}><div className="grid gap-4 sm:grid-cols-2"><PhotoFrame label="Galleria 01"/><PhotoFrame label="Galleria 02"/><PhotoFrame label="Galleria 03"/><PhotoFrame label="Galleria 04"/></div></Modal>}{modal === "news" && <Modal title="News & Press" close={() => setModal(null)}><div className="space-y-7">{[1,2,3].map(n=><div key={n} className="border-b border-border pb-7"><span className="text-xs uppercase text-hot">News 0{n}</span><h3 className="mt-2 font-display text-2xl">Titolo dell’articolo in arrivo</h3><p className="mt-2 text-muted-foreground">Spazio predisposto per interviste, recensioni e nuove pubblicazioni.</p></div>)}</div></Modal>}</AnimatePresence>
    </main>
  );
}