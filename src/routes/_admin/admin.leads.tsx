import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin/admin/leads")({
  head: () => ({ meta: [{ title: "Corporate Leads — Admin · TAPORIA" }] }),
  component: Leads,
});

const STATUS = ["new", "qualified", "proposal", "won", "lost"];

export function Leads() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("corporate_leads").select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error; return data ?? [];
    },
  });
  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("corporate_leads").update(patch).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin", "leads"] }); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete lead?")) return;
    const { error } = await supabase.from("corporate_leads").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "leads"] }); }
  };

  return (
    <div>
      <p className="text-eyebrow">Corporate Leads</p>
      <h1 className="text-display text-5xl mt-4">Leads.</h1>
      <div className="mt-12 border border-black overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black">
              {["Date","Company","Contact","Size","Use Case","Status",""].map((h) => <th key={h} className="text-left p-4 text-eyebrow opacity-60">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={7} className="p-8 text-center opacity-50">Loading…</td></tr>}
            {!isLoading && data?.length === 0 && <tr><td colSpan={7} className="p-8 text-center opacity-50">No leads yet.</td></tr>}
            {data?.map((r) => (
              <tr key={r.id} className="border-b border-black/20">
                <td className="p-4 align-top font-light">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="p-4 align-top font-light">{r.company_name}</td>
                <td className="p-4 align-top font-light">
                  <div>{r.contact_name}</div>
                  <div className="text-xs opacity-60 mt-1">{r.email}</div>
                  {r.phone && <div className="text-xs opacity-60">{r.phone}</div>}
                </td>
                <td className="p-4 align-top font-light">{r.employees ?? "—"}</td>
                <td className="p-4 align-top font-light max-w-xs"><div className="truncate" title={r.use_case ?? ""}>{r.use_case ?? "—"}</div>{r.message && <div className="text-xs opacity-60 mt-1 truncate" title={r.message}>{r.message}</div>}</td>
                <td className="p-4 align-top">
                  <select defaultValue={r.status} onChange={(e) => update(r.id, { status: e.target.value })}
                    className="bg-white border border-black px-2 py-1 text-xs uppercase tracking-widest">
                    {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 align-top"><button onClick={() => remove(r.id)} className="text-xs uppercase tracking-widest underline underline-offset-4">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
