import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container-edge py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-12">
          <div className="md:col-span-5">
            <div className="text-display text-5xl md:text-7xl tracking-[0.15em]">TAPORIA</div>
            <p className="mt-8 max-w-md text-sm font-light leading-relaxed opacity-80">
              One tap to your memories. Handcrafted wearable keepsakes, made to outlast every gallery.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-3 gap-8 md:gap-12 text-xs uppercase tracking-[0.2em]">
            <div>
              <div className="opacity-50 mb-6">Join</div>
              <ul className="space-y-4">
                <li><Link to="/buy" className="hover:opacity-60">Get Now</Link></li>
                <li><Link to="/corporate" className="hover:opacity-60">Corporate</Link></li>
                <li><Link to="/why" className="hover:opacity-60">About Us</Link></li>
                <li><Link to="/how-it-works" className="hover:opacity-60">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <div className="opacity-50 mb-6">Support</div>
              <ul className="space-y-4">
                <li><Link to="/faqs" className="hover:opacity-60">FAQs</Link></li>
                <li><Link to="/support" className="hover:opacity-60">Order Support</Link></li>
                <li><Link to="/support" search={{ topic: "post" }} className="hover:opacity-60">Post Delivery</Link></li>
              </ul>
            </div>
            <div>
              <div className="opacity-50 mb-6">Legal</div>
              <ul className="space-y-4">
                <li><Link to="/terms" className="hover:opacity-60">Terms</Link></li>
                <li><Link to="/privacy" className="hover:opacity-60">Privacy</Link></li>
                <li><Link to="/shipping" className="hover:opacity-60">Shipping</Link></li>
                <li><Link to="/cancellation" className="hover:opacity-60">Cancellation</Link></li>
                <li><Link to="/returns" className="hover:opacity-60">Returns</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rule rule-white opacity-30 mt-20 mb-8" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-xs uppercase tracking-[0.2em] opacity-70">
          <div>© {new Date().getFullYear()} TAPORIA. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" aria-label="Instagram" className="hover:opacity-60"><Instagram size={16} /></a>
            <a href="#" aria-label="Twitter" className="hover:opacity-60"><Twitter size={16} /></a>
            <a href="#" aria-label="Youtube" className="hover:opacity-60"><Youtube size={16} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
