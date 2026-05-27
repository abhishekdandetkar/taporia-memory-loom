import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/_site/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — TAPORIA" },
      { name: "description", content: "How TAPORIA handles your data, memories, and privacy. We never sell or share your data, and your memory page is private to your pendant." },
      { property: "og:title", content: "TAPORIA — Privacy Policy" },
      { property: "og:url", content: "https://taporia-memory-loom.lovable.app/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://taporia-memory-loom.lovable.app/privacy" }],
  }),

  component: () => (
    <LegalLayout eyebrow="Legal" title="Privacy Policy">
      <p>Last updated: {new Date().getFullYear()}</p>
      <h2>What we collect</h2>
      <p>We collect the details you provide during reservation and checkout — your name, email, phone, and shipping address — and the memory content you upload for your pendant.</p>
      <h2>How we use it</h2>
      <p>Your data is used solely to fulfil your order, deliver your pendant, host your memory page, and respond to support. We do not sell or share your data.</p>
      <h2>Your memory page</h2>
      <p>The contents of your memory page are private to your pendant. We do not index, advertise against, or republish your media.</p>
      <h2>Contact</h2>
      <p>For any privacy request, write to privacy@taporia.com.</p>
    </LegalLayout>
  ),
});
