"use client";

import { useEffect, useState } from "react";

export type SafepayTransactionRef = { tracker: string; sig: string };

// The Safepay Button widget's onPayment(data) callback runs inside a hosted
// iframe app that isn't open source, so its exact payload shape is
// undocumented. Checking a few plausible paths for tracker/sig is safer than
// assuming one — see the matching comment in the verify route.
function extractTransactionRef(data: unknown): SafepayTransactionRef | null {
  const candidates: unknown[] = [
    data,
    (data as Record<string, unknown> | null)?.payment,
    (data as Record<string, unknown> | null)?.data,
  ];
  for (const candidate of candidates) {
    if (typeof candidate !== "object" || candidate === null) continue;
    const obj = candidate as Record<string, unknown>;
    const tracker = obj.tracker;
    const sig = obj.sig ?? obj.signature;
    if (typeof tracker === "string" && tracker && typeof sig === "string" && sig) {
      return { tracker, sig };
    }
  }
  return null;
}

const CONTAINER_ID = "safepay-button-container";

export default function SafepayButton({
  publicKey,
  amount,
  orderId,
  onVerified,
  onError,
}: {
  publicKey: string;
  amount: number;
  orderId: string;
  onVerified: (ref: SafepayTransactionRef) => void;
  onError: (message: string) => void;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Dynamically imported so this browser-only widget (it touches `window`
    // at load time) never runs during this Client Component's server render.
    import("@sfpy/checkout-components").then((mod) => {
      if (cancelled) return;
      const safepay = (mod as { default?: typeof mod }).default ?? mod;

      (safepay as {
        Button: (config: Record<string, unknown>) => { render: (selector: string) => void };
      })
        .Button({
          env: "sandbox",
          client: { sandbox: publicKey },
          style: { mode: "light", size: "large", variant: "primary" },
          orderId,
          source: "website",
          payment: { currency: "PKR", amount },
          onPayment: (data: unknown) => {
            const ref = extractTransactionRef(data);
            if (!ref) {
              onError("Could not read the payment reference from Safepay. Please try again.");
              return;
            }
            onVerified(ref);
          },
          onCancel: () => {
            onError("Payment was cancelled.");
          },
        })
        .render(`#${CONTAINER_ID}`);

      setReady(true);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {!ready && <p className="text-xs text-gray-400">Loading payment options...</p>}
      <div id={CONTAINER_ID} />
    </div>
  );
}
