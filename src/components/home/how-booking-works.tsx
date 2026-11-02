"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2, Film, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BOOKING_STEPS } from "@/data/dummy-data";

export function HowBookingWorks() {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Search className="size-5 text-[#db1a6e]" />;
      case 1:
        return <Calendar className="size-5 text-[#db1a6e]" />;
      case 2:
        return <CheckCircle2 className="size-5 text-[#db1a6e]" />;
      case 3:
        return <Film className="size-5 text-[#db1a6e]" />;
      default:
        return <Search className="size-5 text-[#db1a6e]" />;
    }
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-[#db1a6e]">
            Simple & Transparent
          </div>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            How booking works
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-base text-slate-600 dark:text-slate-400">
            Four simple steps from your initial creative concept to wrapped production.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BOOKING_STEPS.map((item, index) => (
            <div
              key={item.step}
              className="relative flex flex-col justify-between rounded-2xl border-l-4 border-l-[#db1a6e] border-y border-r border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black tracking-tight text-[#db1a6e]">
                    {item.step}
                  </span>
                  <div className="inline-flex size-10 items-center justify-center rounded-xl bg-[#db1a6e]/10">
                    {getStepIcon(index)}
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold text-slate-400">
                Step {index + 1} of 4
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link href="/studios">
            <Button className="h-11 rounded-xl bg-[#db1a6e] px-7 text-sm font-semibold text-white shadow-sm hover:bg-[#c2135f]">
              Find a studio now
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
