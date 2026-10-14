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

function getResendApiKey(): string | undefined {
  try {
    const request = getRequest() as Request & {
      runtime?: { cloudflare?: { env?: Record<string, string | undefined> } };
    };
    const fromRequest = request.runtime?.cloudflare?.env?.["RESEND_API_KEY"];
    if (fromRequest) {
      console.log("[send-contact-email] chiave trovata via request.runtime.cloudflare.env");
      return fromRequest;
    }
  } catch (err) {
    console.log("[send-contact-email] getRequest() ha lanciato:", err instanceof Error ? err.message : String(err));
  }
  const fromGlobal = globalThis.__env__?.["RESEND_API_KEY"];
  if (fromGlobal) {
    console.log("[send-contact-email] chiave trovata via globalThis.__env__");
    return fromGlobal;
  }
  const fromProcess = process.env["RESEND_API_KEY"];
  if (fromProcess) {
    console.log("[send-contact-email] chiave trovata via process.env");
    return fromProcess;
  }
  console.log("[send-contact-email] chiave non trovata in nessuna delle 3 fonti");
  return undefined;
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
    const apiKey = getResendApiKey();
    if (!apiKey) {
      throw new Error("Invio non configurato: manca RESEND_API_KEY.");
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
