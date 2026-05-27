import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import memoryTap from "@/assets/memory-tap.jpg";
import packaging from "@/assets/packaging.jpg";
import wornPortrait from "@/assets/worn-portrait.jpg";
import pendantBack from "@/assets/pendant-back.jpg";

export const Route = createFileRoute("/_site/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — TAPORIA Memory Pendants" },
      { name: "description", content: "Choose your pendant, upload your memories, we craft your experience, and you tap to relive. Four steps from a moment to a lifelong keepsake." },
      { property: "og:title", content: "How TAPORIA Works" },
      { property: "og:description", content: "Four steps from a moment to a keepsake." },
      { property: "og:url", content: "https://taporia-memory-loom.lovable.app/how-it-works" },
    ],
    links: [{ rel: "canonical", href: "https://taporia-memory-loom.lovable.app/how-it-works" }],
  }),
  component: HowItWorks,
});


const STEPS = [
  { n: "01", t: "Choose Your Pendant", d: "Reserve a piece from the Founders Edition. Each one is numbered, engraved, and made to last." , img: pendantBack},
  { n: "02", t: "Upload Your Memories", d: "Photographs, films, voice notes, a song, words you wanted to keep. All private. All yours.", img: packaging },
  { n: "03", t: "We Craft Your Experience", d: "Hand-finished in our studio. NFC core bonded inside. Packaged like the keepsake it is.", img: wornPortrait },
  { n: "04", t: "Tap To Relive", d: "Tap the pendant on any phone. Your memory page opens — without an app, without a wait.", img: memoryTap },
];

function HowItWorks() {
  return (
    <div>
      <section className="bg-white py-32 md:py-44 border-b border-black">
        <div className="container-edge">
          <Reveal><p className="text-eyebrow">How It Works</p></Reveal>
          <Reveal delay={1}>
            <h1 className="text-display mt-8 text-[14vw] lg:text-[9vw] leading-[0.85]">
              Four steps.<br />One keepsake.
            </h1>
          </Reveal>
        </div>
      </section>

      {STEPS.map((s, i) => (
        <section key={s.n} className={`py-24 md:py-32 ${i % 2 ? "bg-black text-white" : "bg-white"}`}>
          <div className="container-edge grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <Reveal className={`lg:col-span-6 ${i % 2 ? "lg:order-2" : ""}`}>
              <img src={s.img} alt={s.t} loading="lazy" width={1600} height={1200} className="w-full h-auto" />
            </Reveal>
            <Reveal className="lg:col-span-6" delay={1}>
              <div className="text-display text-7xl md:text-8xl opacity-30">{s.n}</div>
              <h2 className="text-display mt-8 text-4xl md:text-6xl">{s.t}</h2>
              <p className="mt-8 max-w-md text-base font-light leading-relaxed opacity-80">{s.d}</p>
            </Reveal>
          </div>
        </section>
      ))}
    </div>
  );
}
