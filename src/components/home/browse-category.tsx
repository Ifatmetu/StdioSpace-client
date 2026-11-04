
"use client";

import Link from "next/link";
import {
  Camera,
  Mic,
  Music,
  Palette,
  Video,
  ArrowUpRight,
} from "lucide-react";
import { CATEGORIES, type Category } from "@/data/studio-catalog";
import { useStudios } from "@/hooks/use-studios";

const categoryImages: Record<Category["key"], string> = {
  photo:
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=85",
  stage:
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=85",
  pod:
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=85",
  music:
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=85",
  art:
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=85",
};

export function BrowseCategory() {
  const { studios } = useStudios();

  const getIcon = (key: Category["key"]) => {
    switch (key) {
      case "photo":
        return <Camera className="size-6" />;
      case "stage":
        return <Video className="size-6" />;
      case "pod":
        return <Mic className="size-6" />;
      case "music":
        return <Music className="size-6" />;
      case "art":
        return <Palette className="size-6" />;
      default:
        return <Camera className="size-6" />;
    }
  };

  return (
    <section className="bg-slate-50/60 py-16 sm:py-24 dark:bg-slate-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-[#db1a6e]">
            Curated Categories
          </div>

          <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Browse by category
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            Pick a space type tailored for your gear, acoustics, and production needs.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={`/studios?category=${cat.key}`}
              className="group relative flex h-52 flex-col justify-between overflow-hidden rounded-2xl bg-slate-800 p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.98]"
            >
              {/* Background Image */}
              <img
                src={categoryImages[cat.key]}
                alt={`${cat.name} studio`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition-colors duration-300 group-hover:from-black/90" />

              {/* Top Icon & Arrow */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/20 backdrop-blur-md transition-colors group-hover:bg-white/30">
                  {getIcon(cat.key)}
                </div>

                <div className="flex size-8 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
                  <ArrowUpRight className="size-4" />
                </div>
              </div>

              {/* Bottom Labels */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold tracking-tight">
                  {cat.name}
                </h3>

                <p className="mt-1 text-xs font-medium text-white/85">
                  {studios.filter(
                    (studio) => studio.categoryKey === cat.key
                  ).length}{" "}
                  spaces ready
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
