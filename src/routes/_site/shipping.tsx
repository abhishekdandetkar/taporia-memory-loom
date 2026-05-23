import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/_site/shipping")({
  head: () => ({ meta: [{ title: "Shipping Policy — TAPORIA" }, { name: "description", content: "How TAPORIA ships handcrafted memory pendants." }] }),
  component: () => (
    <LegalLayout eyebrow="Legal" title="Shipping Policy">
      <h2>Timelines</h2>
      <p>Founders Edition pieces are dispatched within 3–4 weeks of order, each one hand-finished and numbered.</p>
      <h2>Where we ship</h2>
      <p>We currently ship across India. International shipping is available on request via Corporate.</p>
      <h2>Tracking</h2>
      <p>Once dispatched, you will receive a tracking link by email and SMS.</p>
    </LegalLayout>
  ),
});
