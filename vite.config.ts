import { defineConfig, type UserConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

// Configurazione scritta a mano (prima la forniva @lovable.dev/vite-tanstack-config, un pacchetto che
// incapsulava tutto questo — e molto altro specifico dell'editor Lovable, qui non necessario — dietro un
// unico defineConfig). Ogni pezzo qui sotto replica solo quello che il sito usa davvero: plugin Tailwind,
// risoluzione dei path da tsconfig, TanStack Start, build Nitro verso Cloudflare, plugin React, più le
// impostazioni di resolve/optimizeDeps che evitano doppie copie di React in dev (la causa di un bug reale
// visto in questa sessione: "Invalid hook call" dopo un re-ottimizzazione delle dipendenze di Vite).
export default defineConfig(async ({ command }): Promise<UserConfig> => {
  const plugins = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
      // Redirige l'entry server di TanStack Start verso src/server.ts (il nostro wrapper SSR per gli errori).
      server: { entry: "server" },
    }),
    viteReact(),
  ];

  if (command === "build") {
    const { nitro } = await import("nitro/vite");
    // Nome del Worker fissato esplicitamente: senza questo, Nitro ne genera uno automaticamente
    // (es. "basangeacanna-lorenzo-portfolio", dal nome utente del computer) diverso dal Worker
    // "lorenzo-portfolio" già creato su Cloudflare — un deploy col nome sbagliato avrebbe creato un
    // Worker NUOVO invece di aggiornare quello a cui è collegato il dominio.
    plugins.push(nitro({ defaultPreset: "cloudflare-module", cloudflare: { wrangler: { name: "lorenzo-portfolio" } } }));
  }

  return {
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"],
      ignoreOutdatedRequests: true,
    },
    server: {
      host: "::",
      port: 8080,
      // Permette richieste dal tunnel pubblico temporaneo (localtunnel, dominio *.loca.lt) usato per
      // condividere il sito in anteprima — da togliere quando non serve più condividerlo così.
      allowedHosts: [".loca.lt"],
      watch: { awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 100 } },
    },
    plugins,
  };
});
