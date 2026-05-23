import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Col = { key: string; label: string; render?: (v: any, row: any) => React.ReactNode };

function AdminTable({ title, table, columns, order = "created_at" }: { title: string; table: string; columns: Col[]; order?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table as any).select("*").order(order, { ascending: false }).limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });
  return (
    <div>
      <p className="text-eyebrow">{title}</p>
      <h1 className="text-display text-5xl mt-4">{title}.</h1>
      <div className="mt-12 border border-black overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black">
              {columns.map((c) => <th key={c.key} className="text-left p-4 text-eyebrow opacity-60">{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={columns.length} className="p-8 text-center opacity-50">Loading…</td></tr>}
            {!isLoading && data?.length === 0 && <tr><td colSpan={columns.length} className="p-8 text-center opacity-50">No records yet.</td></tr>}
            {data?.map((row: any) => (
              <tr key={row.id} className="border-b border-black/20 hover:bg-black hover:text-white">
                {columns.map((c) => <td key={c.key} className="p-4 align-top font-light">{c.render ? c.render(row[c.key], row) : row[c.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_admin/admin/orders")({
  component: () => <AdminTable title="Orders" table="orders" columns={[
    { key: "created_at", label: "Date", render: (v) => new Date(v).toLocaleDateString() },
    { key: "customer_name", label: "Customer" },
    { key: "customer_email", label: "Email" },
    { key: "customer_phone", label: "Phone" },
    { key: "amount_inr", label: "Amount", render: (v) => `₹${v?.toLocaleString("en-IN")}` },
    { key: "payment_status", label: "Payment" },
    { key: "order_status", label: "Status" },
  ]} />,
});
