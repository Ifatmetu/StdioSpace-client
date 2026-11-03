"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Heart, MapPin, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StudioDetailsDialog } from "@/components/studios/studio-details-dialog";
import type { Studio } from "@/data/studio-catalog";
import { useStudios } from "@/hooks/use-studios";

export function FeaturedStudios() {
  const { studios, isLoading, error } = useStudios();
  const [savedIds, setSavedIds] = React.useState<Set<Studio["id"]>>(new Set());
  const [selectedStudio, setSelectedStudio] = React.useState<Studio | null>(null);

  const toggleSave = (id: Studio["id"], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#db1a6e]">
              Handpicked Spaces
            </div>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              Featured studios
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
              Top-rated spaces creators are booking right now in Dhaka.
            </p>
          </div>
          <Link href="/studios">
            <Button variant="outline" className="rounded-xl border-slate-300 font-semibold dark:border-slate-700">
              View all studios
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </Link>
        </div>

        {/* Studio Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800"
              />
            ))
          ) : error ? (
            <p className="col-span-full rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </p>
          ) : studios.length === 0 ? (
            <p className="col-span-full py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No studios are available yet.
            </p>
          ) : (
            studios.slice(0, 6).map((studio) => {
              const isSaved = savedIds.has(studio.id);

              return (
                <Card
                  key={studio.id}
                  onClick={() => setSelectedStudio(studio)}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                {/* Visual Thumbnail */}
                <div
                  className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${studio.gradient} bg-cover bg-center p-4 transition-transform duration-300 group-hover:scale-102`}
                  style={studio.image ? { backgroundImage: `url("${studio.image}")` } : undefined}
                >
                  {/* Decorative background shapes */}
                  <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-white/20 blur-md" />
                  <div className="absolute top-0 right-0 size-24 rounded-full bg-white/10 blur-sm" />

                  {/* Top Tags & Wishlist Button */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      {studio.category}
                    </span>

                    <button
                      onClick={(e) => toggleSave(studio.id, e)}
                      aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                      className={`inline-flex size-9 items-center justify-center rounded-full transition-colors ${
                        isSaved
                          ? "bg-white text-[#db1a6e] shadow-md"
                          : "bg-white/80 text-slate-800 backdrop-blur-xs hover:bg-white dark:bg-slate-900/80 dark:text-white"
                      }`}
                    >
                      <Heart className={`size-4.5 ${isSaved ? "fill-[#db1a6e]" : ""}`} />
                    </button>
                  </div>

                  {/* Bottom Rating Badge */}
                  <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-bold text-slate-950 shadow-xs">
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    <span>{studio.rating}</span>
                    <span className="text-[11px] font-normal text-slate-500">
                      ({studio.reviewsCount})
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="flex flex-col justify-between p-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950 group-hover:text-[#db1a6e] transition-colors dark:text-white">
                      {studio.title}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="size-3.5 shrink-0 text-slate-400" />
                      <span>{studio.location}</span>
                      <span>•</span>
                      <Users className="size-3.5 shrink-0 text-slate-400" />
                      <span>Up to {studio.capacity}</span>
                    </div>

                    {/* Amenities chips */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {studio.amenities.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Price & Action */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div>
                      <span className="text-xl font-extrabold text-slate-950 dark:text-white">
                        ${studio.price}
                      </span>
                      <span className="text-xs text-slate-500"> / hour</span>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedStudio(studio);
                      }}
                      className="rounded-xl border-slate-200 font-semibold hover:border-[#db1a6e] hover:text-[#db1a6e] dark:border-slate-700"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
                </Card>
              );
            })
          )}
        </div>

      </div>
      <StudioDetailsDialog
        key={selectedStudio?.id ?? "closed"}
        studio={selectedStudio}
        onClose={() => setSelectedStudio(null)}
      />
    </section>
  );
}
