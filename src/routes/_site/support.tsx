import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_site/support")({
  validateSearch: (s: Record<string, unknown>) => ({
    topic: typeof s.topic === "string" ? s.topic : "general",
  }),
  head: () => ({
    meta: [
      { title: "Support — TAPORIA" },
      { name: "description", content: "Get help with your TAPORIA order, delivery, or memory page. Our team responds within 24 hours." },
      { property: "og:title", content: "TAPORIA — Support" },
      { property: "og:description", content: "We respond within 24 hours." },
      { property: "og:url", content: "https://taporia-memory-loom.lovable.app/support" },
    ],
    links: [{ rel: "canonical", href: "https://taporia-memory-loom.lovable.app/support" }],
  }),
  component: Support,
});


const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  order_id: z.string().trim().max(80).optional(),
  category: z.enum(["general", "order", "delivery", "memory"]),
  subject: z.string().trim().min(3).max(150),
  message: z.string().trim().min(10).max(2000),
});

function Support() {
  const { topic } = Route.useSearch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", order_id: "",
    category: (topic === "post" ? "delivery" : "general") as "general" | "order" | "delivery" | "memory",
    subject: "", message: "",
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
      const { error } = await supabase.from("support_tickets").insert(parsed.data);
      if (error) throw error;
      toast.success("Ticket received. We'll respond within 24 hours.");
      setForm({ name: "", email: "", order_id: "", category: "general", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Couldn't send your ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-white py-32 md:py-44 border-b border-black">
        <div className="container-edge">
          <Reveal><p className="text-eyebrow">Support</p></Reveal>
          <Reveal delay={1}>
            <h1 className="text-display mt-8 text-[12vw] lg:text-[8vw] leading-[0.85]">We're here.</h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-black text-white py-32">
        <div className="container-edge max-w-3xl">
          <Reveal>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white">
              {[
                ["name", "Your Name", "text"],
                ["email", "Email", "email"],
                ["order_id", "Order ID (optional)", "text"],
              ].map(([k, l, type]) => (
                <div key={k} className="bg-black p-6">
                  <label className="text-eyebrow opacity-50 block">{l}</label>
                  <input
                    type={type}
                    value={(form as any)[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    className="mt-3 w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-3 text-base"
                  />
                </div>
              ))}
              <div className="bg-black p-6">
                <label className="text-eyebrow opacity-50 block">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="mt-3 w-full bg-black border-b border-white/50 focus:border-white outline-none py-3 text-base text-white"
                >
                  <option value="general">General</option>
                  <option value="order">Order</option>
                  <option value="delivery">Delivery / Post-Delivery</option>
                  <option value="memory">Memory Page</option>
                </select>
              </div>
              <div className="bg-black p-6 md:col-span-2">
                <label className="text-eyebrow opacity-50 block">Subject</label>
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="mt-3 w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-3 text-base"
                />
              </div>
              <div className="bg-black p-6 md:col-span-2">
                <label className="text-eyebrow opacity-50 block">Message</label>
                <textarea
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-3 w-full bg-transparent border-b border-white/50 focus:border-white outline-none py-3 text-base resize-none"
                />
              </div>
              <div className="bg-black md:col-span-2 p-6 flex justify-end">
                <button disabled={loading} className="btn-tap btn-tap-ghost">
                  {loading ? "Sending…" : "Send Ticket"}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
