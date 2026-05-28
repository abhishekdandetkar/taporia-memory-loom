import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin/admin/tickets")({
  head: () => ({ meta: [{ title: "Support Tickets — Admin · TAPORIA" }] }),
  component: Tickets,
});

const STATUS = ["open", "in_progress", "resolved", "closed"];

function Tickets() {
  const qc = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "tickets"],
    queryFn: async () => {
      const { data, error } = await supabase.from("support_tickets").select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error; return data ?? [];
    },
  });
  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("support_tickets").update(patch).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin", "tickets"] }); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete ticket?")) return;
    const { error } = await supabase.from("support_tickets").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "tickets"] }); }
  };

  return (
    <div>
      <p className="text-eyebrow">Support</p>
      <h1 className="text-display text-5xl mt-4">Tickets.</h1>
      <div className="mt-12 border border-black overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black">
              {["Date","Name","Contact","Category","Subject","Status",""].map((h) => <th key={h} className="text-left p-4 text-eyebrow opacity-60">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={7} className="p-8 text-center opacity-50">Loading…</td></tr>}
            {!isLoading && data?.length === 0 && <tr><td colSpan={7} className="p-8 text-center opacity-50">No tickets yet.</td></tr>}
            {data?.map((r) => (
              <>
                <tr key={r.id} className="border-b border-black/20 cursor-pointer" onClick={() => setOpenId(openId === r.id ? null : r.id)}>
                  <td className="p-4 align-top font-light">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="p-4 align-top font-light">{r.name}</td>
                  <td className="p-4 align-top font-light"><div>{r.email}</div>{r.order_id && <div className="text-xs opacity-60 mt-1">Order {r.order_id}</div>}</td>
                  <td className="p-4 align-top font-light">{r.category}</td>
                  <td className="p-4 align-top font-light max-w-xs truncate" title={r.subject}>{r.subject}</td>
                  <td className="p-4 align-top" onClick={(e) => e.stopPropagation()}>
                    <select defaultValue={r.status} onChange={(e) => update(r.id, { status: e.target.value })}
                      className="bg-white border border-black px-2 py-1 text-xs uppercase tracking-widest">
                      {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-4 align-top" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => remove(r.id)} className="text-xs uppercase tracking-widest underline underline-offset-4">Delete</button>
                  </td>
                </tr>
                {openId === r.id && (
                  <tr key={r.id + "-msg"} className="border-b border-black/20 bg-black text-white">
                    <td colSpan={7} className="p-6 font-light whitespace-pre-wrap">{r.message}</td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
