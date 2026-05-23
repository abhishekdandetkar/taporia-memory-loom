import { Reveal } from "@/components/site/Reveal";

export function LegalLayout({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <div>
      <section className="bg-white py-32 md:py-44 border-b border-black">
        <div className="container-edge">
          <Reveal><p className="text-eyebrow">{eyebrow}</p></Reveal>
          <Reveal delay={1}>
            <h1 className="text-display mt-8 text-[10vw] lg:text-[6vw] leading-[0.9]">{title}</h1>
          </Reveal>
        </div>
      </section>
      <section className="bg-white py-24">
        <div className="container-edge max-w-3xl prose-legal">
          {children}
        </div>
      </section>
      <style>{`
        .prose-legal h2 { font-family: var(--font-display); font-weight: 600; font-size: 1.5rem; margin: 3rem 0 1rem; letter-spacing: -0.01em; }
        .prose-legal p, .prose-legal li { font-weight: 300; font-size: 0.95rem; line-height: 1.7; opacity: 0.85; margin-bottom: 1rem; }
        .prose-legal ul { list-style: none; padding: 0; }
        .prose-legal li { padding-left: 1.5rem; position: relative; }
        .prose-legal li::before { content: "—"; position: absolute; left: 0; }
      `}</style>
    </div>
  );
}
