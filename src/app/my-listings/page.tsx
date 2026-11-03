"use client";

import Link from "next/link";
import { Loader2, MapPin, PlusCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useMyListings } from "@/hooks/use-my-listings";

export default function MyListingsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { listings: myListings, isLoading, error } = useMyListings();

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#db1a6e]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-slate-900 dark:text-white">
              Sign in to view your listings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Log in or register to see the spaces you own.
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/login">
                <Button className="rounded-xl bg-[#db1a6e] text-white hover:bg-[#c2135f]">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-800">
                  Register
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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
    </div>
  );
}
