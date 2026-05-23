import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/_site/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — TAPORIA" }, { name: "description", content: "Terms governing the use of TAPORIA products and services." }] }),
  component: () => (
    <LegalLayout eyebrow="Legal" title="Terms & Conditions">
      <p>By placing an order, you agree to these terms.</p>
      <h2>Products</h2>
      <p>TAPORIA pendants are handcrafted. Minor variations in finish are part of the craft.</p>
      <h2>Use of the memory page</h2>
      <p>You are responsible for the content you upload. You retain ownership; you grant us a limited licence to host and serve it on your behalf.</p>
      <h2>Liability</h2>
      <p>TAPORIA is not liable for indirect or consequential damages arising from the use of the product.</p>
      <h2>Jurisdiction</h2>
      <p>These terms are governed by the laws of India.</p>
    </LegalLayout>
  ),
});
