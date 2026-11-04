"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, MapPin, PlusCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthGate } from "@/components/auth-gate";
import { useMyListings, type MyStudio } from "@/hooks/use-my-listings";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";

function Listings() {
  const { listings: myListings, isLoading, error, refresh } = useMyListings();
  const [pendingDelete, setPendingDelete] = React.useState<MyStudio | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await apiFetch(`/studios/${pendingDelete.id}`, { method: "DELETE" });
      toast.success("Studio deleted.");
      setPendingDelete(null);
      refresh();
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error ? deleteError.message : "Could not delete this studio."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#db1a6e]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#db1a6e]">Host dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">My listings</h1>
        </div>

        <Link href="/add-studio">
          <Button className="rounded-xl bg-[#db1a6e] text-white hover:bg-[#c2135f]">
            <PlusCircle className="mr-2 size-4" />
            Add studio
          </Button>
        </Link>
      </div>

      {error ? (
        <Card className="border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/30">
          <CardContent className="p-6 text-center text-sm text-rose-700 dark:text-rose-300" role="alert">
            {error}
          </CardContent>
        </Card>
      ) : myListings.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {myListings.map((studio) => (
            <Card key={studio.id} className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className={`h-36 bg-gradient-to-r ${studio.gradient}`} />
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{studio.title}</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{studio.category}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                    <Star className="size-3.5 fill-current" />
                    {studio.rating}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <MapPin className="size-4 text-[#db1a6e]" />
                  {studio.location}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300">{studio.overview}</p>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#db1a6e]">${studio.price}/hr</span>
                  <span className="text-slate-500 dark:text-slate-400">{studio.capacity} guests</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/studios/edit/${studio.id}`} className="flex-1">
                    <Button variant="outline" className="w-full rounded-xl">Update</Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl text-rose-600"
                    onClick={() => setPendingDelete(studio)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-8 text-center">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">You have no studio listings yet.</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Add your first studio to start booking creators.
            </p>
            <Link href="/add-studio" className="mt-4 inline-block">
              <Button className="rounded-xl bg-[#db1a6e] text-white hover:bg-[#c2135f]">Create a listing</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Dialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this studio?</DialogTitle>
            <DialogDescription>
              {pendingDelete?.title} will be removed from StudioSpace. Pending bookings on it will be cancelled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>Keep studio</Button>
            <Button
              className="bg-rose-600 text-white hover:bg-rose-700"
              disabled={deleting}
              onClick={confirmDelete}
            >
              {deleting ? "Deleting..." : "Delete studio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <AuthGate>
      <Listings />
    </AuthGate>
  );
}
