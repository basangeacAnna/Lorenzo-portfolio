# Lorenzo Blaconà — Portfolio

Sito portfolio di Lorenzo Blaconà: attore, cantante, scrittore e grafico.

## Stack tecnico

- [TanStack Start](https://tanstack.com/start) (React 19, SSR)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Deploy su Cloudflare Workers

## Sviluppo locale

Richiede Node.js e npm.

```sh
git clone <url-di-questo-repository>
cd Lorenzo-portfolio
npm install
npm run dev
```

Il sito è servito su `http://localhost:8080`.

## Build di produzione

```sh
npm run build
```

Genera l'output in `.output/`, pronto per il deploy su Cloudflare (`wrangler.json` incluso).

## Rassegna stampa

Gli articoli nella sezione "Parlano di me" e nella pagina `/news` sono letti in tempo reale da un
Google Sheet pubblico (vedi `src/lib/news-sheet.ts`), così possono essere aggiornati senza toccare il
codice — basta compilare una nuova riga nella scheda "News" del foglio.
