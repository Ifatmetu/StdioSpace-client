"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthGate } from "@/components/auth-gate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
import { uploadImageToImgbb } from "@/lib/upload-image";

const CATEGORIES = ["Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];
const AMENITIES = [
  "Wi-Fi",
  "Cyc wall",
  "Lighting kit",
  "Parking",
  "Soundproofing",
  "Green screen",
  "Makeup room",
  "Mixing console",
];

function EditStudioForm() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState(CATEGORIES[0]);
  const [location, setLocation] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [deposit, setDeposit] = React.useState("");
  const [capacity, setCapacity] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [overview, setOverview] = React.useState("");
  const [amenities, setAmenities] = React.useState<string[]>([]);

  React.useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
    if (!apiUrl || !params.id) return;

    fetch(`${apiUrl}/studios/${params.id}`, { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body?.message || "Studio not found.");
        const owner = String(body.ownerEmail || body.userEmail || "").toLowerCase();
        if (user?.email && owner && owner !== user.email.toLowerCase()) {
          throw new Error("You can only edit your own studios.");
        }
        setTitle(body.title || "");
        setCategory(body.category || CATEGORIES[0]);
        setLocation(body.location || "");
        setPrice(String(body.hourlyRate ?? body.price ?? ""));
        setDeposit(String(body.securityDeposit ?? body.deposit ?? ""));
        setCapacity(String(body.maxCapacity ?? body.capacity ?? ""));
        setImageUrl(body.imageUrl || body.image || "");
        setOverview(body.description || body.overview || "");
        setAmenities(Array.isArray(body.amenities) ? body.amenities : []);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Could not load this studio.");
        router.replace("/my-listings");
      })
      .finally(() => setLoading(false));
  }, [params.id, router, user?.email]);

  const onUpload = async (file: File | undefined) => {
    if (!file) return;
    try {
      const url = await uploadImageToImgbb(file);
      setImageUrl(url);
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await apiFetch(`/studios/${params.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          category,
          hourlyRate: Number(price),
          securityDeposit: Number(deposit || 0),
          maxCapacity: Number(capacity),
          location,
          imageUrl,
          amenities,
          description: overview,
        }),
      });
      toast.success("Studio updated.");
      router.push("/my-listings");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update this studio.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#db1a6e]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
        Update studio
      </h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} required className="mt-2 h-11 rounded-xl" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">Category</Label>
            <select id="category" value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900">
              {CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(event) => setLocation(event.target.value)} required className="mt-2 h-11 rounded-xl" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <Label htmlFor="price">Hourly rate ($)</Label>
            <Input id="price" type="number" min="1" value={price} onChange={(event) => setPrice(event.target.value)} required className="mt-2 h-11 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="deposit">Security deposit ($)</Label>
            <Input id="deposit" type="number" min="0" value={deposit} onChange={(event) => setDeposit(event.target.value)} className="mt-2 h-11 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="capacity">Max capacity</Label>
            <Input id="capacity" type="number" min="1" value={capacity} onChange={(event) => setCapacity(event.target.value)} required className="mt-2 h-11 rounded-xl" />
          </div>
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} required className="mt-2 h-11 rounded-xl" />
          <Input type="file" accept="image/*" className="mt-2" onChange={(event) => onUpload(event.target.files?.[0])} />
        </div>
        <div>
          <Label>Amenities</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {AMENITIES.map((item) => {
              const selected = amenities.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setAmenities((current) =>
                      selected ? current.filter((amenity) => amenity !== item) : [...current, item]
                    )
                  }
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    selected ? "bg-[#db1a6e] text-white" : "border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <Label htmlFor="overview">Detailed overview</Label>
          <Textarea id="overview" value={overview} onChange={(event) => setOverview(event.target.value)} required className="mt-2 rounded-xl" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label>Host name</Label>
            <Input value={user?.name || ""} readOnly className="mt-2 h-11 rounded-xl" />
          </div>
          <div>
            <Label>Host email</Label>
            <Input value={user?.email || ""} readOnly className="mt-2 h-11 rounded-xl" />
          </div>
        </div>
        <Button type="submit" disabled={saving} className="h-11 rounded-xl bg-[#db1a6e] px-6 font-semibold text-white hover:bg-[#c2135f]">
          {saving ? "Saving..." : "Update studio"}
        </Button>
      </form>
    </div>
  );
}

export default function EditStudioPage() {
  return (
    <AuthGate>
      <EditStudioForm />
    </AuthGate>
  );
}
