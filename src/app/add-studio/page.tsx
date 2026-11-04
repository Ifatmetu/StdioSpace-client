
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
import { uploadImageToImgbb } from "@/lib/upload-image";

const CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const AVAILABLE_AMENITIES = [
  "Wi-Fi",
  "Cyc wall",
  "Lighting kit",
  "Parking",
  "Soundproofing",
  "Green screen",
  "Makeup room",
  "Mixing console",
];

const INITIAL_AMENITIES = [
  "Wi-Fi",
  "Cyc wall",
  "Lighting kit",
  "Parking",
];

interface NewStudio {
  title: string;
  category: string;
  location: string;
  price: number;
  deposit: number;
  capacity: number;
  image: string;
  amenities: string[];
  overview: string;
  rating: number;
  reviewsCount: number;
}

export default function AddStudioPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/add-studio");
    }
  }, [user, isLoading, router]);

  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("Photo Studio");
  const [location, setLocation] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [deposit, setDeposit] = React.useState("");
  const [capacity, setCapacity] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [amenities, setAmenities] =
    React.useState<string[]>(INITIAL_AMENITIES);
  const [overview, setOverview] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // Reset form for adding another studio
  const resetForm = () => {
    setTitle("");
    setCategory("Photo Studio");
    setLocation("");
    setPrice("");
    setDeposit("");
    setCapacity("");
    setImageUrl("");
    setAmenities(INITIAL_AMENITIES);
    setOverview("");

    setSuccess(false);
    setErrorMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item)
        ? prev.filter((a) => a !== item)
        : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !price || !location.trim() || !overview.trim() || !imageUrl.trim()) {
      const message = "Title, location, hourly rate, image, and overview are required.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    if (Number(price) <= 0 || !Number.isFinite(Number(price))) {
      setErrorMessage("Please enter a valid hourly rate.");
      return;
    }

    if (deposit && Number(deposit) < 0) {
      setErrorMessage("Deposit cannot be negative.");
      return;
    }

    if (capacity && Number(capacity) <= 0) {
      setErrorMessage("Capacity must be greater than zero.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const newStudio: NewStudio = {
      title: title.trim(),
      category,
      location: location.trim() || "Dhaka, Bangladesh",
      price: Number(price),
      deposit: deposit ? Number(deposit) : 0,
      capacity: capacity ? Number(capacity) : 10,
      image:
        imageUrl.trim() ||
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04",
      amenities,
      overview: overview.trim(),
      rating: 0,
      reviewsCount: 0,
    };

    try {
      // JWT token is automatically attached by apiFetch.
      // Backend gets user ID and email from the verified token.
      await apiFetch("/studios", {
        method: "POST",
        body: JSON.stringify(newStudio),
      });

      toast.success("Studio published.");
      router.push("/my-listings");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to publish studio. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#db1a6e]" />
      </div>
    );
  }

  return (
    <div className="bg-[#f4f5fa] px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm sm:p-12 dark:border-slate-800 dark:bg-slate-900">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#14142b] dark:text-white">
            Add a new studio
          </h1>

          <p className="mt-1 text-sm text-[#5d5f7a] dark:text-slate-400">
            Tell creators what they are booking.
          </p>
        </div>

        {success ? (
          /* Success Confirmation */
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900/50 dark:bg-emerald-950/30">

            <CheckCircle2 className="mx-auto size-12 text-emerald-600 dark:text-emerald-400" />

            <h3 className="mt-3 text-xl font-bold text-emerald-900 dark:text-emerald-100">
              Studio Published Successfully!
            </h3>

            <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
              Your studio has been successfully saved. Creators can now discover your space.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

              <Button
                onClick={resetForm}
                className="rounded-xl bg-[#db1a6e] px-6 text-white hover:bg-[#c2135f]"
              >
                <Plus className="mr-2 size-4" />
                Add Another Studio
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/studios")}
                className="rounded-xl"
              >
                Explore Studios
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/profile")}
                className="rounded-xl"
              >
                My Profile
              </Button>

            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <Label
                htmlFor="title"
                className="text-sm font-semibold text-[#14142b] dark:text-slate-200"
              >
                Title
              </Label>

              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-2 h-11 rounded-xl border-slate-200 bg-[#f4f5fa]/70 text-sm focus:border-[#db1a6e] dark:border-slate-800 dark:bg-slate-800/80"
              />
            </div>

            {/* Category & Location */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="category"
                  className="text-sm font-semibold text-[#14142b] dark:text-slate-200"
                >
                  Category
                </Label>

                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 flex h-11 w-full rounded-xl border border-slate-200 bg-[#f4f5fa]/70 px-3 text-sm text-[#14142b] outline-none transition-colors focus:border-[#db1a6e] dark:border-slate-800 dark:bg-slate-800/80 dark:text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option
                      key={c}
                      value={c}
                      className="dark:bg-slate-900"
                    >
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label
                  htmlFor="location"
                  className="text-sm font-semibold text-[#14142b] dark:text-slate-200"
                >
                  Location
                </Label>

                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Gulshan 2, Dhaka"
                  className="mt-2 h-11 rounded-xl border-slate-200 bg-[#f4f5fa]/70 text-sm dark:border-slate-800 dark:bg-slate-800/80"
                />
              </div>
            </div>

            {/* Hourly Rate & Security Deposit */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="price"
                  className="text-sm font-semibold text-[#14142b] dark:text-slate-200"
                >
                  Hourly rate ($)
                </Label>

                <Input
                  id="price"
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="mt-2 h-11 rounded-xl border-slate-200 bg-[#f4f5fa]/70 text-sm dark:border-slate-800 dark:bg-slate-800/80"
                />
              </div>

              <div>
                <Label
                  htmlFor="deposit"
                  className="text-sm font-semibold text-[#14142b] dark:text-slate-200"
                >
                  Security deposit ($)
                </Label>

                <Input
                  id="deposit"
                  type="number"
                  min="0"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  className="mt-2 h-11 rounded-xl border-slate-200 bg-[#f4f5fa]/70 text-sm dark:border-slate-800 dark:bg-slate-800/80"
                />
              </div>
            </div>

            {/* Capacity & Image */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="capacity"
                  className="text-sm font-semibold text-[#14142b] dark:text-slate-200"
                >
                  Max capacity
                </Label>

                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="mt-2 h-11 rounded-xl border-slate-200 bg-[#f4f5fa]/70 text-sm dark:border-slate-800 dark:bg-slate-800/80"
                />
              </div>

              <div>
                <Label
                  htmlFor="imageUrl"
                  className="text-sm font-semibold text-[#14142b] dark:text-slate-200"
                >
                  Image URL
                </Label>

                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="mt-2 h-11 rounded-xl border-slate-200 bg-[#f4f5fa]/70 text-sm dark:border-slate-800 dark:bg-slate-800/80"
                />
                <Input
                  type="file"
                  accept="image/*"
                  className="mt-2"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadImageToImgbb(file);
                      setImageUrl(url);
                      toast.success("Image uploaded.");
                    } catch (uploadError) {
                      toast.error(
                        uploadError instanceof Error
                          ? uploadError.message
                          : "Image upload failed."
                      );
                    }
                  }}
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <Label className="text-sm font-semibold text-[#14142b] dark:text-slate-200">
                Amenities
              </Label>

              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {AVAILABLE_AMENITIES.map((item) => {
                  const isSelected = amenities.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAmenity(item)}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                        isSelected
                          ? "border border-[#db1a6e] bg-[#db1a6e]/10 font-semibold text-[#db1a6e]"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Overview */}
            <div>
              <Label
                htmlFor="overview"
                className="text-sm font-semibold text-[#14142b] dark:text-slate-200"
              >
                Overview
              </Label>

              <Textarea
                id="overview"
                rows={4}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="Describe your studio space, equipment, acoustics, and rules..."
                className="mt-2 rounded-xl border-slate-200 bg-[#f4f5fa]/70 text-sm dark:border-slate-800 dark:bg-slate-800/80"
              />
            </div>

            {/* Host Information */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="hostName"
                  className="text-sm font-semibold text-[#14142b] dark:text-slate-200"
                >
                  Host name
                </Label>

                <Input
                  id="hostName"
                  value={user.name || ""}
                  readOnly
                  className="mt-2 h-11 cursor-not-allowed rounded-xl border-slate-200 bg-slate-100/90 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
                />
              </div>

              <div>
                <Label
                  htmlFor="hostEmail"
                  className="text-sm font-semibold text-[#14142b] dark:text-slate-200"
                >
                  Host email
                </Label>

                <Input
                  id="hostEmail"
                  value={user.email || ""}
                  readOnly
                  className="mt-2 h-11 cursor-not-allowed rounded-xl border-slate-200 bg-slate-100/90 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
                />
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <p className="rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-500">
                {errorMessage}
              </p>
            )}

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="h-11 rounded-xl bg-[#db1a6e] px-7 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#c2135f] active:scale-98"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Adding studio...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4" />
                    Add studio
                  </>
                )}
              </Button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
