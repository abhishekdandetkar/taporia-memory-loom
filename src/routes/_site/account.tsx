import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_site/account")({
  head: () => ({
    meta: [
      { title: "Your Account — TAPORIA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Account,
});

function Account() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) { navigate({ to: "/auth" }); return; }
      setUserId(session.user.id); setEmail(session.user.email ?? ""); setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { navigate({ to: "/auth" }); return; }
      setUserId(data.session.user.id); setEmail(data.session.user.email ?? ""); setReady(true);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: profile } = useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["my-orders", userId, email],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("orders")
        .select("*")
        .or(`user_id.eq.${userId},customer_email.eq.${email}`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  useEffect(() => { setName(profile?.full_name ?? ""); setPhone(profile?.phone ?? ""); }, [profile]);

  const saveProfile = async () => {
    if (!userId) return;
    const { error } = await supabase.from("profiles").upsert({ id: userId, full_name: name, phone });
    if (error) toast.error(error.message);
    else { toast.success("Profile saved"); qc.invalidateQueries({ queryKey: ["profile", userId] }); }
  };

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/" }); };

  if (!ready) {
    return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-eyebrow">Loading…</p></div>;
  }

  return (
    <div className="container-edge py-20">
      <div className="flex items-baseline justify-between flex-wrap gap-4">
        <div>
          <p className="text-eyebrow">Account</p>
          <h1 className="text-display text-6xl mt-4">Your TAPORIA.</h1>
          <p className="mt-4 text-sm font-light opacity-70">{email}</p>
        </div>
        <button onClick={signOut} className="text-xs uppercase tracking-[0.25em] underline underline-offset-8">Sign Out</button>
      </div>

      <section className="mt-20 grid lg:grid-cols-2 gap-px bg-black border border-black">
        <div className="bg-white p-10">
          <p className="text-eyebrow opacity-50">Profile</p>
          <h2 className="text-display text-3xl mt-3">Details.</h2>
          <div className="mt-8 space-y-6">
            <div>
              <label htmlFor="acc-name" className="text-eyebrow opacity-50 block">Full Name</label>
              <input id="acc-name" value={name} onChange={(e) => setName(e.target.value)}
                className="mt-3 w-full bg-transparent border-b border-black outline-none py-3" />
            </div>
            <div>
              <label htmlFor="acc-phone" className="text-eyebrow opacity-50 block">Phone</label>
              <input id="acc-phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="mt-3 w-full bg-transparent border-b border-black outline-none py-3" />
            </div>
            <button onClick={saveProfile} className="btn-tap">Save Profile</button>
          </div>
        </div>

        <div className="bg-white p-10">
          <p className="text-eyebrow opacity-50">Quick Actions</p>
          <h2 className="text-display text-3xl mt-3">Shortcuts.</h2>
          <div className="mt-8 grid gap-4">
            <Link to="/buy" className="btn-tap text-center">Order A Pendant</Link>
            <Link to="/support" className="btn-tap btn-tap-ghost text-center">Get Support</Link>
            <Link to="/how-it-works" className="btn-tap btn-tap-ghost text-center">How It Works</Link>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <p className="text-eyebrow opacity-50">Orders</p>
        <h2 className="text-display text-4xl mt-3">Your Orders.</h2>
        <div className="mt-10 border border-black overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black">
                {["Date","Pendant","Amount","Payment","Order","Memory"].map((h) => (
                  <th key={h} className="text-left p-4 text-eyebrow opacity-60">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders?.length === 0 && <tr><td colSpan={6} className="p-10 text-center opacity-50">No orders yet.</td></tr>}
              {orders?.map((o) => (
                <tr key={o.id} className="border-b border-black/20">
                  <td className="p-4 font-light">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="p-4 font-light">{o.pendant_id ?? "—"}</td>
                  <td className="p-4 font-light">₹{o.amount_inr?.toLocaleString("en-IN")}</td>
                  <td className="p-4 font-light uppercase tracking-widest text-xs">{o.payment_status}</td>
                  <td className="p-4 font-light uppercase tracking-widest text-xs">{o.order_status}</td>
                  <td className="p-4 font-light uppercase tracking-widest text-xs">{o.memory_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
