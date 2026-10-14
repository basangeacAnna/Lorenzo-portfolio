import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [
    { title: "Privacy Policy — Lorenzo Blaconà" },
    { name: "description", content: "Informativa sul trattamento dei dati personali del sito di Lorenzo Blaconà." },
    { name: "robots", content: "noindex" },
  ]}),
  component: PrivacyPage,
});

// Informativa scritta per riflettere esattamente cosa fa il sito OGGI, non un modello generico copiato:
// niente analytics, niente account, il form Scrivimi non passa da nessun server/database del sito (apre
// solo il client di posta del visitatore — vedi src/routes/scrivimi.tsx), quindi quel modulo specifico non
// "raccoglie" dati lato server. Da aggiornare se si aggiungono in futuro Analytics o un invio automatico
// del form via server (Resend), entrambi già discussi ma non ancora attivi.
function PrivacyPage() {
  return (
    <main className="relative min-h-screen bg-paper px-5 pb-20 pt-16 text-ink md:px-12 lg:px-20">
      <Link to="/" className="inline-flex items-center gap-2 font-display text-xs uppercase text-hot sm:text-sm">
        <ArrowLeft className="h-4 w-4" /> Torna al portfolio
      </Link>
      <h1 className="mt-8 font-display text-4xl font-bold uppercase leading-none sm:text-5xl">Privacy policy.</h1>
      <p className="mt-4 text-sm text-muted-foreground">Ultimo aggiornamento: ottobre 2026</p>

      <div className="mt-10 max-w-2xl space-y-8 text-base leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold uppercase text-hot">Titolare del trattamento</h2>
          <p className="mt-3">
            Lorenzo Blaconà è il titolare del trattamento dei dati raccolti tramite questo sito.
            Per qualsiasi richiesta relativa alla privacy puoi scrivere a{" "}
            <a href="mailto:loryblacona@gmail.com" className="text-hot underline underline-offset-2">loryblacona@gmail.com</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-hot">Dati raccolti tramite il modulo "Scrivimi"</h2>
          <p className="mt-3">
            Il modulo di contatto raccoglie nome, email, tipo di richiesta, produzione/agenzia (opzionale) e
            messaggio. Questi dati <strong>non passano né vengono salvati su nessun server o database del
            sito</strong>: il pulsante "Invia" apre direttamente il tuo programma di posta con il messaggio
            già pronto, e sei tu a inviarlo dalla tua casella. I dati restano quindi solo nella conversazione
            email tra te e Lorenzo, con la stessa gestione di una normale email.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-hot">Google Fonts</h2>
          <p className="mt-3">
            Il sito carica alcuni caratteri tipografici dai server di Google (Google Fonts). Questo comporta
            la trasmissione del tuo indirizzo IP a Google al momento del caricamento della pagina. Per saperne
            di più, consulta la{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-hot underline underline-offset-2">informativa privacy di Google</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-hot">Video YouTube incorporato</h2>
          <p className="mt-3">
            Nella sezione Galleria è incorporato un video ospitato su YouTube, caricato in modalità
            "privacy avanzata" (youtube-nocookie.com): YouTube non imposta cookie di profilazione finché
            non avvii la riproduzione. Avviando il video, si applicano i termini e l'informativa privacy di
            Google/YouTube.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-hot">Rassegna stampa</h2>
          <p className="mt-3">
            Gli articoli della sezione "Parlano di me" sono letti da un foglio Google Sheets gestito da
            Lorenzo: questo processo avviene interamente lato server e non coinvolge alcun dato personale
            dei visitatori del sito.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-hot">Cookie</h2>
          <p className="mt-3">
            Il sito non utilizza cookie di analisi, profilazione o marketing. Potrebbero essere impostati
            unicamente cookie tecnici necessari al funzionamento e alla sicurezza dell'infrastruttura di
            hosting (Cloudflare), esenti da consenso secondo la normativa vigente.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold uppercase text-hot">I tuoi diritti</h2>
          <p className="mt-3">
            In base al Regolamento (UE) 2016/679 (GDPR), hai diritto di accedere ai tuoi dati, chiederne la
            rettifica o la cancellazione, limitarne il trattamento o opporti, e alla portabilità dei dati.
            Puoi esercitare questi diritti scrivendo a{" "}
            <a href="mailto:loryblacona@gmail.com" className="text-hot underline underline-offset-2">loryblacona@gmail.com</a>.
          </p>
        </section>
      </div>

      <SiteFooter theme="light" />
    </main>
  );
}
