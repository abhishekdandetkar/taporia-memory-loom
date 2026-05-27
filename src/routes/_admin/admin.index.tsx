import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin/admin/")({
  head: () => ({ meta: [{ title: "Overview — Admin · TAPORIA" }] }),
  component: Overview,
});


function Card({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border border-black p-8">
      <p className="text-eyebrow opacity-50">{label}</p>
      <div className="text-display text-5xl mt-6">{value}</div>
    </div>
  );
}

function Overview() {
  const { data } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const [o, r, l, t] = await Promise.all([
        supabase.from("orders").select("id, payment_status, amount_inr"),
        supabase.from("reservations").select("id"),
        supabase.from("corporate_leads").select("id"),
        supabase.from("support_tickets").select("id, status"),
      ]);
      const orders = o.data ?? [];
      const paid = orders.filter((x) => x.payment_status === "paid");
      return {
        orders: orders.length,
        paid: paid.length,
        revenue: paid.reduce((s, x) => s + (x.amount_inr ?? 0), 0),
        reservations: r.data?.length ?? 0,
        leads: l.data?.length ?? 0,
        openTickets: (t.data ?? []).filter((x) => x.status === "open").length,
      };
    },
  });

  return (
    <div>
      <p className="text-eyebrow">Overview</p>
      <h1 className="text-display text-5xl mt-4">Dashboard.</h1>
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-px bg-black">
        <Card label="Total Orders" value={data?.orders ?? 0} />
        <Card label="Paid Orders" value={data?.paid ?? 0} />
        <Card label="Revenue" value={`₹${((data?.revenue ?? 0)).toLocaleString("en-IN")}`} />
        <Card label="Reservations" value={data?.reservations ?? 0} />
        <Card label="Corporate Leads" value={data?.leads ?? 0} />
        <Card label="Open Tickets" value={data?.openTickets ?? 0} />
      </div>
    </div>
  );
}
