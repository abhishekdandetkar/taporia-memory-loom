import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/_site/cancellation")({
  head: () => ({ meta: [{ title: "Cancellation Policy — TAPORIA" }, { name: "description", content: "How to cancel a TAPORIA order." }] }),
  component: () => (
    <LegalLayout eyebrow="Legal" title="Cancellation Policy">
      <h2>Before crafting begins</h2>
      <p>Orders can be cancelled for a full refund within 24 hours of purchase, before crafting begins.</p>
      <h2>After crafting begins</h2>
      <p>Because each piece is handcrafted and personalised, cancellations after crafting begins are not eligible for a refund.</p>
      <h2>How to cancel</h2>
      <p>Write to support@taporia.com with your order ID.</p>
    </LegalLayout>
  ),
});
