import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Instagram } from "lucide-react";

// Footer minimo e condiviso per le pagine "figlie" (Galleria, News, Scrivimi): prima finivano col
// contenuto e basta, senza nessuna chiusura — a differenza della home, che ha l'intera sezione Contatti
// come footer. Qui non la duplichiamo (sarebbe ridondante), solo un fondo di pagina coerente con link
// rapidi. Non usata in /cv: quella pagina è intenzionalmente a tutto schermo, senza scroll.
// theme: "dark" per le pagine a sfondo scuro (News, Scrivimi — testo/bordo chiari), "light" per quelle a
// sfondo chiaro (Galleria — testo/bordo scuri): stesso sfondo della pagina, mai invisibile per contrasto sbagliato.
export function SiteFooter({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const muted = theme === "dark" ? "text-paper/50" : "text-ink/50";
  const border = theme === "dark" ? "border-paper/15" : "border-ink/15";
  const social = theme === "dark" ? "text-paper/70 hover:text-hot" : "text-ink/70 hover:text-hot";

  return (
    <footer className={`relative z-10 mt-16 border-t ${border} px-5 py-8 md:px-12 lg:px-20`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className={`text-xs uppercase ${muted}`}>© 2026 Lorenzo Blaconà — Tutti i diritti riservati</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link to="/scrivimi" className="inline-flex items-center gap-1 font-display text-xs uppercase text-hot hover:opacity-70">
            Scrivimi <ArrowUpRight className="h-3 w-3" />
          </Link>
          <a href="https://instagram.com/dets.lore" target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1 font-display text-xs uppercase ${social}`}>
            <Instagram className="h-3 w-3" /> @dets.lore
          </a>
        </div>
      </div>
    </footer>
  );
}
