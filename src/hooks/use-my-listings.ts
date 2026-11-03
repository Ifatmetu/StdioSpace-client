
"use client";

import * as React from "react";
import { useAuth } from "@/context/auth-context";

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

  const id =
    getString(record, "id", "_id") || `${title}-${index}`;

  return {
    id,
    title,
    category: getString(record, "category") || "Studio",
    location:
      getString(record, "location") || "Location not provided",
    price: getNumber(record, "price", 0),
    capacity: getNumber(record, "capacity", 0),
    overview:
      getString(record, "overview", "description") ||
      "No description provided.",
    rating: getNumber(record, "rating", 0),
    gradient:
      getString(record, "gradient") ||
      "from-[#d6247f] via-[#e83e8c] to-[#ff9a3c]",
  };
}

export function useMyListings() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [result, setResult] = React.useState<{
    email: string;
    listings: MyStudio[];
    error: string;
  } | null>(null);

  React.useEffect(() => {
    if (isAuthLoading || !user) return;

    const currentUser = user;
    const controller = new AbortController();

    async function loadListings() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(
          /\/+$/,
          ""
        );

        if (!apiUrl) {
          throw new Error(
            "API URL is not configured. Please set NEXT_PUBLIC_API_URL."
          );
        }

        const email = currentUser.email.trim().toLowerCase();

        if (!email) {
          throw new Error("User email was not found.");
        }

        // Send logged-in user's email to the backend
        const params = new URLSearchParams({
          userEmail: email,
        });

        const response = await fetch(
          `${apiUrl}/studios?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Could not load studio listings (HTTP ${response.status}).`
          );
        }

        const data: unknown = await response.json();
        const records = extractStudioRecords(data);

        const userId =
          typeof currentUser.id === "string"
            ? currentUser.id
            : "";

        // Filter only the logged-in user's listings
        const ownListings = records
          .filter((record) => {
            const recordEmail = getString(
              record,
              "ownerEmail",
              "hostEmail",
              "userEmail",
              "email"
            ).toLowerCase();

            const recordUserId = getString(
              record,
              "userId",
              "ownerId"
            );

            const createdBy = getString(
              record,
              "createdBy"
            ).toLowerCase();

            return (
              recordEmail === email ||
              (Boolean(userId) && recordUserId === userId) ||
              createdBy === email ||
              (Boolean(userId) && createdBy === userId)
            );
          })
          .map((record, index) => toMyStudio(record, index))
          .filter(
            (studio): studio is MyStudio => studio !== null
          );

        setResult({
          email,
          listings: ownListings,
          error: "",
        });
      } catch (loadError) {
        if (controller.signal.aborted) return;

        console.error(
          "Failed to load user studio listings:",
          loadError
        );

        setResult({
          email: currentUser.email.trim().toLowerCase(),
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
  }, [isAuthLoading, user]);

  const email = user?.email.trim().toLowerCase() ?? "";

  const currentResult =
    result?.email === email ? result : null;

  return {
    listings: currentResult?.listings ?? [],
    isLoading:
      isAuthLoading || (Boolean(user) && !currentResult),
    error: currentResult?.error ?? "",
  };
}
