
"use client";

import * as React from "react";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";

export interface MyStudio {
  id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  capacity: number;
  overview: string;
  rating: number;
  gradient: string;
  image?: string;
}

type StudioRecord = Record<string, unknown>;

function isRecord(value: unknown): value is StudioRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getString(
  record: StudioRecord,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function getNumber(
  record: StudioRecord,
  key: string,
  fallback: number
): number {
  const value = record[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function extractStudioRecords(data: unknown): StudioRecord[] {
  if (Array.isArray(data)) {
    return data.filter(isRecord);
  }

  if (isRecord(data)) {
    for (const key of ["studios", "data", "results"]) {
      const value = data[key];

      if (Array.isArray(value)) {
        return value.filter(isRecord);
      }
    }
  }

  throw new Error(
    "The studios API returned an unexpected response."
  );
}

function toMyStudio(
  record: StudioRecord,
  index: number
): MyStudio | null {
  const title = getString(record, "title", "name");

  if (!title) return null;

  return {
    id: getString(record, "id", "_id") || `${title}-${index}`,
    title,
    category: getString(record, "category") || "Studio",
    location:
      getString(record, "location") || "Location not provided",
    price: getNumber(record, "hourlyRate", getNumber(record, "price", 0)),
    capacity: getNumber(record, "capacity", 0),
    overview:
      getString(record, "overview", "description") ||
      "No description provided.",
    rating: getNumber(record, "rating", 0),
    gradient:
      getString(record, "gradient") ||
      "from-[#d6247f] via-[#e83e8c] to-[#ff9a3c]",
    image: getString(record, "image", "imageUrl") || undefined,
  };
}

export function useMyListings() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [version, setVersion] = React.useState(0);
  const [result, setResult] = React.useState<{
    email: string;
    listings: MyStudio[];
    error: string;
  } | null>(null);

  React.useEffect(() => {
    if (isAuthLoading || !user) return;

    const currentEmail = user.email.trim().toLowerCase();
    const controller = new AbortController();

    async function loadListings() {
      try {
        // JWT token is automatically attached by apiFetch.
        // Backend identifies the logged-in user from the token.
        const data = await apiFetch<unknown>("/studios", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        const records = extractStudioRecords(data);

        const ownListings = records
          .map((record, index) => toMyStudio(record, index))
          .filter(
            (studio): studio is MyStudio => studio !== null
          );

        if (controller.signal.aborted) return;

        setResult({
          email: currentEmail,
          listings: ownListings,
          error: "",
        });
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;

        console.error(
          "Failed to load user studio listings:",
          loadError
        );

        setResult({
          email: currentEmail,
          listings: [],
          error:
            loadError instanceof Error
              ? loadError.message
              : "Could not load your studio listings.",
        });
      }
    }

    void loadListings();

    return () => controller.abort();
  }, [isAuthLoading, user, version]);

  const email = user?.email.trim().toLowerCase() ?? "";

  const currentResult =
    result?.email === email ? result : null;

  return {
    listings: currentResult?.listings ?? [],
    isLoading:
      isAuthLoading || (Boolean(user) && !currentResult),
    error: currentResult?.error ?? "",
    refresh: () => setVersion((current) => current + 1),
  };
}
