import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const dateFmt = (v: any) => v ? new Date(v).toLocaleDateString() : "";

function useList(t: string) {
  return useQuery({ queryKey: ["admin", t], queryFn: async () => {
    const { data, error } = await supabase.from(t as any).select("*").order("created_at", { ascending: false }).limit(500);
    if (error) throw error; return data ?? [];
  }});
}

function Table({ title, rows, isLoading, cols }: any) {
  return (<div>
    <p className="text-eyebrow">{title}</p>
    <h1 className="text-display text-5xl mt-4">{title}.</h1>
    <div className="mt-12 border border-black overflow-x-auto"><table className="w-full text-sm">
      <thead><tr className="border-b border-black">{cols.map((c: any) => <th key={c.key} className="text-left p-4 text-eyebrow opacity-60">{c.label}</th>)}</tr></thead>
      <tbody>
        {isLoading && <tr><td colSpan={cols.length} className="p-8 text-center opacity-50">Loading…</td></tr>}
        {!isLoading && rows?.length === 0 && <tr><td colSpan={cols.length} className="p-8 text-center opacity-50">No records yet.</td></tr>}
        {rows?.map((r: any) => (<tr key={r.id} className="border-b border-black/20 hover:bg-black hover:text-white">
          {cols.map((c: any) => <td key={c.key} className="p-4 align-top font-light max-w-xs truncate">{c.fmt ? c.fmt(r[c.key]) : r[c.key]}</td>)}
        </tr>))}
      </tbody>
    </table></div>
  </div>);
}

export const Route = createFileRoute("/_admin/admin/leads")({
  component: () => { const { data, isLoading } = useList("corporate_leads");
    return <Table title="Corporate Leads" rows={data} isLoading={isLoading} cols={[
      { key: "created_at", label: "Date", fmt: dateFmt }, { key: "company_name", label: "Company" },
      { key: "contact_name", label: "Contact" }, { key: "email", label: "Email" },
      { key: "employees", label: "Size" }, { key: "use_case", label: "Use Case" }, { key: "status", label: "Status" },
    ]} />;
  },
});
