import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import wornPortrait from "@/assets/worn-portrait.jpg";
import packaging from "@/assets/packaging.jpg";

export const Route = createFileRoute("/_site/why")({
  head: () => ({
    meta: [
      { title: "Why TAPORIA — A Keepsake For Moments That Matter" },
      { name: "description", content: "Some memories deserve more than a disappearing story. TAPORIA is a timeless handcrafted keepsake made to outlast every gallery, app, and phone." },
      { property: "og:title", content: "Why TAPORIA" },
      { property: "og:description", content: "A timeless keepsake. Made to outlast every gallery." },
      { property: "og:url", content: "https://taporia-memory-loom.lovable.app/why" },
    ],
    links: [{ rel: "canonical", href: "https://taporia-memory-loom.lovable.app/why" }],
  }),
  component: Why,
});


const PILLARS = [
  ["Emotional", "Made for the people, the dates, the words you don't want forgotten."],
  ["Handcrafted", "Polished, engraved, and finished by hand. Slow on purpose."],
  ["Hidden Technology", "An NFC core that disappears into the design. No screens. No app."],
  ["Privacy First", "Your memory page is yours. No accounts. No feed. No advertising."],
  ["Premium Materials", "316L stainless steel. Cabochon-clear acrylic. Waterproof for daily life."],
  ["Timeless Design", "A circle. A chain. Nothing more than it needs to be."],
];

function Why() {
  return (
    <div>
      <section className="bg-white py-32 md:py-44 border-b border-black">
        <div className="container-edge grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <Reveal className="lg:col-span-8">
            <p className="text-eyebrow">Why TAPORIA</p>
            <h1 className="text-display mt-8 text-[12vw] lg:text-[7.5vw] leading-[0.85]">
              Some memories<br />deserve more.
            </h1>
          </Reveal>
          <Reveal className="lg:col-span-4" delay={1}>
            <p className="text-base font-light opacity-80 leading-relaxed">
              Galleries fill up. Stories disappear in twenty-four hours.
              Phones are replaced. TAPORIA is built to outlast them all —
              a keepsake worn close, opened with intention.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-edge grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black">
          {PILLARS.map(([t, d], i) => (
            <Reveal key={t} className="bg-white p-10 md:p-14" delay={i % 3}>
              <div className="text-display text-5xl opacity-30">{String(i + 1).padStart(2, "0")}</div>
              <h2 className="text-display mt-10 text-2xl">{t}</h2>
              <p className="mt-4 text-sm font-light opacity-80 leading-relaxed">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-black text-white py-32">
        <div className="container-edge grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <Reveal className="lg:col-span-6">
            <img src={wornPortrait} alt="Worn TAPORIA pendant lifestyle portrait in black and white" loading="lazy" width={1080} height={1920} className="w-full h-auto" />
          </Reveal>
          <Reveal className="lg:col-span-6" delay={1}>
            <p className="text-eyebrow opacity-60">For The Moments That Matter</p>
            <h2 className="text-display mt-6 text-5xl md:text-6xl">Made to be<br />remembered.</h2>
            <p className="mt-8 max-w-md font-light opacity-80 leading-relaxed">
              For anniversaries. For graduations. For the parent who passed.
              For the friend you can't see often enough. For the version of you
              that wants to be remembered.
            </p>
            <Link to="/buy" className="btn-tap btn-tap-ghost mt-10">Reserve Your Piece</Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-32">
        <div className="container-edge">
          <Reveal>
            <img src={packaging} alt="Handcrafted TAPORIA pendant packaging in monochrome" loading="lazy" width={1600} height={1200} className="w-full h-auto" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}

