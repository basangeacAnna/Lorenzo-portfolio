import { useNavigate } from "@tanstack/react-router";
import { animate, motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

// Bobina di navigazione condivisa: usata sia nella home (dove segue lo scroll tra sezioni) sia nelle
// pagine "figlie" (Galleria, News), dove resta ferma sull'etichetta della sezione di provenienza e,
// al click, riporta alla home nel punto giusto invece di scorrere elementi che lì non esistono.

// "top" = la primissima schermata (hero, senza scroll): prima non aveva un suo posto nel menu/rotazione,
// ora è la sezione 01 a tutti gli effetti, e "Bio" (la scheda biografica più sotto) diventa la 02.
export const sections = ["Home", "Bio", "Lavori", "Galleria", "Parlano di me", "Contatti"];
export const ids = ["top", "bio", "lavori", "galleria", "press", "contatti"];

// --- Geometria della bobina (disco decorativo in alto a destra) ---
// Tutte le misure sono legate a queste poche costanti: cambiandole, cerchi e testo
// restano sempre coerenti e concentrici tra loro.
const NAV_SIZE = 32;      // rem — lato del <nav> quadrato: il contenitore di riferimento per bobina ed etichetta
const REEL_BOX = 28;      // rem — lato del riquadro che contiene l'intera bobina
const REEL_OFFSET = 3;    // (in unità Tailwind, = 0.75rem) distanza dal bordo alto e dal bordo destro del nav: STESSA su entrambi i lati — più basso = bobina più incastrata nell'angolo
const RING_SIZE = 26;     // rem — diametro dell'anello rosa esterno
const RING_BORDER = 1;    // rem — spessore dell'anello rosa (uguale su tutto il perimetro per costruzione: è un cerchio CSS)
const HUB_SIZE = 14;      // rem — diametro del mozzo centrale chiaro (deve combaciare con h-56/w-56 più sotto:
                           // era rimasto a 12 per un disallineamento vecchio, e con quel valore sbagliato
                           // ARC_RADIUS risultava troppo vicino al mozzo reale — a schermi piccoli le
                           // etichette (soprattutto quelle ruotate, che proiettano radialmente più della
                           // loro sola altezza) arrivavano a toccare/sconfinare nell'anello grigio del mozzo)
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

export function ReelNav({ active }: { active: number }) {
  const navigate = useNavigate();
  // Se l'id esiste nella pagina corrente (siamo in home) scorre fino a lì; altrimenti (siamo su una
  // pagina "figlia" come /galleria o /news) torna alla home e ci arriva già scrollata al punto giusto.
  const go = (id: string) => {
    if (document.getElementById(id)) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate({ to: "/", hash: id });
    }
  };

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

  return <nav aria-label="Navigazione principale" className="fixed -right-21 -top-21 z-150 h-[32rem] w-[32rem] origin-top-right rounded-bl-[80%] scale-[0.5] sm:-right-34 sm:-top-34 sm:scale-[0.8] md:-right-36 md:-top-36 md:scale-[0.85] xl:-right-42 xl:-top-42 xl:scale-100">
    {/* La STESSA identica bobina ad ogni larghezza di schermo (nessuna barra/stile diverso su mobile): cambia
        solo la scala, sempre "incastonata" nell'angolo in alto a destra — sbordando leggermente fuori dal
        bordo dello schermo esattamente come su desktop (non un cerchio pieno e fluttuante su telefono).
        Scala telefono: 0.4 era illeggibile ("si vede pochino le frasi"), alzata a 0.5. Offset tornato
        proporzionale alle altre fasce (~10.5× la scala, cioè -21 a scala 0.5) su richiesta esplicita: un
        offset quasi fisso più piccolo (provato con -5/-6) teneva sì tutte le etichette raggiungibili, ma
        faceva sembrare la bobina "scappata" fuori dall'angolo, fluttuante a metà schermo invece che
        incastonata — cambiava troppo l'aspetto rispetto all'originale. Tornando a questo offset proporzionale
        alcune etichette lontane dall'attiva restano fuori schermo in un dato istante (stesso comportamento,
        proporzionalmente, di sm/md/xl): quelle vicine all'attiva restano sempre raggiungibili, le altre
        rientrano ruotando mano a mano che si scorre. NON toccare sm/md/xl: quelle fasce restano invariate.
        Cellulare piccolo → tablet → desktop: 0.5 → 0.8 (da 640px) → 0.85 (da 768px) → 1 (piena, da 1280px). */}
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

// Stesse soglie/valori dello scale-[...] sul <nav> più sopra (base/sm/md/xl): se quelli cambiano, questa
// funzione va aggiornata insieme — usata per "annullare" l'effetto dello scale sull'altezza della pellicola.
function getNavScale(): number {
  if (typeof window === "undefined") return 1;
  const w = window.innerWidth;
  if (w >= 1280) return 1;
  if (w >= 768) return 0.85;
  if (w >= 640) return 0.8;
  return 0.5;
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

function FilmStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  // scrollYProgress (SENZA target) = frazione di TUTTA la pagina scrollata, da 0 (cima) a 1 (fondo
  // assoluto): a differenza del pixel di scroll grezzo, è già indipendente da quanto è lunga la pagina —
  // stesso comportamento identico su telefono (pagina lunghissima) e desktop (pagina più corta).
  const { scrollYProgress } = useScroll();
  // Il <nav> (e quindi questa striscia) è "fixed": qualunque cosa oltre il bordo inferiore dello SCHERMO
  // è semplicemente invisibile — non esiste modo di farla "arrivare" oltre un'altezza-schermo restando
  // agganciata alla bobina fissa. viewportCap = quanto può arrivare in basso al massimo (il bordo dello
  // schermo), misurato una volta (e ad ogni resize) dalla posizione fissa della striscia sullo schermo.
  const geometry = useRef({ viewportCap: 0 });

  useEffect(() => {
    function measure() {
      const stripTop = containerRef.current?.getBoundingClientRect().top ?? 0;
      geometry.current = { viewportCap: Math.max(0, window.innerHeight - stripTop) };
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // PROGRESS_TARGET = la frazione di pagina a cui inizia l'ULTIMA sezione (Contatti, sempre l'ultima
  // dell'elenco "sections"): la striscia cresce in modo lineare da 0 a quel punto, quindi "finisce di
  // srotolarsi" (raggiunge la sua altezza massima) proprio quando si arriva in fondo alla pagina — non
  // prima, perché è una FRAZIONE della pagina intera, non un numero di pixel fisso. Dopo quel punto resta
  // ferma lì (nessun rimbalzo, nessun ricalcolo "live" che prima causava gli scatti imprevedibili
  // confrontando due limiti diversi ad ogni frame).
  // Su telefono le sezioni sono impilate a piena altezza una sotto l'altra (niente colonne affiancate come
  // da md in su), quindi la pagina totale è proporzionalmente molto più lunga rispetto a quanto la striscia
  // possa comunque "mostrare" (il suo massimo resta sempre un solo schermo, vedi viewportCap sopra): usando
  // la STESSA frazione lenta di desktop, a metà pagina la striscia aveva srotolato solo una piccola parte
  // del suo massimo — sembrava essersi fermata a mezza altezza invece di continuare a scendere. Frazione
  // dimezzata solo su telefono: la striscia raggiunge il suo massimo (comunque invariato, un solo schermo)
  // già a metà dello scroll totale invece che quasi alla fine, quindi per la stessa quantità scrollata
  // scende visibilmente di più. Da sm in su invariato (desktop/tablet già confermati corretti).
  const PROGRESS_TARGET = (sections.length - 1) / sections.length;
  const MOBILE_PROGRESS_TARGET = PROGRESS_TARGET / 2;
  const rawHeight = useTransform(scrollYProgress, (p) => {
    // typeof window: in SSR (TanStack Start) questa funzione viene comunque valutata una volta lato
    // server, dove "window" non esiste — senza guardia l'intera pagina cadeva in client-side rendering.
    if (typeof window === "undefined") return 0;
    const target = window.innerWidth < 640 ? MOBILE_PROGRESS_TARGET : PROGRESS_TARGET;
    const eased = Math.min(p / target, 1);
    // viewportCap è misurato in pixel REALI sullo schermo (getBoundingClientRect, dopo lo scale-[...] del
    // <nav> genitore) — ma l'altezza CSS impostata qui sotto ("height") viene letta PRIMA che quello
    // scale si applichi, quindi viene rimpicciolita della stessa proporzione quando va a schermo. Senza
    // dividere per la scala corrente, su ogni fascia sotto xl (telefono 0.5, sm 0.8, md 0.85) la striscia
    // si fermava a metà (o poco più) della sua lunghezza massima invece di arrivare davvero in fondo allo
    // schermo: dividendo per la scala, l'altezza richiesta è più "gonfia" della misura giusta in modo che,
    // una volta rimpicciolita dallo stesso scale, il risultato visivo torni a combaciare con viewportCap.
    const scale = getNavScale();
    return (eased * geometry.current.viewportCap) / scale;
  });
  // useSpring aggiunge inerzia nel TEMPO sopra al valore già lineare/lento: qualunque micro-salto dello
  // scroll (rotella del mouse a scatti, non continua come un dito sul touch) arriva smussato, mai un
  // balzo istantaneo — più lenta e pesante della prima versione, per un moto davvero fluido.
  const smoothHeight = useSpring(rawHeight, { stiffness: 35, damping: 20, mass: 1 });
  const heightPx = useTransform(smoothHeight, (h) => `${h}px`);
  // Una SOLA curva morbida (non due sovrapposte a frequenze diverse, che la faceva sembrare un serpente
  // impazzito): x e rotazione condividono lo stesso periodo lento, quindi si muovono insieme in modo
  // coerente — l'effetto è un filo che pende con una curva sola, non che si agita a scatti.
  const swayX = useTransform(smoothHeight, (h) => 9 * Math.sin(h / 260));
  const swayRotate = useTransform(smoothHeight, (h) => 2 * Math.sin(h / 260 + 0.5));

  return (
    <motion.div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute overflow-hidden"
      style={{ right: "10.5rem", top: "22.25rem", width: `${FILM_WIDTH}rem`, height: heightPx, x: swayX, rotate: swayRotate, transformOrigin: "top center" }}
    >
      {/* Dentro al <nav>, POSIZIONATA nelle sue stesse coordinate (non "fixed" indipendente): eredita
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
        className={`h-auto w-[4.5rem] whitespace-normal break-words px-0 text-center font-display text-base font-semibold uppercase leading-none hover:bg-transparent ${active === index ? "text-signal" : "text-paper hover:text-signal"}`}
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
