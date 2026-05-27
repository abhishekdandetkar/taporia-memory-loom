import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/_site/returns")({
  head: () => ({
    meta: [
      { title: "Returns & Refunds — TAPORIA" },
      { name: "description", content: "Returns and refunds for TAPORIA pendants. Free repair or replacement for manufacturing defects reported within 7 days of delivery." },
      { property: "og:title", content: "TAPORIA — Returns & Refunds" },
      { property: "og:url", content: "https://taporia-memory-loom.lovable.app/returns" },
    ],
    links: [{ rel: "canonical", href: "https://taporia-memory-loom.lovable.app/returns" }],
  }),

  component: () => (
    <LegalLayout eyebrow="Legal" title="Returns & Refund Policy">
      <h2>Manufacturing defects</h2>
      <p>If your pendant arrives with a manufacturing defect, contact us within 7 days of delivery for a free repair or replacement.</p>
      <h2>Personalised pieces</h2>
      <p>Because TAPORIA pendants are personalised and handcrafted, we cannot accept returns for change of mind.</p>
      <h2>Refunds</h2>
      <p>Approved refunds are processed to the original payment method within 7–10 working days.</p>
    </LegalLayout>
  ),
});
