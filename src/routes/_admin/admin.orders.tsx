import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Admin · TAPORIA" }] }),
  component: Orders,
});

const PAYMENT = ["pending", "paid", "failed", "refunded"];
const ORDER = ["placed", "confirmed", "shipped", "delivered", "cancelled"];
const MEMORY = ["awaiting", "in_progress", "ready", "delivered"];

function Orders() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const update = async (id: string, patch: any) => {
    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin", "orders"] }); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "orders"] }); }
  };

  return (
    <div>
      <p className="text-eyebrow">Orders</p>
      <h1 className="text-display text-5xl mt-4">Orders.</h1>
      <div className="mt-12 border border-black overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black">
              {["Date","Customer","Contact","Amount","Payment","Order","Memory",""].map((h) => (
                <th key={h} className="text-left p-4 text-eyebrow opacity-60">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={8} className="p-8 text-center opacity-50">Loading…</td></tr>}
            {!isLoading && data?.length === 0 && <tr><td colSpan={8} className="p-8 text-center opacity-50">No orders yet.</td></tr>}
            {data?.map((r) => (
              <tr key={r.id} className="border-b border-black/20">
                <td className="p-4 align-top font-light">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="p-4 align-top font-light">
                  <div>{r.customer_name}</div>
                  <div className="text-xs opacity-60 mt-1">{r.pendant_id ?? "—"}</div>
                </td>
                <td className="p-4 align-top font-light">
                  <div>{r.customer_email}</div>
                  <div className="text-xs opacity-60 mt-1">{r.customer_phone}</div>
                </td>
                <td className="p-4 align-top font-light">₹{r.amount_inr?.toLocaleString("en-IN")}</td>
                <td className="p-4 align-top">
                  <select defaultValue={r.payment_status} onChange={(e) => update(r.id, { payment_status: e.target.value })}
                    className="bg-white border border-black px-2 py-1 text-xs uppercase tracking-widest">
                    {PAYMENT.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 align-top">
                  <select defaultValue={r.order_status} onChange={(e) => update(r.id, { order_status: e.target.value })}
                    className="bg-white border border-black px-2 py-1 text-xs uppercase tracking-widest">
                    {ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 align-top">
                  <select defaultValue={r.memory_status} onChange={(e) => update(r.id, { memory_status: e.target.value })}
                    className="bg-white border border-black px-2 py-1 text-xs uppercase tracking-widest">
                    {MEMORY.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 align-top">
                  <button onClick={() => remove(r.id)} className="text-xs uppercase tracking-widest underline underline-offset-4">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
