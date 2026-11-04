
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useStudios } from "@/hooks/use-studios";

// Category Images
const categoryImages = [
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=85",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=85",
  "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=85",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=85",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=85",
];

export function Banner() {
  const router = useRouter();
  const { user } = useAuth();
  const { studios, isLoading, error } = useStudios();

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);

  // Auto-play: Change studio and image every 4 seconds
  React.useEffect(() => {
    if (!isPlaying || studios.length < 2) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % studios.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPlaying, studios.length]);

  // Active Studio
  const activeStudio = studios.length
    ? studios[activeIndex % studios.length]
    : null;

  // Current Background Image
  const activeImage = categoryImages[activeIndex % categoryImages.length];

  // Previous Studio
  const handlePrev = () => {
    if (studios.length > 1) {
      setActiveIndex(
        (prev) => (prev - 1 + studios.length) % studios.length
      );
    }
  };

  // Next Studio
  const handleNext = () => {
    if (studios.length > 1) {
      setActiveIndex((prev) => (prev + 1) % studios.length);
    }
  };

  // Host Button
  const handleHostClick = () => {
    if (!user) {
      router.push("/login?redirect=/add-studio");
    } else {
      router.push("/add-studio");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 sm:py-24 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#db1a6e]/15 to-cyan-500/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">

          {/* LEFT COLUMN */}
          <div className="text-center lg:col-span-7 lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#db1a6e]/20 bg-[#db1a6e]/10 px-4 py-1.5 text-xs font-semibold text-[#db1a6e] dark:bg-[#db1a6e]/20">
              <Sparkles className="size-3.5" />
              <span>Instant studio booking by the hour</span>
            </div>

            {/* Heading */}
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl md:text-6xl dark:text-white">
              Rent the room. <br />
              <span className="bg-gradient-to-r from-[#db1a6e] to-[#ff6b8b] bg-clip-text text-transparent">
                Make the shot.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-2xl text-lg text-slate-600 sm:text-xl dark:text-slate-300">
              Book photography cycloramas, sound stages, podcast lounges,
              and recording suites by the hour in Dhaka.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link href="/studios">
                <Button className="h-12 rounded-xl bg-[#db1a6e] px-7 text-base font-semibold text-white shadow-md transition-all hover:bg-[#c2135f] hover:shadow-lg">
                  Explore Studios
                  <ArrowRight className="ml-1 size-4" />
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={handleHostClick}
                className="h-12 rounded-xl border-slate-300 px-7 text-base font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Host your stage
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-slate-200 pt-8 sm:gap-8 dark:border-slate-800">

              <div>
                <div className="text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
                  {isLoading ? "…" : studios.length}
                </div>
                <div className="text-xs text-slate-500 sm:text-sm">
                  Verified Studios
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
                  {isLoading || studios.length === 0
                    ? "—"
                    : `$${Math.min(
                        ...studios.map((studio) => studio.price)
                      )}`}
                </div>
                <div className="text-xs text-slate-500 sm:text-sm">
                  Starting / Hour
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
                  100%
                </div>
                <div className="text-xs text-slate-500 sm:text-sm">
                  Host Guarantee
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="relative mx-auto w-full max-w-md lg:col-span-5">

            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">

              {activeStudio ? (
                <div>

                  {/* Featured Studio Image */}
                  <div
                    key={activeIndex}
                    className="group relative flex h-64 flex-col justify-between overflow-hidden rounded-2xl bg-slate-800 bg-cover bg-center p-6 text-white shadow-inner"
                    style={{
                      backgroundImage: `url("${activeImage}")`,
                    }}
                  >

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />

                    {/* Decorative Glow */}
                    <div className="absolute -bottom-16 -right-16 size-48 rounded-full bg-white/15 blur-xl" />

                    <div className="absolute -top-12 -left-12 size-36 rounded-full bg-white/10 blur-lg" />

                    {/* Category & Rating */}
                    <div className="relative z-10 flex items-start justify-between">

                      <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                        {activeStudio.category}
                      </span>

                      <div className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-950">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        <span>{activeStudio.rating}</span>
                      </div>
                    </div>

                    {/* Studio Information */}
                    <div className="relative z-10">

                      <h3 className="text-2xl font-extrabold tracking-tight">
                        {activeStudio.title}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-white/90">
                        {activeStudio.location}
                      </p>

                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-2xl font-black">
                          ${activeStudio.price}
                        </span>
                        <span className="text-xs text-white/80">
                          / hour
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Meta & Controls */}
                  <div className="mt-5 space-y-4">

                    <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                      {activeStudio.overview}
                    </p>

                    <div className="flex items-center justify-between pt-2">

                      {/* Slider Indicators */}
                      <div className="flex items-center gap-1.5">
                        {studios.map((studio, i) => (
                          <button
                            key={studio.id}
                            onClick={() => setActiveIndex(i)}
                            className={`h-2 rounded-full transition-all ${
                              i === activeIndex % studios.length
                                ? "w-7 bg-[#db1a6e]"
                                : "w-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700"
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                          />
                        ))}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">

                        {/* Pause / Play */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setIsPlaying((prev) => !prev)}
                          disabled={studios.length < 2}
                          className="size-8 rounded-full border-slate-200 dark:border-slate-700"
                          aria-label={
                            isPlaying ? "Pause autoplay" : "Start autoplay"
                          }
                        >
                          {isPlaying ? (
                            <Pause className="size-3.5" />
                          ) : (
                            <Play className="size-3.5" />
                          )}
                        </Button>

                        {/* Previous */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handlePrev}
                          disabled={studios.length < 2}
                          className="size-8 rounded-full border-slate-200 dark:border-slate-700"
                          aria-label="Previous studio"
                        >
                          <ChevronLeft className="size-4" />
                        </Button>

                        {/* Next */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleNext}
                          disabled={studios.length < 2}
                          className="size-8 rounded-full border-slate-200 dark:border-slate-700"
                          aria-label="Next studio"
                        >
                          <ChevronRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (

                /* Loading / Empty State */
                <div className="flex min-h-[22rem] items-center justify-center rounded-2xl bg-slate-100 p-6 text-center dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {isLoading
                      ? "Loading studios..."
                      : error || "No studios are available yet."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
