import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { useState } from "react";

const FAQ: [string, string][] = [
  ["What is TAPORIA?", "A handcrafted memory pendant with a hidden NFC core. Tap it on any smartphone and a personalised page of your photographs, voice notes, music, and messages opens."],
  ["Do I need an app?", "No. The pendant works with the native NFC reader built into every modern smartphone. Tap and the page opens in your browser."],
  ["Is it waterproof?", "Yes. The 316L stainless steel body and sealed NFC core are designed for everyday wear, including showering."],
  ["How long does it take?", "Founders Edition pieces ship 3–4 weeks after order. Each one is hand-finished and individually numbered."],
  ["Is the memory page private?", "Yes. Each pendant opens a unique URL only the holder of the pendant can reach. You control what lives on it."],
  ["What's included?", "The pendant on a stainless steel chain, premium boxed packaging, an authenticity card, and lifetime access to update your memory page."],
  ["Can I gift it?", "Yes — corporate or personal. Use our Corporate page for bulk inquiries."],
  ["What if my pendant is damaged?", "Reach out to support. We repair or replace as appropriate within the warranty terms."],
];

export const Route = createFileRoute("/_site/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — TAPORIA Memory Pendants" },
      { name: "description", content: "Answers about TAPORIA pendants, the hidden NFC technology, shipping timelines, and the limited Founders Edition." },
      { property: "og:title", content: "TAPORIA — Frequently Asked Questions" },
      { property: "og:description", content: "Everything about the pendant, NFC, and your memory page." },
      { property: "og:url", content: "https://taporia-memory-loom.lovable.app/faqs" },
    ],
    links: [{ rel: "canonical", href: "https://taporia-memory-loom.lovable.app/faqs" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }),
      },
    ],
  }),
  component: FAQs,
});


function FAQs() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      <section className="bg-white py-32 md:py-44 border-b border-black">
        <div className="container-edge">
          <Reveal><p className="text-eyebrow">FAQs</p></Reveal>
          <Reveal delay={1}>
            <h1 className="text-display mt-8 text-[12vw] lg:text-[8vw] leading-[0.85]">Answers.</h1>
          </Reveal>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="container-edge max-w-3xl">
          {FAQ.map(([q, a], i) => (
            <div key={i} className="border-b border-black">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left py-8 flex items-center justify-between gap-8"
              >
                <span className="text-lg md:text-2xl font-light">{q}</span>
                <span className="text-display text-3xl">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="pb-10 text-base font-light opacity-80 max-w-2xl leading-relaxed">{a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
