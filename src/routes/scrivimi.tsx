import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Send } from "lucide-react";
import { useState } from "react";
import { ReelNav, ids } from "@/components/reel-nav";

export const Route = createFileRoute("/scrivimi")({
  head: () => ({ meta: [
    { title: "Scrivimi — Lorenzo Blaconà" },
    { name: "description", content: "Proposte di lavoro, collaborazioni artistiche o richieste stampa: scrivi a Lorenzo Blaconà." },
  ]}),
  component: ScrivimiPage,
});

const tipi = ["Proposta di lavoro", "Collaborazione artistica", "Richiesta stampa", "Altro"];

// Niente backend/API key configurata: il form prepara oggetto e corpo del messaggio e apre il client di
// posta dell'utente già compilato su loryblacona@gmail.com — "parte in automatico" nel senso che non deve
// scrivere nulla a mano, l'unico passaggio che resta è il click su "invia" nella propria app di posta.
function buildMailto(data: { nome: string; email: string; tipo: string; produzione: string; messaggio: string }) {
  const subject = `[${data.tipo}] da ${data.nome || "sito web"}`;
  const bodyLines = [
    `Nome: ${data.nome}`,
    `Email: ${data.email}`,
    data.produzione ? `Produzione / Agenzia: ${data.produzione}` : null,
    "",
    data.messaggio,
  ].filter((l) => l !== null);
  return `mailto:loryblacona@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
}

function ScrivimiPage() {
  const [form, setForm] = useState({ nome: "", email: "", tipo: tipi[0] as string, produzione: "", messaggio: "" });

  return (
    <main className="relative min-h-screen bg-ink px-5 pb-20 pt-28 text-paper sm:pt-16 md:px-12 lg:px-20">
      <ReelNav active={ids.indexOf("contatti")} />
      {/* "Torna al portfolio" per esteso da sm in su; solo "Portfolio" su telefono (schermi molto stretti,
          <360px, altrimenti finiva dietro alla bobina anche a font ridotto) — stesso link, stessa meta. */}
      <Link to="/" hash="contatti" className="inline-flex items-center gap-2 font-display text-xs uppercase text-hot sm:text-sm">
        <ArrowLeft className="h-4 w-4" /> <span className="sm:hidden">Portfolio</span><span className="hidden sm:inline">Torna al portfolio</span>
      </Link>
      {/* Stesso trattamento di "Fotogrammi." in home: parola unica spezzata solo su telefono (dove
          altrimenti finirebbe dietro la bobina in alto a destra), ricomposta su una riga da sm in su. */}
      <h1 className="mt-8 font-display text-4xl font-bold uppercase leading-none sm:text-6xl md:text-8xl">
        <span className="block sm:inline">Scrivi</span><span className="block sm:inline">mi.</span>
      </h1>
      <p className="mt-5 max-w-xl text-lg text-paper/80">
        Compila il form: si apre già tutto pronto nella tua email, un click e parte.
      </p>

      <form
        className="mt-12 grid max-w-2xl gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          window.location.href = buildMailto(form);
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

        <button
          type="submit"
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-none bg-hot px-7 py-4 font-display uppercase text-ink transition-colors hover:bg-paper"
        >
          Invia <Send className="h-4 w-4" />
        </button>
      </form>

      <a href="mailto:loryblacona@gmail.com" className="mt-10 inline-flex items-center gap-2 font-display text-sm uppercase text-paper/60 hover:text-hot">
        oppure scrivi direttamente a loryblacona@gmail.com <ArrowUpRight className="h-4 w-4" />
      </a>
    </main>
  );
}
