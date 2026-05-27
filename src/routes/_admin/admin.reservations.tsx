import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function useList(table: string) {
  return useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table as any).select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error; return data ?? [];
    },
  });
}

function Table({ title, rows, isLoading, cols }: { title: string; rows: any[] | undefined; isLoading: boolean; cols: { key: string; label: string; fmt?: (v: any) => React.ReactNode }[] }) {
  return (
    <div>
      <p className="text-eyebrow">{title}</p>
      <h1 className="text-display text-5xl mt-4">{title}.</h1>
      <div className="mt-12 border border-black overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-black">{cols.map((c) => <th key={c.key} className="text-left p-4 text-eyebrow opacity-60">{c.label}</th>)}</tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={cols.length} className="p-8 text-center opacity-50">Loading…</td></tr>}
            {!isLoading && rows?.length === 0 && <tr><td colSpan={cols.length} className="p-8 text-center opacity-50">No records yet.</td></tr>}
            {rows?.map((r) => (
              <tr key={r.id} className="border-b border-black/20 hover:bg-black hover:text-white">
                {cols.map((c) => <td key={c.key} className="p-4 align-top font-light">{c.fmt ? c.fmt(r[c.key]) : r[c.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const dateFmt = (v: any) => v ? new Date(v).toLocaleDateString() : "";

export const Route = createFileRoute("/_admin/admin/reservations")({
  head: () => ({ meta: [{ title: "Reservations — Admin · TAPORIA" }] }),

  component: () => {
    const { data, isLoading } = useList("reservations");
    return <Table title="Reservations" rows={data} isLoading={isLoading} cols={[
      { key: "created_at", label: "Date", fmt: dateFmt },
      { key: "full_name", label: "Name" }, { key: "email", label: "Email" },
      { key: "phone", label: "Phone" }, { key: "city", label: "City" }, { key: "status", label: "Status" },
    ]} />;
  },
});
