import { Aperture, ShieldCheck, Users, Clock3, Camera } from "lucide-react";

const POINTS = [
  {
    icon: Camera,
    title: "Rooms built for the work",
    text: "Photo cycloramas, cinema stages, podcast lounges, music suites, and workshops, listed by the people who run them.",
  },
  {
    icon: Users,
    title: "Creators booking creators",
    text: "Hosts publish real hourly rates and deposits. Guests reserve the exact hours they need.",
  },
  {
    icon: ShieldCheck,
    title: "Verified people, safer gear",
    text: "Accounts are tied to a real email, and every booking stays attached to the host and the guest.",
  },
  {
    icon: Clock3,
    title: "Support when the shoot runs late",
    text: "Host support stays available so a locked door or a missing cable does not end the session.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 text-[#db1a6e]">
        <Aperture className="size-5" />
        <p className="text-sm font-semibold uppercase tracking-[0.18em]">About us</p>
      </div>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
        StudioSpace keeps the room out of the way of the work
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
        Filmmakers, photographers, podcasters, and musicians should spend their day making something, not hunting for a free wall and a quiet corner. StudioSpace is the marketplace where owners list those rooms and other creators book them by the hour.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {POINTS.map((point) => (
          <article
            key={point.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <point.icon className="size-5 text-[#db1a6e]" />
            <h2 className="mt-3 text-lg font-bold text-slate-950 dark:text-white">{point.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{point.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
