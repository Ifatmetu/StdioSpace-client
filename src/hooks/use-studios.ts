
"use client";

import * as React from "react";
import { CATEGORIES, type Studio } from "@/data/studio-catalog";

type StudioRecord = Record<string, unknown>;

function isRecord(value: unknown): value is StudioRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getString(record: StudioRecord, ...keys: string[]): string {
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
  keys: string[],
  fallback: number
): number {
  for (const key of keys) {
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
  }

  return fallback;
}

function getStringArray(record: StudioRecord, key: string): string[] {
  const value = record[key];

  return Array.isArray(value)
    ? value.filter(
        (item): item is string => typeof item === "string"
      )
    : [];
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

  throw new Error("The studios API returned an unexpected response.");
}

function getCategoryKey(record: StudioRecord): Studio["categoryKey"] {
  const values = [
    getString(record, "categoryKey"),
    getString(record, "category"),
  ]
    .map((value) => value.toLowerCase())
    .filter(Boolean);

  const category = CATEGORIES.find((item) =>
    values.some(
      (value) =>
        item.key === value ||
        item.name.toLowerCase() === value
    )
  );

  return category?.key ?? "photo";
}

function toStudio(
  record: StudioRecord,
  index: number
): Studio | null {
  const title = getString(record, "title", "name");

  if (!title) return null;

  const categoryKey = getCategoryKey(record);

  const categoryName = CATEGORIES.find(
    (item) => item.key === categoryKey
  )?.name;

  const rawCategory = getString(record, "category");

  const category =
    CATEGORIES.find(
      (item) =>
        item.key === rawCategory.toLowerCase() ||
        item.name.toLowerCase() === rawCategory.toLowerCase()
    )?.name ||
    rawCategory ||
    categoryName ||
    "Studio";

  return {
  id: getString(record, "id", "_id") || `studio-${index}`,
  title,
  category,
  categoryKey,

  price: getNumber(record, ["price", "hourlyRate"], 0),

  deposit: getNumber(
    record,
    ["deposit", "securityDeposit"],
    0
  ),

  capacity: getNumber(
    record,
    ["capacity", "maxCapacity"],
    0
  ),

  location: getString(record, "location") || "Location not provided",

  rating: getNumber(record, ["rating"], 0),

  reviewsCount: getNumber(
    record,
    ["reviewsCount", "reviewCount"],
    0
  ),

  amenities: getStringArray(record, "amenities"),

  owner:
    getString(
      record,
      "owner",
      "ownerName",
      "hostName",
      "userName"
    ) || "Studio host",

  ownerEmail: getString(
    record,
    "ownerEmail",
    "hostEmail",
    "userEmail",
    "email"
  ),

  overview:
    getString(record, "overview", "description") ||
    "No description provided.",

  gradient:
    CATEGORIES.find((item) => item.key === categoryKey)?.gradient ??
    "from-[#d6247f] via-[#e83e8c] to-[#ff9a3c]",

  image: getString(record, "image", "imageUrl") || undefined,
};
}

export function useStudios() {
  const [studios, setStudios] = React.useState<Studio[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const controller = new AbortController();

    async function loadStudios() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(
          /\/+$/,
          ""
        );

        if (!apiUrl) {
          throw new Error(
            "The API URL is not configured. Set NEXT_PUBLIC_API_URL to load studios."
          );
        }

        // Public API: fetch all studios for Home Page
        const response = await fetch(`${apiUrl}/studios/public`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);

          throw new Error(
            errorData?.message ||
              `Could not load studios (HTTP ${response.status}).`
          );
        }

        const data: unknown = await response.json();
        const records = extractStudioRecords(data);

        const formattedStudios = records
          .map((record, index) => toStudio(record, index))
          .filter(
            (studio): studio is Studio => studio !== null
          );

        setStudios(formattedStudios);
        setError("");
      } catch (loadError: unknown) {
        if (controller.signal.aborted) return;

        console.error("Failed to load studios:", loadError);

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load studios."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadStudios();

    return () => controller.abort();
  }, []);

  return {
    studios,
    isLoading,
    error,
  };
}
