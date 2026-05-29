import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin/admin/reservations")({
  head: () => ({ meta: [{ title: "Reservations — Admin · TAPORIA" }] }),
  component: Reservations,
});

const STATUS = ["waiting", "contacted", "converted", "cancelled"];

export function Reservations() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reservations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reservations").select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error; return data ?? [];
    },
  });
  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("reservations").update(patch).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin", "reservations"] }); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete reservation?")) return;
    const { error } = await supabase.from("reservations").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "reservations"] }); }
  };

  return (
    <div>
      <p className="text-eyebrow">Reservations</p>
      <h1 className="text-display text-5xl mt-4">Reservations.</h1>
      <div className="mt-12 border border-black overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black">
              {["Date","Name","Contact","City","Status",""].map((h) => <th key={h} className="text-left p-4 text-eyebrow opacity-60">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="p-8 text-center opacity-50">Loading…</td></tr>}
            {!isLoading && data?.length === 0 && <tr><td colSpan={6} className="p-8 text-center opacity-50">No reservations yet.</td></tr>}
            {data?.map((r) => (
              <tr key={r.id} className="border-b border-black/20">
                <td className="p-4 align-top font-light">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="p-4 align-top font-light">{r.full_name}</td>
                <td className="p-4 align-top font-light"><div>{r.email}</div><div className="text-xs opacity-60 mt-1">{r.phone}</div></td>
                <td className="p-4 align-top font-light">{r.city ?? "—"}</td>
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
