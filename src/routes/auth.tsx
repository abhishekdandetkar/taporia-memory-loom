import { createFileRoute, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — TAPORIA" }] }),
  component: Auth,
});

const emailSchema = z.string().trim().email().max(255);
const passwordSchema = z.string().min(6).max(72);

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eOk = emailSchema.safeParse(email);
    const pOk = passwordSchema.safeParse(password);
    if (!eOk.success || !pOk.success) {
      toast.error("Invalid email or password (min 6 chars)");
      return;
    }
    setLoading(true);
    try {
      if (mode === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. Check your inbox to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
        navigate({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="text-display tracking-[0.3em] text-xl">TAPORIA</Link>
        <h1 className="text-display mt-12 text-5xl">{mode === "sign-in" ? "Sign In" : "Create Account"}</h1>
        <form onSubmit={submit} className="mt-12 space-y-8">
          <div>
            <label className="text-eyebrow opacity-50 block">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-3 w-full bg-transparent border-b border-black outline-none py-3 text-base" />
          </div>
          <div>
            <label className="text-eyebrow opacity-50 block">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-3 w-full bg-transparent border-b border-black outline-none py-3 text-base" />
          </div>
          <button disabled={loading} className="btn-tap w-full">
            {loading ? "Please wait…" : mode === "sign-in" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
          className="mt-10 text-xs uppercase tracking-[0.25em] underline underline-offset-8">
          {mode === "sign-in" ? "Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

// suppress unused import
void redirect;
