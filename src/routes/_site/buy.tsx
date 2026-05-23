import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import { supabase } from "@/integrations/supabase/client";
import heroPendant from "@/assets/hero-pendant.jpg";
import pendantBack from "@/assets/pendant-back.jpg";
import packaging from "@/assets/packaging.jpg";
import wornPortrait from "@/assets/worn-portrait.jpg";

export const Route = createFileRoute("/_site/buy")({
  head: () => ({
    meta: [
      { title: "Buy TAPORIA — Founders Edition" },
      { name: "description", content: "Reserve your TAPORIA pendant. Handcrafted stainless steel with a hidden NFC memory core. INR 4,999 — Founders Edition." },
      { property: "og:title", content: "TAPORIA — Founders Edition" },
      { property: "og:description", content: "Handcrafted memory pendant. Limited to 100 pieces." },
    ],
  }),
  component: Buy,
});

const PRICE_INR = 4999;

const schema = z.object({
  customer_name: z.string().trim().min(2, "Name too short").max(100),
  customer_email: z.string().trim().email("Invalid email").max(255),
  customer_phone: z.string().trim().min(7, "Invalid phone").max(20),
  shipping_address: z.string().trim().min(10, "Address too short").max(500),
});

function Buy() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          ...parsed.data,
          amount_inr: PRICE_INR,
          payment_provider: "phonepe",
          payment_status: "pending",
        })
        .select("id")
        .single();
      if (error) throw error;
      toast.success("Reservation captured. Redirecting to payment…");
      // PhonePe scaffold endpoint; until secrets are set it will return a stub URL
      const res = await fetch("/api/payment/phonepe/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: data.id, amount_inr: PRICE_INR }),
      });
      const payload = await res.json();
      if (payload?.redirect) {
        window.location.href = payload.redirect;
      } else {
        toast.info("Order reserved. Our team will contact you to complete payment.");
        navigate({ to: "/" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HERO */}
      <section className="bg-white py-20 md:py-32">
        <div className="container-edge grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <Reveal className="lg:col-span-7">
            <img src={heroPendant} alt="TAPORIA pendant" width={1600} height={1600} className="w-full h-auto" />
          </Reveal>
          <Reveal className="lg:col-span-5" delay={1}>
            <p className="text-eyebrow">Founders Edition · 01 / 100</p>
            <h1 className="text-display mt-6 text-6xl md:text-7xl">TAPORIA<br />Pendant.</h1>
            <p className="mt-6 text-base font-light opacity-80 leading-relaxed">
              Premium 316L stainless steel. Hidden NFC core.
              Hand-finished bezel. Numbered, engraved, and made to last.
            </p>
            <div className="mt-10 flex items-baseline gap-6">
              <div className="text-display text-4xl">₹{PRICE_INR.toLocaleString("en-IN")}</div>
              <div className="text-xs uppercase tracking-[0.25em] opacity-60">Inclusive of taxes</div>
            </div>
            <a href="#reserve" className="btn-tap mt-10">Reserve Yours</a>
          </Reveal>
        </div>
      </section>

      {/* DETAILS */}
      <section className="bg-white border-t border-black">
        <div className="container-edge grid grid-cols-1 md:grid-cols-3 gap-px bg-black">
          {[
            ["316L Stainless Steel", "Surgical-grade, hypoallergenic, polished by hand."],
            ["Hidden NFC Core", "Bonded beneath the bezel. Tap any phone. No app required."],
            ["Engraved & Numbered", "Each pendant carries a unique identity etched on the reverse."],
          ].map(([t, d], i) => (
            <Reveal key={t} className="bg-white p-10 md:p-14" delay={i}>
              <p className="text-eyebrow opacity-50">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="text-display mt-6 text-2xl">{t}</h3>
              <p className="mt-4 text-sm font-light opacity-80 leading-relaxed">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-white py-32">
        <div className="container-edge grid grid-cols-1 md:grid-cols-3 gap-px bg-black">
          {[pendantBack, packaging, wornPortrait].map((src, i) => (
            <Reveal key={i} className="bg-white" delay={i}>
              <img src={src} alt="TAPORIA detail" loading="lazy" width={1600} height={1200} className="w-full h-auto" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* RESERVE FORM */}
      <section id="reserve" className="bg-black text-white py-32">
        <div className="container-edge grid grid-cols-1 lg:grid-cols-12 gap-16">
          <Reveal className="lg:col-span-5">
            <p className="text-eyebrow opacity-60">Reserve · ₹{PRICE_INR.toLocaleString("en-IN")}</p>
            <h2 className="text-display mt-6 text-5xl md:text-6xl">Claim<br />Your Piece.</h2>
            <p className="mt-8 text-sm font-light opacity-70 max-w-md leading-relaxed">
              Payment is handled securely by PhonePe (UPI, cards, net banking).
              You will be guided through memory upload after checkout.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={1}>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white">
              {[
                ["customer_name", "Full Name", "text"],
                ["customer_email", "Email", "email"],
                ["customer_phone", "Phone", "tel"],
              ].map(([k, label, type]) => (
                <div key={k} className="bg-black p-6">
                  <label className="text-eyebrow opacity-50 block">{label}</label>
                  <input
                    type={type}
                    required
                    value={(form as any)[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    className="mt-3 w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-3 text-base text-white"
                  />
                </div>
              ))}
              <div className="bg-black p-6 md:col-span-1">
                <label className="text-eyebrow opacity-50 block">Edition</label>
                <div className="mt-3 py-3 text-base">Founders Edition · 01 / 100</div>
              </div>
              <div className="bg-black p-6 md:col-span-2">
                <label className="text-eyebrow opacity-50 block">Shipping Address</label>
                <textarea
                  required
                  rows={4}
                  value={form.shipping_address}
                  onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                  className="mt-3 w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-3 text-base text-white resize-none"
                />
              </div>
              <div className="bg-black md:col-span-2 p-6 flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.25em] opacity-70">
                  By reserving, you agree to our terms.
                </div>
                <button disabled={loading} type="submit" className="btn-tap btn-tap-ghost disabled:opacity-50">
                  {loading ? "Processing…" : `Pay ₹${PRICE_INR.toLocaleString("en-IN")}`}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
