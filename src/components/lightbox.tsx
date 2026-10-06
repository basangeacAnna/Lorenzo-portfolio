import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";

// Lightbox condiviso: si apre cliccando ovunque sulla foto (non solo un bottoncino) e permette di
// scorrere avanti/indietro tra le foto correlate SENZA uscire — frecce a schermo + tasti ← → + swipe
// non serve: object-contain e basta. Esc o click sullo sfondo per chiudere.
export function Lightbox({ photos, index, onClose, onNavigate }: {
  photos: string[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const hasMultiple = photos.length > 1;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (hasMultiple && e.key === "ArrowRight") onNavigate((index + 1) % photos.length);
      if (hasMultiple && e.key === "ArrowLeft") onNavigate((index - 1 + photos.length) % photos.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, hasMultiple, photos.length, onClose, onNavigate]);

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-ink/95 p-6" onClick={onClose}>
      <button type="button" onClick={onClose} aria-label="Chiudi" className="absolute right-4 top-4 p-2 text-paper hover:text-hot">
        <X className="h-8 w-8" />
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onNavigate((index - 1 + photos.length) % photos.length); }}
            aria-label="Foto precedente"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-paper hover:text-hot md:left-8"
          >
            <ChevronLeft className="h-9 w-9" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onNavigate((index + 1) % photos.length); }}
            aria-label="Foto successiva"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-paper hover:text-hot md:right-8"
          >
            <ChevronRight className="h-9 w-9" />
          </button>
        </>
      )}

      <img src={photos[index]} alt="" onClick={(e) => e.stopPropagation()} className="max-h-[85vh] max-w-full object-contain" />

      {hasMultiple && (
        <p className="absolute bottom-6 font-display text-xs uppercase tracking-wide text-paper/60">{index + 1} / {photos.length}</p>
      )}
    </div>
  );
}
