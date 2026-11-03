"use client";

import * as React from "react";
import Link from "next/link";
import { Camera, Mic, Music, Palette, Video, ArrowUpRight } from "lucide-react";
import { CATEGORIES, type Category } from "@/data/studio-catalog";
import { useStudios } from "@/hooks/use-studios";

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
              className="group relative flex h-48 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl active:scale-98"
              style={{
                backgroundImage:
                  cat.key === "photo"
                    ? "linear-gradient(135deg, #d6247f, #ff9a3c)"
                    : cat.key === "stage"
                    ? "linear-gradient(135deg, #3a1fa8, #0a9fb8)"
                    : cat.key === "pod"
                    ? "linear-gradient(135deg, #0b7a6b, #7be0a0)"
                    : cat.key === "music"
                    ? "linear-gradient(135deg, #7a1fa8, #ff4fa3)"
                    : "linear-gradient(135deg, #e0762b, #f4d03f)",
              }}
            >
              {/* Subtle radial sheen on hover */}
              <div className="absolute -right-8 -top-8 size-28 rounded-full bg-white/20 blur-md transition-transform duration-300 group-hover:scale-125" />

              {/* Top icon & Arrow */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex size-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md transition-colors group-hover:bg-white/30">
                  {getIcon(cat.key)}
                </div>
                <div className="size-7 rounded-full bg-white/15 backdrop-blur-xs flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <ArrowUpRight className="size-4" />
                </div>
              </div>

              {/* Bottom labels */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold tracking-tight">{cat.name}</h3>
                <p className="mt-0.5 text-xs font-medium text-white/85">
                  {studios.filter((studio) => studio.categoryKey === cat.key).length} spaces ready
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
