"use client";

import * as React from "react";
import { Headphones, ShieldCheck, UserCheck, Wrench } from "lucide-react";
import { GUARANTEES } from "@/data/dummy-data";

export function HostGuarantee() {
  const getGuaranteeIcon = (name: string) => {
    switch (name) {
      case "ShieldCheck":
        return <ShieldCheck className="size-6 text-emerald-500" />;
      case "UserCheck":
        return <UserCheck className="size-6 text-cyan-500" />;
      case "Wrench":
        return <Wrench className="size-6 text-amber-500" />;
      case "Headphones":
        return <Headphones className="size-6 text-[#db1a6e]" />;
      default:
        return <ShieldCheck className="size-6 text-[#db1a6e]" />;
    }
  };

  return (
    <section className="border-t border-slate-200/80 bg-slate-50/50 py-16 sm:py-24 dark:border-slate-800 dark:bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-[#db1a6e]">
            Trust & Security
          </div>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Host guarantee and creator support
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-base text-slate-600 dark:text-slate-400">
            Every booking is fully covered, from the moment you reserve until the shoot wraps.
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map((item) => (
            <div
              key={item.title}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all hover:border-[#db1a6e]/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  {getGuaranteeIcon(item.iconName)}
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Verified protection</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
