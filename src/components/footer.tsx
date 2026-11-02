"use client";

import * as React from "react";
import Link from "next/link";
import { Aperture } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/data/dummy-data";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Aperture className="size-6 text-[#db1a6e]" />
              <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                StudioSpace
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Our mission: put every creator in the right room, by the hour, at a fair price. Find and book photography, recording, and film spaces anytime.
            </p>
          </div>

          {/* Col 2: Explore */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-950 dark:text-white">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/studios"
                  className="text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                >
                  Explore Studios
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-950 dark:text-white">
              Categories
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.key}>
                  <Link
                    href={`/studios?category=${cat.key}`}
                    className="text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                  >
                    {cat.name}s
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter & Socials */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-950 dark:text-white">
              Newsletter
            </h4>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              New spaces, deals, and discounts directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <Input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-800 dark:bg-slate-900"
              />
              <Button
                type="submit"
                className="h-10 shrink-0 rounded-xl bg-[#db1a6e] px-4 font-semibold text-white hover:bg-[#c2135f]"
              >
                Join
              </Button>
            </form>

            {subscribed && (
              <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                ✓ Thank you for subscribing!
              </p>
            )}

            {/* Social Icons (X, Instagram, YouTube) */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="inline-flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-950 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-950 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="inline-flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-950 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © 2026 StudioSpace. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/security" className="hover:underline">
              Security
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
