import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Send } from "lucide-react";
import { useState } from "react";
import { ReelNav, ids } from "@/components/reel-nav";
import { SiteFooter } from "@/components/site-footer";
import { sendContactEmail } from "@/lib/send-contact-email";

export const Route = createFileRoute("/scrivimi")({
  head: () => ({ meta: [
    { title: "Scrivimi — Lorenzo Blaconà" },
    { name: "description", content: "Proposte di lavoro, collaborazioni artistiche o richieste stampa: scrivi a Lorenzo Blaconà." },
  ]}),
  component: ScrivimiPage,
});

const tipi = ["Proposta di lavoro", "Collaborazione artistica", "Richiesta stampa", "Altro"];

function ScrivimiPage() {
  const [form, setForm] = useState({ nome: "", email: "", tipo: tipi[0] as string, tipoAltro: "", produzione: "", messaggio: "" });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  return (
    <main className="relative min-h-screen bg-ink px-5 pb-20 pt-28 text-paper sm:pt-16 md:px-12 lg:px-20">
      <ReelNav active={ids.indexOf("contatti")} />
      {/* "Torna al portfolio" per esteso da sm in su; solo "Portfolio" su telefono (schermi molto stretti,
          <360px, altrimenti finiva dietro alla bobina anche a font ridotto) — stesso link, stessa meta. */}
      <Link to="/" hash="contatti" className="inline-flex items-center gap-2 font-display text-xs uppercase text-hot sm:text-sm">
        <ArrowLeft className="h-4 w-4" /> <span className="sm:hidden">Portfolio</span><span className="hidden sm:inline">Torna al portfolio</span>
      </Link>
      {/* Prima andava a capo su telefono ("Scrivi-mi.") per non finire sotto la bobina: visivamente brutto.
          Ora resta su una riga anche su telefono, con una dimensione legata alla larghezza schermo (7vw)
          invece che fissa — si rimpicciolisce da sola sugli schermi più stretti restando sempre a sinistra
          della bobina, senza bisogno di indovinare un valore fisso per ogni larghezza possibile. */}
      <h1 className="mt-8 whitespace-nowrap font-display text-[7vw] font-bold uppercase leading-none sm:whitespace-normal sm:text-6xl md:text-8xl">
        Scrivimi.
      </h1>
      <p className="mt-5 max-w-xl text-lg text-paper/80">
        Compila il form: parte in automatico, un click e basta.
      </p>

      {status === "sent" ? (
        <div className="mt-12 max-w-2xl border border-hot bg-hot/10 p-7">
          <p className="font-display text-2xl uppercase text-hot">Messaggio inviato!</p>
          <p className="mt-3 text-paper/80">Grazie, Lorenzo ti risponderà il prima possibile.</p>
        </div>
      ) : (
      <form
        className="mt-12 grid max-w-2xl gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          setStatus("sending");
          sendContactEmail({
            data: {
              nome: form.nome,
              email: form.email,
              tipo: form.tipo === "Altro" && form.tipoAltro.trim() ? form.tipoAltro.trim() : form.tipo,
              produzione: form.produzione,
              messaggio: form.messaggio,
            },
          })
            .then(() => setStatus("sent"))
            .catch((err) => {
              console.error(err);
              setStatus("error");
            });
        }}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs uppercase text-paper/50">Nome</span>
            <input
              required
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              className="mt-2 w-full border border-paper/30 bg-transparent px-4 py-3 text-paper outline-none focus:border-hot"
              placeholder="Il tuo nome"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase text-paper/50">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-2 w-full border border-paper/30 bg-transparent px-4 py-3 text-paper outline-none focus:border-hot"
              placeholder="nome@esempio.it"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-xs uppercase text-paper/50">Tipo di richiesta</span>
          <select
            value={form.tipo}
            onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))}
            className="mt-2 w-full border border-paper/30 bg-ink px-4 py-3 text-paper outline-none focus:border-hot"
          >
            {tipi.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>

        {/* Compare solo scegliendo "Altro": chiede di specificare a mano di che richiesta si tratta,
            invece di lasciare "Altro" generico nell'oggetto/corpo dell'email. */}
        {form.tipo === "Altro" && (
          <label className="block">
            <span className="text-xs uppercase text-paper/50">Specifica il tipo di richiesta</span>
            <input
              required
              value={form.tipoAltro}
              onChange={(e) => setForm((f) => ({ ...f, tipoAltro: e.target.value }))}
              className="mt-2 w-full border border-paper/30 bg-transparent px-4 py-3 text-paper outline-none focus:border-hot"
              placeholder="Di che tipo di richiesta si tratta?"
            />
          </label>
        )}

        <label className="block">
          <span className="text-xs uppercase text-paper/50">Produzione / Agenzia (opzionale)</span>
          <input
            value={form.produzione}
            onChange={(e) => setForm((f) => ({ ...f, produzione: e.target.value }))}
            className="mt-2 w-full border border-paper/30 bg-transparent px-4 py-3 text-paper outline-none focus:border-hot"
            placeholder="Nome della produzione, agenzia o testata"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase text-paper/50">Messaggio</span>
          <textarea
            required
            rows={6}
            value={form.messaggio}
            onChange={(e) => setForm((f) => ({ ...f, messaggio: e.target.value }))}
            className="mt-2 w-full resize-none border border-paper/30 bg-transparent px-4 py-3 text-paper outline-none focus:border-hot"
            placeholder="Racconta brevemente la proposta..."
          />
        </label>

        {/* Checkbox di consenso GDPR: niente preselezione (deve essere un'azione attiva di chi compila),
            collegata alla pagina /privacy. Il form non parte finché non è spuntata (required nativo del
            browser, stessa validazione già usata su nome/email/messaggio). */}
        <label className="flex items-start gap-3 text-sm text-paper/80">
          <input
            type="checkbox"
            required
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-hot"
          />
          <span>
            Ho letto e accetto la{" "}
            <Link to="/privacy" target="_blank" className="text-hot underline underline-offset-2 hover:opacity-80">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {status === "error" && (
          <p className="text-sm text-hot">
            Qualcosa è andato storto nell'invio. Riprova, oppure scrivi direttamente a{" "}
            <a href="mailto:loryblacona@gmail.com" className="underline underline-offset-2">loryblacona@gmail.com</a>.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-none bg-hot px-7 py-4 font-display uppercase text-ink transition-colors hover:bg-paper disabled:opacity-50"
        >
          {status === "sending" ? "Invio in corso..." : "Invia"} <Send className="h-4 w-4" />
        </button>
      </form>
      )}

      <a href="mailto:loryblacona@gmail.com" className="mt-10 inline-flex items-center gap-2 font-display text-sm uppercase text-paper/60 hover:text-hot">
        oppure scrivi direttamente a loryblacona@gmail.com <ArrowUpRight className="h-4 w-4" />
      </a>

      <SiteFooter theme="dark" />
    </main>
  );
}
