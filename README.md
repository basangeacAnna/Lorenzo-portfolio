# Lorenzo Blaconà — Portfolio

**Sito live: [lorenzoblacona.com](https://lorenzoblacona.com)**

Portfolio artistico di Lorenzo Blaconà — attore, cantante, scrittore e grafico. Il sito racconta il suo
percorso tra teatro, musica, cinema e scrittura, con una galleria fotografica organizzata per spettacolo/
evento, un reel video, il curriculum e una rassegna stampa aggiornata in autonomia dal cliente stesso
(vedi sotto).

Questo repository è il codice sorgente: per vedere il sito **vai direttamente su
[lorenzoblacona.com](https://lorenzoblacona.com)**, non serve scaricare o eseguire nulla in locale a meno
che tu non debba modificarne il codice.

## Pagine

| Percorso | Contenuto |
| --- | --- |
| `/` | Home — bio, lavori in evidenza, anteprima galleria, rassegna stampa, contatti |
| `/cv` | Curriculum (immagine) |
| `/galleria` | Tutte le foto, organizzate per categoria/evento |
| `/news` | Rassegna stampa completa |
| `/scrivimi` | Form di contatto |
| `/privacy` | Informativa sul trattamento dei dati |

## Stack tecnico

- [TanStack Start](https://tanstack.com/start) (React 19, server-side rendering)
- TypeScript
- Tailwind CSS v4
- Framer Motion (animazioni, menu di navigazione a bobina)
- Nitro, build target `cloudflare-module`
- Deploy su Cloudflare Workers (collegato a GitHub: ogni push su `main` pubblica automaticamente)

## Rassegna stampa autogestita

Gli articoli in "Parlano di me" (home) e nella pagina `/news` sono letti in tempo reale da un Google
Sheet pubblico (vedi `src/lib/news-sheet.ts`): Lorenzo può aggiungere, modificare o nascondere un
articolo compilando una riga del foglio, senza bisogno di toccare il codice o richiedere un nuovo
deploy. La scheda del foglio deve chiamarsi esattamente `News` (viene letta per nome, non per
posizione) ed essere condivisa come "Chiunque abbia il link — Visualizzatore".

## Immagini

Tutte le foto in `public/media/` sono in formato `.webp` per un caricamento più veloce. Le due uniche
eccezioni (`.png`) sono le scansioni di rassegna stampa referenziate direttamente dal Google Sheet, per
non rompere link già pubblicati che il codice non controlla.

## Sviluppo locale

Richiede Node.js e npm.

```sh
git clone <url-di-questo-repository>
cd Lorenzo-portfolio
npm install
npm run dev
```

Il sito è servito su `http://localhost:8080`.

## Build e deploy

```sh
npm run build   # genera l'output in .output/, pronto per Cloudflare (wrangler.json incluso)
npm run deploy  # build + pubblicazione su Cloudflare Workers (richiede login wrangler)
```

In produzione il deploy è automatico: Cloudflare Workers Build è collegato a questo repository e
rilancia `npm run build` + `npm run deploy` a ogni push su `main`.

## Privacy

Il sito non usa cookie di profilazione né analytics. Il modulo di contatto non salva dati su nessun
server: apre semplicemente il client di posta di chi scrive. Dettagli completi nella pagina
[/privacy](https://lorenzoblacona.com/privacy).
