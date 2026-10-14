import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

// Invio reale (lato server) dell'email del form "Scrivimi", via Resend — sostituisce il vecchio
// mailto: (che apriva solo il client di posta del visitatore, lasciandogli l'ultimo passo manuale).
// RESEND_API_KEY è un secret di Cloudflare Workers: non è mai nel codice né nel repository. Tre modi di
// leggerlo, dal più affidabile al meno: (1) Nitro attacca il binding "env" di Cloudflare direttamente
// sulla Request (request.runtime.cloudflare.env, vedi augmentReq in
// nitro/presets/cloudflare/runtime/_module-handler.mjs) — getRequest() di TanStack Start restituisce
// quella stessa Request; (2) globalThis.__env__, che Nitro imposta ad ogni richiesta ma che un primo
// tentativo ha mostrato non arrivare fino al corpo della server function (probabilmente per via di come
// TanStack Start isola l'esecuzione); (3) process.env, utile solo per un'eventuale esecuzione Node pura.
declare global {
  var __env__: Record<string, string | undefined> | undefined;
}

// Diagnostica temporanea: nessun valore di secret esposto, solo "struttura" (esiste l'oggetto? quali
// nomi di chiave sono presenti?) — da togliere una volta trovata la causa del secret introvabile.
function getResendApiKey(): { key: string | undefined; diag: string } {
  const diag: string[] = [];
  try {
    const request = getRequest() as Request & {
      runtime?: { cloudflare?: { env?: Record<string, string | undefined> } };
    };
    const env = request.runtime?.cloudflare?.env;
    diag.push(`getRequest:ok runtime=${!!request.runtime} cloudflare=${!!request.runtime?.cloudflare} env=${!!env} envKeys=[${env ? Object.keys(env).join(",") : ""}]`);
    const fromRequest = env?.["RESEND_API_KEY"];
    if (fromRequest) return { key: fromRequest, diag: diag.join(" | ") };
  } catch (err) {
    diag.push(`getRequest:threw ${err instanceof Error ? err.message : String(err)}`);
  }
  const globalEnv = globalThis.__env__;
  diag.push(`globalThis.__env__=${!!globalEnv} keys=[${globalEnv ? Object.keys(globalEnv).join(",") : ""}]`);
  const fromGlobal = globalEnv?.["RESEND_API_KEY"];
  if (fromGlobal) return { key: fromGlobal, diag: diag.join(" | ") };
  const fromProcess = process.env["RESEND_API_KEY"];
  diag.push(`process.env has key=${!!fromProcess}`);
  if (fromProcess) return { key: fromProcess, diag: diag.join(" | ") };
  return { key: undefined, diag: diag.join(" | ") };
}

export type ContactFormData = {
  nome: string;
  email: string;
  tipo: string;
  produzione: string;
  messaggio: string;
};

export const sendContactEmail = createServerFn({ method: "POST" })
  .validator((data: ContactFormData) => data)
  .handler(async ({ data }) => {
    const { key: apiKey, diag } = getResendApiKey();
    if (!apiKey) {
      throw new Error(`Invio non configurato: manca RESEND_API_KEY. [${diag}]`);
    }

    const subject = `[${data.tipo}] da ${data.nome || "sito web"}`;
    const bodyLines = [
      `Nome: ${data.nome}`,
      `Email: ${data.email}`,
      data.produzione ? `Produzione / Agenzia: ${data.produzione}` : null,
      "",
      data.messaggio,
    ].filter((line): line is string => line !== null);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      // reply_to = email del visitatore: Lorenzo può rispondere direttamente da Gmail senza copiare nulla.
      body: JSON.stringify({
        from: "Portfolio Lorenzo Blaconà <no-reply@lorenzoblacona.com>",
        to: ["loryblacona@gmail.com"],
        reply_to: data.email,
        subject,
        text: bodyLines.join("\n"),
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      throw new Error(`Resend ha risposto ${res.status}: ${errorBody}`);
    }

    return { ok: true as const };
  });
