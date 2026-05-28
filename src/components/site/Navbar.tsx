import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/buy", label: "Buy" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/why", label: "Why TAPORIA" },
  { to: "/corporate", label: "Corporate" },
  { to: "/faqs", label: "FAQs" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    return () => { window.removeEventListener("scroll", onScroll); subscription.unsubscribe(); };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-white border-b border-black" : "bg-white/0"
      }`}
    >
      <div className="container-edge flex items-center justify-between h-20">
        <Link to="/" className="text-display text-xl tracking-[0.3em]">
          TAPORIA
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[11px] tracking-[0.28em] uppercase font-medium hover:opacity-60 transition-opacity"
              activeProps={{ className: "underline underline-offset-8" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-6">
          <Link to={signedIn ? "/account" : "/auth"} className="text-[11px] tracking-[0.28em] uppercase font-medium hover:opacity-60">
            {signedIn ? "Account" : "Sign In"}
          </Link>
          <Link
            to="/buy"
            className="btn-tap"
            style={{ padding: "0.85rem 1.6rem", fontSize: "0.65rem" }}
          >
            Founders Edition
          </Link>
        </div>

        <button
          aria-label="Menu"
          className="lg:hidden p-2 border border-black"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-black">
          <div className="container-edge py-8 flex flex-col gap-6">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-sm tracking-[0.25em] uppercase"
              >
                {n.label}
              </Link>
            ))}
            <Link to="/buy" onClick={() => setOpen(false)} className="btn-tap w-fit">
              Founders Edition
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
