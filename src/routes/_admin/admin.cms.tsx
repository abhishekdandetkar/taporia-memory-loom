import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin/admin/cms")({
  head: () => ({ meta: [{ title: "CMS — Admin · TAPORIA" }] }),
  component: CMS,
});


export function CMS() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["cms"], queryFn: async () => {
    const { data, error } = await supabase.from("cms_content").select("*").order("section_key");
    if (error) throw error; return data ?? [];
  }});
  const [newKey, setNewKey] = useState("");
  const [edits, setEdits] = useState<Record<string, string>>({});

  const save = async (id: string, key: string) => {
    const raw = edits[id] ?? "";
    let body: any = {};
    try { body = raw ? JSON.parse(raw) : {}; } catch { toast.error("Invalid JSON"); return; }
    const { error } = await supabase.from("cms_content").update({ body }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success(`${key} saved`); qc.invalidateQueries({ queryKey: ["cms"] }); }
  };
  const create = async () => {
    if (!newKey) return;
    const { error } = await supabase.from("cms_content").insert({ section_key: newKey, body: {} });
    if (error) toast.error(error.message); else { setNewKey(""); qc.invalidateQueries({ queryKey: ["cms"] }); }
  };

  return (
    <div>
      <p className="text-eyebrow">Content</p>
      <h1 className="text-display text-5xl mt-4">CMS.</h1>
      <p className="mt-6 text-sm font-light opacity-70 max-w-xl">Edit homepage copy, prices, and section content as JSON. Wire any key into the public pages with a Supabase fetch.</p>

      <div className="mt-10 flex gap-3 items-end">
        <div className="flex-1 max-w-md">
          <label className="text-eyebrow opacity-50 block">New Section Key</label>
          <input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="e.g. home_hero"
            className="mt-3 w-full bg-transparent border-b border-black outline-none py-3 text-base" />
        </div>
        <button onClick={create} className="btn-tap">Create</button>
      </div>

      <div className="mt-14 space-y-10">
        {isLoading && <p className="opacity-50">Loading…</p>}
        {data?.map((row) => (
          <div key={row.id} className="border border-black p-6">
            <div className="flex justify-between items-baseline">
              <div className="text-display text-xl">{row.section_key}</div>
              <div className="text-xs opacity-50">Updated {new Date(row.updated_at).toLocaleString()}</div>
            </div>
            <textarea rows={6} defaultValue={JSON.stringify(row.body, null, 2)}
              onChange={(e) => setEdits({ ...edits, [row.id]: e.target.value })}
              className="mt-4 w-full bg-transparent border border-black outline-none p-4 font-mono text-xs" />
            <div className="mt-3 flex justify-end"><button onClick={() => save(row.id, row.section_key)} className="btn-tap">Save</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
