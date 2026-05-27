import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const dateFmt = (v: any) => v ? new Date(v).toLocaleDateString() : "";

export const Route = createFileRoute("/_admin/admin/tickets")({
  head: () => ({ meta: [{ title: "Support Tickets — Admin · TAPORIA" }] }),

  component: () => {
    const { data, isLoading } = useQuery({ queryKey: ["admin", "tickets"], queryFn: async () => {
      const { data, error } = await supabase.from("support_tickets").select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error; return data ?? [];
    }});
    const cols = [
      { key: "created_at", label: "Date", fmt: dateFmt },
      { key: "name", label: "Name" }, { key: "email", label: "Email" },
      { key: "category", label: "Category" }, { key: "subject", label: "Subject" }, { key: "status", label: "Status" },
    ];
    return (<div>
      <p className="text-eyebrow">Support Tickets</p>
      <h1 className="text-display text-5xl mt-4">Tickets.</h1>
      <div className="mt-12 border border-black overflow-x-auto"><table className="w-full text-sm">
        <thead><tr className="border-b border-black">{cols.map((c) => <th key={c.key} className="text-left p-4 text-eyebrow opacity-60">{c.label}</th>)}</tr></thead>
        <tbody>
          {isLoading && <tr><td colSpan={cols.length} className="p-8 text-center opacity-50">Loading…</td></tr>}
          {!isLoading && data?.length === 0 && <tr><td colSpan={cols.length} className="p-8 text-center opacity-50">No records yet.</td></tr>}
          {data?.map((r) => (<tr key={r.id} className="border-b border-black/20 hover:bg-black hover:text-white">
            {cols.map((c) => <td key={c.key} className="p-4 align-top font-light max-w-xs truncate">{c.fmt ? c.fmt((r as any)[c.key]) : (r as any)[c.key]}</td>)}
          </tr>))}
        </tbody>
      </table></div>
    </div>);
  },
});
