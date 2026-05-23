/**
 * PhonePe payment scaffold.
 *
 * This endpoint creates a PhonePe PG checkout request when secrets are set.
 * Until you add PHONEPE_MERCHANT_ID, PHONEPE_SALT_KEY, PHONEPE_SALT_INDEX
 * (and optionally PHONEPE_BASE_URL for live), it falls back to returning
 * `{ redirect: null }` so the UI shows a "we'll contact you" message.
 *
 * Sandbox base: https://api-preprod.phonepe.com/apis/pg-sandbox
 * Live base:    https://api.phonepe.com/apis/hermes
 */
import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";

export const Route = createFileRoute("/api/payment/phonepe/initiate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { order_id, amount_inr } = (await request.json()) as {
            order_id: string;
            amount_inr: number;
          };

          const MID = process.env.PHONEPE_MERCHANT_ID;
          const SALT = process.env.PHONEPE_SALT_KEY;
          const SALT_INDEX = process.env.PHONEPE_SALT_INDEX ?? "1";
          const BASE = process.env.PHONEPE_BASE_URL ?? "https://api-preprod.phonepe.com/apis/pg-sandbox";

          if (!MID || !SALT) {
            // Secrets not configured yet — return null redirect, UI handles fallback
            return Response.json({ redirect: null, configured: false });
          }

          const origin = new URL(request.url).origin;
          const payload = {
            merchantId: MID,
            merchantTransactionId: order_id,
            amount: amount_inr * 100, // paise
            redirectUrl: `${origin}/api/payment/phonepe/callback?order_id=${order_id}`,
            redirectMode: "REDIRECT",
            callbackUrl: `${origin}/api/payment/phonepe/callback?order_id=${order_id}`,
            paymentInstrument: { type: "PAY_PAGE" },
          };
          const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");
          const stringToSign = base64 + "/pg/v1/pay" + SALT;
          const sha = createHash("sha256").update(stringToSign).digest("hex");
          const xVerify = `${sha}###${SALT_INDEX}`;

          const res = await fetch(`${BASE}/pg/v1/pay`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-VERIFY": xVerify, accept: "application/json" },
            body: JSON.stringify({ request: base64 }),
          });
          const json = (await res.json()) as any;
          const redirect = json?.data?.instrumentResponse?.redirectInfo?.url ?? null;
          return Response.json({ redirect, configured: true });
        } catch (err) {
          console.error("PhonePe initiate error", err);
          return Response.json({ redirect: null, error: "initiate_failed" }, { status: 500 });
        }
      },
    },
  },
});
