import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_site/corporate")({
  head: () => ({
    meta: [
      { title: "Corporate Deals — TAPORIA" },
      { name: "description", content: "Premium memory pendants for teams, milestones, and corporate gifting. Inquire for bulk orders." },
      { property: "og:title", content: "TAPORIA — Corporate Gifting" },
      { property: "og:description", content: "A meaningful gift, not a giveaway." },
    ],
  }),
  component: Corporate,
});

const schema = z.object({
  company_name: z.string().trim().min(2).max(150),
  contact_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional(),
  employees: z.string().trim().max(50).optional(),
  use_case: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(2000),
});

function Corporate() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "", contact_name: "", email: "", phone: "",
    employees: "", use_case: "", message: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("corporate_leads").insert(parsed.data);
      if (error) throw error;
      toast.success("Thank you. We'll be in touch shortly.");
      setForm({ company_name: "", contact_name: "", email: "", phone: "", employees: "", use_case: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Couldn't send your inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-white py-32 md:py-44 border-b border-black">
        <div className="container-edge">
          <Reveal><p className="text-eyebrow">Corporate Deals</p></Reveal>
          <Reveal delay={1}>
            <h1 className="text-display mt-8 text-[12vw] lg:text-[8vw] leading-[0.85] max-w-5xl">
              A gift<br />worth keeping.
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-12 max-w-xl text-base font-light opacity-80 leading-relaxed">
              For teams that have built something together. For clients you'd
              like to remember. For campaigns that need to mean more.
              TAPORIA crafts limited corporate editions — engraved,
              personalised, and quietly premium.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="container-edge grid grid-cols-1 md:grid-cols-3 gap-px bg-black">
          {[
            ["Team Milestones", "Anniversaries, exits, launches."],
            ["Premium Campaigns", "Luxury launches, VIP gifting."],
            ["Long-form Loyalty", "Clients, partners, investors."],
          ].map(([t, d], i) => (
            <Reveal key={t} className="bg-white p-10" delay={i}>
              <p className="text-eyebrow opacity-50">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="text-display mt-6 text-2xl">{t}</h3>
              <p className="mt-3 text-sm opacity-80 font-light">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-black text-white py-32">
        <div className="container-edge grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-eyebrow opacity-60">Inquire</p>
              <h2 className="text-display mt-6 text-5xl">Let's<br />build something.</h2>
              <p className="mt-8 text-sm font-light opacity-70 max-w-sm leading-relaxed">
                Tell us about your team and your moment. We'll come back within two working days.
              </p>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7" delay={1}>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white">
              {[
                ["company_name", "Company"],
                ["contact_name", "Your Name"],
                ["email", "Work Email"],
                ["phone", "Phone"],
                ["employees", "Team Size"],
                ["use_case", "Use Case"],
              ].map(([k, l]) => (
                <div key={k} className="bg-black p-6">
                  <label className="text-eyebrow opacity-50 block">{l}</label>
                  <input
                    value={(form as any)[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    className="mt-3 w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-3 text-base"
                  />
                </div>
              ))}
              <div className="bg-black p-6 md:col-span-2">
                <label className="text-eyebrow opacity-50 block">Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-3 w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-3 text-base resize-none"
                />
              </div>
              <div className="bg-black md:col-span-2 p-6 flex justify-end">
                <button disabled={loading} className="btn-tap btn-tap-ghost">
                  {loading ? "Sending…" : "Send Inquiry"}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
