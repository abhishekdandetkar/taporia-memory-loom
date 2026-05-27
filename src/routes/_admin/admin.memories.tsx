import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin/admin/memories")({
  head: () => ({ meta: [{ title: "Memory Pages — Admin · TAPORIA" }] }),

  component: () => {
    const { data, isLoading } = useQuery({ queryKey: ["memories"], queryFn: async () => {
      const { data, error } = await supabase.from("memory_pages").select("*").order("created_at", { ascending: false });
      if (error) throw error; return data ?? [];
    }});
    return (
      <div>
        <p className="text-eyebrow">Memory Pages</p>
        <h1 className="text-display text-5xl mt-4">Memories.</h1>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black">
          {isLoading && <div className="bg-white p-8 col-span-full text-center opacity-50">Loading…</div>}
          {!isLoading && data?.length === 0 && <div className="bg-white p-8 col-span-full text-center opacity-50">No memory pages yet.</div>}
          {data?.map((m) => (
            <div key={m.id} className="bg-white p-8 border-l border-black">
              <p className="text-eyebrow opacity-50">{m.pendant_code}</p>
              <h3 className="text-display mt-4 text-2xl">{m.title || "Untitled"}</h3>
              <p className="mt-4 text-sm font-light opacity-80 line-clamp-3">{m.story}</p>
              <div className="mt-6 flex justify-between text-xs uppercase tracking-[0.25em] opacity-60">
                <span>{m.is_published ? "Published" : "Draft"}</span>
                <span>{Array.isArray(m.media) ? m.media.length : 0} files</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
