"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";

type SavedStudio = { _id?: string; id?: string };

export function useWishlist() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    if (isLoading || !user) {
      setSavedIds(new Set());
      return;
    }

    const controller = new AbortController();

    apiFetch<SavedStudio[]>("/wishlist", { signal: controller.signal })
      .then((studios) => {
        if (controller.signal.aborted) return;
        setSavedIds(
          new Set(
            (Array.isArray(studios) ? studios : [])
              .map((studio) => String(studio._id || studio.id || ""))
              .filter(Boolean)
          )
        );
      })
      .catch(() => {
        if (!controller.signal.aborted) setSavedIds(new Set());
      });

    return () => controller.abort();
  }, [isLoading, user]);

  const isSaved = React.useCallback(
    (id: string | number) => savedIds.has(String(id)),
    [savedIds]
  );

  const toggleSave = React.useCallback(
    async (id: string | number) => {
      const key = String(id);

      if (!user) {
        toast.info("Log in to save a studio.");
        router.push("/login?redirect=/studios");
        return;
      }

      const alreadySaved = savedIds.has(key);

      setSavedIds((current) => {
        const next = new Set(current);
        if (alreadySaved) next.delete(key);
        else next.add(key);
        return next;
      });

      try {
        if (alreadySaved) {
          await apiFetch(`/wishlist/${key}`, { method: "DELETE" });
          toast.success("Removed from saved studios.");
        } else {
          await apiFetch(`/wishlist/${key}`, { method: "POST" });
          toast.success("Studio saved.");
        }
      } catch (error) {
        setSavedIds((current) => {
          const next = new Set(current);
          if (alreadySaved) next.add(key);
          else next.delete(key);
          return next;
        });
        toast.error(
          error instanceof Error ? error.message : "Could not update your saved studios."
        );
      }
    },
    [router, savedIds, user]
  );

  return { isSaved, toggleSave };
}
