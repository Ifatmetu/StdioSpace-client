import { Suspense } from "react";
import type { Metadata } from "next";
import { StudiosExplorer } from "@/components/studios/studios-explorer";

export const metadata: Metadata = {
  title: "Explore Studios - StudioSpace",
  description:
    "Browse photo studios, film stages, podcast lounges, music suites, and workshops by the hour in Dhaka.",
};

function StudiosExplorerFallback() {
  return (
    <div className="bg-[#f4f5fa] dark:bg-slate-950">
      <div className="border-b border-slate-200/80 bg-gradient-to-br from-white via-[#fdf2f7] to-[#f4f5fa] dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="h-3 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="mt-6 h-10 w-full max-w-xl animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-3 h-4 w-full max-w-lg animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="mt-8 h-14 w-full max-w-2xl animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-36 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
        <div className="mt-5 h-28 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800" />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense fallback={<StudiosExplorerFallback />}>
      <StudiosExplorer />
    </Suspense>
  );
}
