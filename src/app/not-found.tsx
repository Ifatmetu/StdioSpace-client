import Link from "next/link";
import { Aperture } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-6 flex size-28 items-center justify-center rounded-full bg-[#db1a6e]/10">
        <Aperture className="size-14 text-[#db1a6e]" />
        <span className="absolute -right-1 -top-1 rounded-full bg-slate-950 px-2 py-1 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
          404
        </span>
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
        This set is dark
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        That page is not on the call sheet. The studio you asked for is not here, but the lobby still is.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#db1a6e] px-6 text-sm font-semibold text-white hover:bg-[#c2135f]"
      >
        Return to Home
      </Link>
    </div>
  );
}
