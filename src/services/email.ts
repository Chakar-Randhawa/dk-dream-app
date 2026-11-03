import { Linking } from "react-native";
import { BRAND } from "../data/brand";

/**
 * Free email delivery through FormSubmit (https://formsubmit.co).
 * No account, no API key, no backend. Every submission is forwarded to
 * BRAND.email (dkdreamk@gmail.com).
 *
 * ONE-TIME SETUP: the very first submission makes FormSubmit send an
 * "Activate form" email to dkdreamk@gmail.com. Open it and click the
 * activation link once; after that every booking, order and message is
 * delivered to that inbox.
 */
const ENDPOINT = `https://formsubmit.co/ajax/${BRAND.email}`;

export type EmailResult = { ok: true } | { ok: false; error: string };

export async function sendEmail(
  subject: string,
  fields: Record<string, string>,
  replyTo?: string
): Promise<EmailResult> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: subject,
        _template: "table",
        _captcha: "false",
        ...(replyTo ? { _replyto: replyTo, email: replyTo } : {}),
        ...fields,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    const data: { success?: string | boolean; message?: string } = await res
      .json()
      .catch(() => ({}));

    const success = data.success === true || data.success === "true";
    if (res.ok && success) return { ok: true };
    return {
      ok: false,
      error: data.message ?? "The email service did not accept the request.",
    };
  } catch {
    return {
      ok: false,
      error: "No internet connection or the email service is unreachable.",
    };
  }
}

/** Reference numbers like DK-RSV-281026-4F7K */
export function makeReference(kind: "ORD" | "RSV" | "MSG"): string {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `DK-${kind}-${yy}${mm}${dd}-${code}`;
}

/**
 * Backup route if the email service is unreachable: opens the customer's own email app
 * with the same details pre-filled, addressed to the restaurant.
 */
export function openMailFallback(subject: string, fields: Record<string, string>): void {
  const body = Object.entries(fields)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  Linking.openURL(
    `mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  ).catch(() => {});
}
