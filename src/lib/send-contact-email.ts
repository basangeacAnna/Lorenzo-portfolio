import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

// Invio reale (lato server) dell'email del form "Scrivimi", via Resend — sostituisce il vecchio mailto:
// (che apriva solo il client di posta del visitatore, lasciandogli l'ultimo passo manuale).
// RESEND_API_KEY è un secret di Cloudflare Workers, mai nel codice né nel repository: il deploy
// (vedi "deploy" in package.json) lo imposta esplicitamente via "wrangler secret put" ad ogni build,
// perché il secret impostato solo da pannello non si legava in modo affidabile alle versioni create dal
// deploy automatico via CI. Nitro attacca comunque il binding "env" di Cloudflare direttamente sulla
// Request (request.runtime.cloudflare.env — vedi augmentReq in
// nitro/presets/cloudflare/runtime/_module-handler.mjs): è il modo più diretto per leggerlo, con
// globalThis.__env__ e process.env come ripiego.
declare global {
  var __env__: Record<string, string | undefined> | undefined;
}

function getResendApiKey(): string | undefined {
  try {
    const request = getRequest() as Request & {
      runtime?: { cloudflare?: { env?: Record<string, string | undefined> } };
    };
    const fromRequest = request.runtime?.cloudflare?.env?.["RESEND_API_KEY"];
    if (fromRequest) return fromRequest;
  } catch {
    // getRequest() può lanciare fuori da un vero contesto di richiesta (es. in build) — ignorato apposta.
  }
  return globalThis.__env__?.["RESEND_API_KEY"] ?? process.env["RESEND_API_KEY"];
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
