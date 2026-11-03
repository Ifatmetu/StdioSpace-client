"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Camera,
  Heart,
  MapPin,
  Mic,
  Music,
  Palette,
  PlusCircle,
  Search,
  SearchX,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
  Video,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { StudioDetailsDialog } from "@/components/studios/studio-details-dialog";
import { CATEGORIES, type Category, type Studio } from "@/data/studio-catalog";
import { useStudios } from "@/hooks/use-studios";

type CategoryFilter = "all" | Category["key"];

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating" | "reviews";

const CATEGORY_KEYS = CATEGORIES.map((category) => category.key);
const CATEGORY_ICONS: Record<Category["key"], LucideIcon> = {
  photo: Camera,
  stage: Video,
  pod: Mic,
  music: Music,
  art: Palette,
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "reviews", label: "Most reviewed" },
];

const CAPACITY_OPTIONS = [
  { value: 0, label: "Any capacity" },
  { value: 5, label: "5+ people" },
  { value: 10, label: "10+ people" },
  { value: 20, label: "20+ people" },
];

function isCategoryKey(value: string | null): value is Category["key"] {
  return value !== null && (CATEGORY_KEYS as string[]).includes(value);
}

function matchesQuery(studio: Studio, query: string) {
  const haystack = [
    studio.title,
    studio.category,
    studio.location,
    studio.overview,
    ...studio.amenities,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function StudiosExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { studios, isLoading, error } = useStudios();

  const categoryParam = searchParams.get("category");
  const activeCategory: CategoryFilter = isCategoryKey(categoryParam)
    ? categoryParam
    : "all";

  const [query, setQuery] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState<number | null>(null);
  const [minCapacity, setMinCapacity] = React.useState(0);
  const [sort, setSort] = React.useState<SortKey>("recommended");
  const [savedIds, setSavedIds] = React.useState<Set<Studio["id"]>>(new Set());
  const [selectedStudio, setSelectedStudio] = React.useState<Studio | null>(null);

  const prices = studios.map((studio) => studio.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxAvailablePrice = prices.length ? Math.max(...prices) : 1;
  const sliderMax = Math.max(maxAvailablePrice, minPrice + 1);
  const effectiveMaxPrice = maxPrice ?? sliderMax;
  const categoryCounts = CATEGORIES.reduce<Record<string, number>>((counts, category) => {
    counts[category.key] = studios.filter(
      (studio) => studio.categoryKey === category.key
    ).length;
    return counts;
  }, {});

  const normalizedQuery = query.trim().toLowerCase();

  const filteredStudios = studios.filter((studio) => {
    if (activeCategory !== "all" && studio.categoryKey !== activeCategory) {
      return false;
    }

    if (studio.price > effectiveMaxPrice) {
      return false;
    }

    if (studio.capacity < minCapacity) {
      return false;
    }

    if (normalizedQuery && !matchesQuery(studio, normalizedQuery)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "reviews":
        return b.reviewsCount - a.reviewsCount;
      default:
        return 0;
    }
  });

  const hasFilters =
    normalizedQuery.length > 0 ||
    activeCategory !== "all" ||
    (maxPrice !== null && maxPrice < sliderMax) ||
    minCapacity > 0 ||
    sort !== "recommended";

  const setCategory = (category: CategoryFilter) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    const queryString = params.toString();
    router.replace(queryString ? `/studios?${queryString}` : "/studios", {
      scroll: false,
    });
  };

  const clearFilters = () => {
    setQuery("");
    setMaxPrice(null);
    setMinCapacity(0);
    setSort("recommended");
    router.replace("/studios", { scroll: false });
  };

  const toggleSave = (id: Studio["id"]) => {
    setSavedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const openDetails = (studio: Studio) => {
    setSelectedStudio(studio);
  };

  return (
    <div className="bg-[#f4f5fa] dark:bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-white via-[#fdf2f7] to-[#f4f5fa] dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="pointer-events-none absolute -top-32 right-0 size-96 rounded-full bg-[#db1a6e]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-0 size-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-[#db1a6e]">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200">Explore studios</span>
          </div>

          <div className="mt-5 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#db1a6e]/20 bg-[#db1a6e]/10 px-3 py-1 text-xs font-semibold text-[#db1a6e] dark:bg-[#db1a6e]/20">
              <Sparkles className="size-3.5" />
              {isLoading ? "Loading" : studios.length} spaces across {CATEGORIES.length} categories
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl md:text-5xl dark:text-white">
              Find the right room for your next shoot
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
              Photo studios, film stages, podcast lounges, and music suites by the
              hour — transparent pricing, verified hosts, no hidden fees.
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by studio name, area, or amenity..."
                aria-label="Search studios"
                className="h-14 rounded-2xl border-slate-200 bg-white pl-12 pr-12 text-base shadow-sm focus-visible:border-[#db1a6e] focus-visible:ring-[#db1a6e]/20 dark:border-slate-700 dark:bg-slate-900 [&::-webkit-search-cancel-button]:appearance-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              activeCategory === "all"
                ? "border-[#db1a6e] bg-[#db1a6e] text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-[#db1a6e]/40 hover:text-[#db1a6e] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            <SlidersHorizontal className="size-4" />
            All spaces
            <span
              className={`rounded-full px-1.5 text-[11px] ${
                activeCategory === "all"
                  ? "bg-white/20"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {studios.length}
            </span>
          </button>

          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.key];
            const isActive = activeCategory === category.key;

            return (
              <button
                key={category.key}
                type="button"
                onClick={() => setCategory(category.key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-[#db1a6e] bg-[#db1a6e] text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#db1a6e]/40 hover:text-[#db1a6e] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                <Icon className="size-4" />
                {category.name}
                <span
                  className={`rounded-full px-1.5 text-[11px] ${
                    isActive
                      ? "bg-white/20"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {categoryCounts[category.key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter controls */}
        <div className="mt-5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Max hourly rate</span>
                <span className="text-[#db1a6e]">${effectiveMaxPrice}/hr</span>
              </div>
              <Slider
                value={[effectiveMaxPrice]}
                min={minPrice}
                max={sliderMax}
                step={5}
                onValueChange={(value) =>
                  setMaxPrice(Array.isArray(value) ? Number(value[0]) : Number(value))
                }
                aria-label="Maximum hourly rate"
                className="mt-3"
              />
            </div>

            <div>
              <label
                htmlFor="capacity-filter"
                className="text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Capacity
              </label>
              <select
                id="capacity-filter"
                value={minCapacity}
                onChange={(event) => setMinCapacity(Number(event.target.value))}
                className="mt-2 flex h-10 w-full rounded-xl border border-slate-200 bg-[#f4f5fa]/70 px-3 text-sm text-slate-800 outline-none transition-colors focus:border-[#db1a6e] dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
              >
                {CAPACITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sort-filter"
                className="text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Sort by
              </label>
              <select
                id="sort-filter"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="mt-2 flex h-10 w-full rounded-xl border border-slate-200 bg-[#f4f5fa]/70 px-3 text-sm text-slate-800 outline-none transition-colors focus:border-[#db1a6e] dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results header */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing{" "}
            <span className="font-bold text-slate-950 dark:text-white">
              {filteredStudios.length}
            </span>{" "}
            of {studios.length} studios
            {activeCategory !== "all" && (
              <>
                {" "}
                in{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {CATEGORIES.find((category) => category.key === activeCategory)?.name}
                </span>
              </>
            )}
          </p>

          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="w-fit rounded-xl text-slate-500 hover:text-[#db1a6e]"
            >
              <X className="mr-1 size-3.5" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Studio grid */}
        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl bg-slate-200/80 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : error ? (
          <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </p>
        ) : filteredStudios.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudios.map((studio) => {
              const isSaved = savedIds.has(studio.id);

              return (
                <Card
                  key={studio.id}
                  onClick={() => openDetails(studio)}
                  className="group cursor-pointer gap-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div
                    className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${studio.gradient} bg-cover bg-center p-4`}
                    style={studio.image ? { backgroundImage: `url("${studio.image}")` } : undefined}
                  >
                    <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-white/20 blur-md" />
                    <div className="absolute right-0 top-0 size-24 rounded-full bg-white/10 blur-sm" />

                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                          {studio.category}
                        </span>
                        {studio.rating >= 4.8 && (
                          <Badge className="border-0 bg-white/90 text-[10px] font-bold text-[#db1a6e] shadow-xs hover:bg-white">
                            Top rated
                          </Badge>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleSave(studio.id);
                        }}
                        aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                        aria-pressed={isSaved}
                        className={`inline-flex size-9 items-center justify-center rounded-full transition-colors ${
                          isSaved
                            ? "bg-white text-[#db1a6e] shadow-md"
                            : "bg-white/80 text-slate-800 backdrop-blur-xs hover:bg-white dark:bg-slate-900/80 dark:text-white"
                        }`}
                      >
                        <Heart
                          className={`size-4.5 ${isSaved ? "fill-[#db1a6e]" : ""}`}
                        />
                      </button>
                    </div>

                    <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-xs font-bold text-slate-950 shadow-xs">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span>{studio.rating}</span>
                      <span className="text-[11px] font-normal text-slate-500">
                        ({studio.reviewsCount})
                      </span>
                    </div>
                  </div>

                  <CardContent className="flex flex-col justify-between p-5 pt-1">
                    <div>
                      <h2 className="text-lg font-bold text-slate-950 transition-colors group-hover:text-[#db1a6e] dark:text-white">
                        {studio.title}
                      </h2>

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <MapPin className="size-3.5 shrink-0 text-slate-400" />
                        <span>{studio.location}</span>
                        <span>•</span>
                        <Users className="size-3.5 shrink-0 text-slate-400" />
                        <span>Up to {studio.capacity}</span>
                      </div>

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
                          openDetails(studio);
                        }}
                        className="rounded-xl border-slate-200 font-semibold hover:border-[#db1a6e] hover:text-[#db1a6e] dark:border-slate-700"
                      >
                        View details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#db1a6e]/10 text-[#db1a6e]">
              <SearchX className="size-7" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
              No studios match your filters
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
              Try a different search term, raise the hourly budget, or clear the
              category filter to see every space.
            </p>
            <Button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-[#db1a6e] font-semibold text-white hover:bg-[#c2135f]"
            >
              Show all studios
            </Button>
          </div>
        )}

        {/* Host CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl border border-slate-200/90 bg-white p-6 sm:flex-row sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">
              Have a space creators would love?
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              List your studio, set your hourly rate, and start taking bookings.
            </p>
          </div>
          <Link href="/add-studio" className="shrink-0">
            <Button className="h-11 rounded-xl bg-[#db1a6e] px-6 font-semibold text-white hover:bg-[#c2135f]">
              <PlusCircle className="mr-2 size-4" />
              List your studio
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </Link>
        </div>
      </section>

      <StudioDetailsDialog
        key={selectedStudio?.id ?? "closed"}
        studio={selectedStudio}
        onClose={() => setSelectedStudio(null)}
      />
    </div>
  );
}
