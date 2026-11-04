"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, MapPin, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudioDetailsDialog } from "@/components/studios/studio-details-dialog";
import { CATEGORIES, type Studio } from "@/data/studio-catalog";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";

type Review = {
  _id: string;
  userName?: string;
  rating: number;
  comment: string;
};

function toStudio(record: Record<string, unknown>, id: string): Studio {
  const categoryName = String(record.category || "Studio");
  const category = CATEGORIES.find(
    (item) => item.name.toLowerCase() === categoryName.toLowerCase()
  );

  return {
    id,
    title: String(record.title || "Studio"),
    category: categoryName,
    categoryKey: category?.key || "photo",
    price: Number(record.hourlyRate ?? record.price) || 0,
    deposit: Number(record.securityDeposit ?? record.deposit) || 0,
    capacity: Number(record.maxCapacity ?? record.capacity) || 0,
    location: String(record.location || "Location not provided"),
    rating: Number(record.rating) || 0,
    reviewsCount: Number(record.reviewCount ?? record.reviewsCount) || 0,
    amenities: Array.isArray(record.amenities)
      ? record.amenities.filter((item): item is string => typeof item === "string")
      : [],
    owner: String(record.ownerName || record.owner || "Studio host"),
    ownerEmail: String(record.ownerEmail || record.userEmail || ""),
    overview: String(record.description || record.overview || "No description provided."),
    gradient: category?.gradient || "from-[#d6247f] to-[#ff9a3c]",
    image: String(record.imageUrl || record.image || ""),
  };
}

export function StudioDetail({ id }: { id: string }) {
  const { user } = useAuth();
  const [studio, setStudio] = React.useState<Studio | null>(null);
  const [gallery, setGallery] = React.useState<string[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [bookingOpen, setBookingOpen] = React.useState(false);
  const [rating, setRating] = React.useState("5");
  const [comment, setComment] = React.useState("");
  const [reviewing, setReviewing] = React.useState(false);

  const load = React.useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
    if (!apiUrl) throw new Error("API URL is not configured.");

    const [studioResponse, reviewResponse] = await Promise.all([
      fetch(`${apiUrl}/studios/${id}`, { cache: "no-store" }),
      fetch(`${apiUrl}/studios/${id}/reviews`, { cache: "no-store" }),
    ]);

    const studioBody = await studioResponse.json().catch(() => null);
    if (!studioResponse.ok) {
      throw new Error(studioBody?.message || "Studio not found.");
    }

    const nextStudio = toStudio(studioBody, id);
    const extraGallery = Array.isArray(studioBody.gallery)
      ? studioBody.gallery.filter((item: unknown): item is string => typeof item === "string")
      : [];

    setStudio(nextStudio);
    setGallery(
      [nextStudio.image, ...extraGallery].filter((item): item is string => Boolean(item))
    );

    if (reviewResponse.ok) {
      const reviewBody = await reviewResponse.json();
      setReviews(Array.isArray(reviewBody) ? reviewBody : []);
    }
  }, [id]);

  React.useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    load()
      .catch((loadError) => {
        if (!controller.signal.aborted) {
          setError(loadError instanceof Error ? loadError.message : "Could not load this studio.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [load]);

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      toast.info("Log in to leave a review.");
      return;
    }

    setReviewing(true);
    try {
      await apiFetch(`/studios/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating: Number(rating), comment }),
      });
      toast.success("Review saved.");
      setComment("");
      await load();
    } catch (reviewError) {
      toast.error(
        reviewError instanceof Error ? reviewError.message : "Could not save the review."
      );
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Studio unavailable</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{error}</p>
        <Link href="/studios" className="mt-6 inline-block text-sm font-semibold text-[#db1a6e]">
          Back to studios
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(gallery.length ? gallery : [""]).slice(0, 4).map((image, index) => (
              <div
                key={`${image}-${index}`}
                className={`h-56 overflow-hidden rounded-2xl bg-gradient-to-br ${studio.gradient} ${
                  index === 0 ? "sm:col-span-2 sm:h-80" : ""
                }`}
                style={image ? { backgroundImage: `url("${image}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
              />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#db1a6e]/10 px-3 py-1 text-xs font-semibold text-[#db1a6e]">
              {studio.category}
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
              <MapPin className="size-4 text-[#db1a6e]" />
              {studio.location}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {studio.rating || "New"}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {studio.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {studio.overview}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {studio.amenities.map((amenity) => (
              <span
                key={amenity}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium dark:border-slate-700"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-3xl font-extrabold text-slate-950 dark:text-white">
            ${studio.price}
            <span className="text-sm font-medium text-slate-500"> / hr</span>
          </p>
          <p className="mt-2 text-sm text-slate-500">Security deposit ${studio.deposit}</p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Users className="size-4" /> Up to {studio.capacity} people
          </p>
          <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Host</p>
            <p className="mt-1 font-semibold text-slate-950 dark:text-white">{studio.owner}</p>
            <p className="text-sm text-slate-500">{studio.ownerEmail}</p>
          </div>
          <Button
            className="mt-5 h-11 w-full rounded-xl bg-[#db1a6e] font-semibold text-white hover:bg-[#c2135f]"
            onClick={() => setBookingOpen(true)}
          >
            Book Workspace Now
          </Button>
        </aside>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No reviews yet. Be the first guest to write one.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {reviews.map((review) => (
              <article
                key={review._id}
                className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <p className="font-semibold text-slate-950 dark:text-white">
                  {review.userName || "Guest"} · {review.rating}/5
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{review.comment}</p>
              </article>
            ))}
          </div>
        )}

        <form onSubmit={submitReview} className="mt-6 max-w-xl space-y-3">
          <label className="block text-sm font-semibold" htmlFor="rating">
            Your rating
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            required
            rows={4}
            placeholder="How was the room, the light, and the host?"
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
          <Button type="submit" disabled={reviewing} className="rounded-xl bg-[#db1a6e] text-white">
            {reviewing ? <Loader2 className="size-4 animate-spin" /> : "Post review"}
          </Button>
        </form>
      </section>

      <StudioDetailsDialog
        studio={bookingOpen ? studio : null}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
