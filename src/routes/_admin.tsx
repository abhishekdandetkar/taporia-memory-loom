import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin")({
  head: () => ({
    meta: [
      { title: "Admin — TAPORIA" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});


function AdminLayout() {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "ok" | "no-auth" | "no-role">("loading");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (!session) { setState("no-auth"); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
      setState(data ? "ok" : "no-role");
    });
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { setState("no-auth"); return; }
      const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id).eq("role", "admin").maybeSingle();
      setState(r ? "ok" : "no-role");
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (state === "no-auth") navigate({ to: "/auth" });
  }, [state, navigate]);

  if (state === "loading") return <div className="min-h-screen flex items-center justify-center bg-white"><p className="text-eyebrow">Loading…</p></div>;
  if (state === "no-role") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        <p className="text-eyebrow">Restricted</p>
        <h1 className="text-display mt-6 text-4xl">Admins only.</h1>
        <p className="mt-6 max-w-md text-sm font-light opacity-70">
          Your account doesn't have admin access. Ask an existing admin to grant you the <code className="font-mono">admin</code> role in the user_roles table.
        </p>
        <button onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/auth" }))} className="btn-tap mt-10">Sign Out</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex">
      <aside className="w-64 border-r border-black p-8 hidden md:flex flex-col gap-12 sticky top-0 h-screen">
        <Link to="/" className="text-display tracking-[0.3em] text-lg">TAPORIA</Link>
        <nav className="flex flex-col gap-5 text-xs uppercase tracking-[0.25em]">
          {[
            ["/admin", "Overview"],
            ["/admin/orders", "Orders"],
            ["/admin/reservations", "Reservations"],
            ["/admin/leads", "Corporate Leads"],
            ["/admin/tickets", "Support Tickets"],
            ["/admin/cms", "CMS"],
            ["/admin/memories", "Memory Pages"],
          ].map(([to, label]) => (
            <Link key={to} to={to} activeOptions={{ exact: to === "/admin" }} activeProps={{ className: "underline underline-offset-8" }} className="hover:opacity-60">
              {label}
            </Link>
          ))}
        </nav>
        <button onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/auth" }))}
          className="mt-auto text-xs uppercase tracking-[0.25em] text-left hover:opacity-60">Sign Out</button>
      </aside>
      <main className="flex-1 p-8 md:p-14">
        <Outlet />
      </main>
    </div>
  );
}
