import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin/admin/memories")({
  head: () => ({ meta: [{ title: "Memory Pages — Admin · TAPORIA" }] }),
  component: Memories,
});

function Memories() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["memories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("memory_pages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [newCode, setNewCode] = useState("");
  const [edits, setEdits] = useState<Record<string, { title: string; story: string }>>({});

  const refresh = () => qc.invalidateQueries({ queryKey: ["memories"] });

  const create = async () => {
    if (!newCode.trim()) return;
    const { error } = await supabase.from("memory_pages").insert({ pendant_code: newCode.trim(), title: "", story: "", is_published: false });
    if (error) toast.error(error.message); else { setNewCode(""); toast.success("Created"); refresh(); }
  };
  const save = async (id: string) => {
    const e = edits[id]; if (!e) return;
    const { error } = await supabase.from("memory_pages").update({ title: e.title, story: e.story }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Saved"); refresh(); }
  };
  const togglePublish = async (id: string, cur: boolean) => {
    const { error } = await supabase.from("memory_pages").update({ is_published: !cur }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success(!cur ? "Published" : "Unpublished"); refresh(); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete memory page?")) return;
    const { error } = await supabase.from("memory_pages").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); refresh(); }
  };
  const upload = async (id: string, code: string, file: File) => {
    const path = `${code}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("memories").upload(path, file);
    if (error) { toast.error(error.message); return; }
    const row = data?.find((m) => m.id === id);
    const media = Array.isArray(row?.media) ? [...(row!.media as any[])] : [];
    media.push({ path, name: file.name, type: file.type });
    const { error: e2 } = await supabase.from("memory_pages").update({ media }).eq("id", id);
    if (e2) toast.error(e2.message); else { toast.success("Uploaded"); refresh(); }
  };

  return (
    <div>
      <p className="text-eyebrow">Memory Pages</p>
      <h1 className="text-display text-5xl mt-4">Memories.</h1>

      <div className="mt-10 flex gap-3 items-end">
        <div className="flex-1 max-w-md">
          <label className="text-eyebrow opacity-50 block">New Pendant Code</label>
          <input value={newCode} onChange={(e) => setNewCode(e.target.value)} placeholder="e.g. TAP-000123"
            className="mt-3 w-full bg-transparent border-b border-black outline-none py-3 text-base" />
        </div>
        <button onClick={create} className="btn-tap">Create</button>
      </div>

      <div className="mt-14 space-y-10">
        {isLoading && <p className="opacity-50">Loading…</p>}
        {!isLoading && data?.length === 0 && <p className="opacity-50">No memory pages yet.</p>}
        {data?.map((m) => {
          const e = edits[m.id] ?? { title: m.title ?? "", story: m.story ?? "" };
          const media = Array.isArray(m.media) ? (m.media as any[]) : [];
          return (
            <div key={m.id} className="border border-black p-8">
              <div className="flex justify-between items-baseline gap-4 flex-wrap">
                <div>
                  <p className="text-eyebrow opacity-50">{m.pendant_code}</p>
                  <p className="text-xs opacity-50 mt-1">{m.is_published ? "Published" : "Draft"} · {media.length} files</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => togglePublish(m.id, m.is_published)} className="text-xs uppercase tracking-widest underline underline-offset-4">
                    {m.is_published ? "Unpublish" : "Publish"}
                  </button>
                  <button onClick={() => remove(m.id)} className="text-xs uppercase tracking-widest underline underline-offset-4">Delete</button>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div>
                  <label className="text-eyebrow opacity-50 block">Title</label>
                  <input defaultValue={e.title} onChange={(ev) => setEdits({ ...edits, [m.id]: { ...e, title: ev.target.value } })}
                    className="mt-2 w-full bg-transparent border-b border-black outline-none py-2" />
                </div>
                <div>
                  <label className="text-eyebrow opacity-50 block">Story</label>
                  <textarea defaultValue={e.story} rows={5} onChange={(ev) => setEdits({ ...edits, [m.id]: { ...e, story: ev.target.value } })}
                    className="mt-2 w-full bg-transparent border border-black outline-none p-3 font-light text-sm" />
                </div>
                <div className="flex justify-end"><button onClick={() => save(m.id)} className="btn-tap">Save</button></div>
              </div>

              <div className="mt-6 pt-6 border-t border-black">
                <label className="text-eyebrow opacity-50 block">Upload Media</label>
                <input type="file" onChange={(ev) => { const f = ev.target.files?.[0]; if (f) upload(m.id, m.pendant_code, f); ev.target.value = ""; }}
                  className="mt-3 text-sm" />
                {media.length > 0 && (
                  <ul className="mt-4 text-xs font-mono opacity-70 space-y-1">
                    {media.map((f, i) => <li key={i}>{f.name ?? f.path}</li>)}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
