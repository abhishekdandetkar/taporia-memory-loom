import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import heroPendant from "@/assets/hero-pendant.jpg";
import memoryTap from "@/assets/memory-tap.jpg";
import packaging from "@/assets/packaging.jpg";
import wornPortrait from "@/assets/worn-portrait.jpg";
import pendantBack from "@/assets/pendant-back.jpg";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "TAPORIA — One Tap To Your Memories" },
      { name: "description", content: "Handcrafted memory pendants with a hidden NFC core. A timeless stainless steel keepsake — only 100 pieces in the Founders Edition." },
      { property: "og:title", content: "TAPORIA — One Tap To Your Memories" },
      { property: "og:description", content: "Handcrafted memory pendants. Only 100 pieces in the Founders Edition." },
      { property: "og:url", content: "https://taporia-memory-loom.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://taporia-memory-loom.lovable.app/" }],
  }),
  component: Home,
});


function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[100vh] bg-white overflow-hidden">
        <div className="container-edge pt-12 md:pt-20 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-eyebrow"
            >
              Founders Edition · Only 100
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-display mt-8 text-[14vw] lg:text-[7.5vw] leading-[0.85]"
            >
              One Tap
              <br />
              To Your
              <br />
              Memories.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-10 max-w-md text-base font-light leading-relaxed opacity-80"
            >
              A handcrafted pendant. A hidden chapter of your story.
              Worn close. Opened with a tap. Kept for a lifetime.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-12 flex flex-wrap gap-3"
            >
              <Link to="/buy" className="btn-tap">
                Founders Edition <ArrowUpRight size={16} strokeWidth={1.5} />
              </Link>
              <Link to="/how-it-works" className="btn-tap btn-tap-ghost">Explore</Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 order-1 lg:order-2"
          >
            <motion.img
              src={heroPendant}
              alt="TAPORIA pendant"
              width={1600}
              height={1600}
              className="w-full h-auto object-contain"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* Marquee tagline */}
        <div className="border-y border-black py-5 marquee">
          <div className="marquee-track text-display text-2xl md:text-3xl tracking-[0.2em] opacity-90">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-16 px-8">
                <span>HANDCRAFTED</span><span>·</span>
                <span>NFC POWERED</span><span>·</span>
                <span>STAINLESS STEEL</span><span>·</span>
                <span>WATERPROOF</span><span>·</span>
                <span>BATCH 01 — 100 PIECES</span><span>·</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMORY EXPERIENCE */}
      <section className="bg-white py-32 md:py-48">
        <div className="container-edge grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <Reveal className="lg:col-span-6">
            <img src={memoryTap} alt="Tapping the pendant" loading="lazy" width={1600} height={1200} className="w-full h-auto" />
          </Reveal>
          <Reveal className="lg:col-span-6" delay={1}>
            <p className="text-eyebrow">The Experience</p>
            <h2 className="text-display mt-6 text-5xl md:text-7xl">
              A whole story,<br />held in a tap.
            </h2>
            <p className="mt-8 text-base font-light leading-relaxed max-w-md opacity-80">
              Tap your TAPORIA pendant against any smartphone and a private memory
              page unfolds — photographs, voice notes, a song, a message you wrote
              once and never wanted to forget.
            </p>
            <ul className="mt-10 space-y-4 text-sm">
              {["Photographs & film", "Voice notes & music", "Private messages", "A page only yours opens"].map((x) => (
                <li key={x} className="flex items-center gap-4">
                  <span className="w-8 h-px bg-black" />
                  <span className="tracking-wide">{x}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-black text-white py-32 md:py-44">
        <div className="container-edge">
          <Reveal>
            <p className="text-eyebrow opacity-60">Four Steps</p>
            <h2 className="text-display mt-6 text-5xl md:text-7xl max-w-3xl">
              From a moment.<br />Into a keepsake.
            </h2>
          </Reveal>
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Choose Your Pendant", "Reserve a piece from the Founders Edition."],
              ["02", "Upload Your Memories", "Share photographs, films, voice notes, words."],
              ["03", "We Craft Your Experience", "Handcrafted in our studio. NFC bonded inside."],
              ["04", "Tap To Relive", "One tap, anywhere — your moment opens."],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i} className="border-t md:border-t-0 md:border-l border-white/30 p-10 first:border-l-0">
                <div className="text-display text-5xl opacity-50">{n}</div>
                <div className="mt-12 text-xl tracking-tight">{t}</div>
                <div className="mt-4 text-sm font-light opacity-70 leading-relaxed">{d}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDERS EDITION */}
      <section className="bg-white py-32 md:py-44">
        <div className="container-edge grid grid-cols-1 lg:grid-cols-12 gap-16 items-end">
          <Reveal className="lg:col-span-7">
            <p className="text-eyebrow">Founders Edition</p>
            <h2 className="text-display mt-6 text-[12vw] lg:text-[8vw] leading-[0.85]">
              Only<br />One Hundred.
            </h2>
            <p className="mt-10 max-w-md text-base font-light leading-relaxed opacity-80">
              The first edition of TAPORIA is intentionally small. One hundred
              pieces, individually numbered, made by hand. After this, the
              edition closes — forever.
            </p>
            <div className="mt-10 flex gap-3">
              <Link to="/buy" className="btn-tap">Reserve A Piece</Link>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={1}>
            <img src={pendantBack} alt="Engraved back" loading="lazy" width={1600} height={1200} className="w-full h-auto" />
            <div className="mt-6 flex justify-between text-xs uppercase tracking-[0.25em] opacity-70">
              <span>Engraved · Numbered</span>
              <span>Edition 01 / 100</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PACKAGING / WORN */}
      <section className="bg-white pb-32 md:pb-44">
        <div className="container-edge grid grid-cols-1 md:grid-cols-2 gap-px bg-black">
          <Reveal className="bg-white">
            <img src={packaging} alt="Handcrafted TAPORIA pendant packaging unboxing detail" loading="lazy" width={1600} height={1200} className="w-full h-auto" />
            <div className="p-10">
              <p className="text-eyebrow">Unboxing</p>
              <h3 className="text-display mt-6 text-3xl md:text-4xl">A ceremony, not a delivery.</h3>
            </div>
          </Reveal>
          <Reveal className="bg-white" delay={1}>
            <img src={wornPortrait} alt="Person wearing the TAPORIA pendant — lifestyle portrait" loading="lazy" width={1080} height={1920} className="w-full h-auto" />
            <div className="p-10">
              <p className="text-eyebrow">Worn</p>
              <h3 className="text-display mt-6 text-3xl md:text-4xl">Close to where it belongs.</h3>
            </div>
          </Reveal>
        </div>

      </section>

      {/* CTA */}
      <section className="bg-white border-t border-black py-32 md:py-44">
        <div className="container-edge text-center">
          <Reveal>
            <p className="text-eyebrow">The First Hundred</p>
            <h2 className="text-display mt-8 text-[14vw] lg:text-[10vw] leading-[0.85]">
              Wear<br />Your Story.
            </h2>
            <div className="mt-12 flex justify-center gap-3">
              <Link to="/buy" className="btn-tap">Reserve Now</Link>
              <Link to="/why" className="btn-tap btn-tap-ghost">Why TAPORIA</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
