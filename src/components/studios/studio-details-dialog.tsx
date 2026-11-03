
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Star,
  Users,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";
import type { Studio } from "@/types/studio";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StudioDetailsDialogProps {
  studio: Studio | null;
  onClose: () => void;
}

function getToday() {
  const date = new Date();
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().split("T")[0];
}

export function StudioDetailsDialog({
  studio,
  onClose,
}: StudioDetailsDialogProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [today, setToday] = useState("");
  const [date, setDate] = useState("");

  const [isBooking, setIsBooking] = useState(false);
  const [bookingRequested, setBookingRequested] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const currentDate = getToday();

    setToday(currentDate);
    setDate(currentDate);
  }, []);

  useEffect(() => {
    setBookingRequested(false);
    setBookingError("");
    setDate(today);
  }, [studio?.id, today]);

  if (!studio) return null;

  const requestBooking = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!date) {
      setBookingError("Please select a booking date.");
      return;
    }

    if (!user.email) {
      setBookingError("Your account email could not be found.");
      return;
    }

    try {
      setIsBooking(true);
      setBookingError("");

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          userName: user.name || "",

          studioId: studio.id,
          studioTitle: studio.title,
          studioImage: studio.image || "",
          studioLocation: studio.location,

          bookingDate: date,

          // Current UI does not collect duration.
          // This value represents one hour's price.
          totalPrice: Number(studio.price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking request failed.");
      }

      setBookingRequested(true);
    } catch (error) {
      setBookingError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Dialog
      open={!!studio}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {studio.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Studio Image */}
          <div className="overflow-hidden rounded-xl">
            <img
              src={studio.image || "/placeholder.jpg"}
              alt={studio.title}
              className="h-64 w-full object-cover"
            />
          </div>

          {/* Studio Information */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                {studio.category}
              </span>

              <span className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin size={16} />
                {studio.location}
              </span>
            </div>

            <div className="flex flex-wrap gap-5 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users size={16} />
                Capacity: {studio.capacity}
              </span>

              <span className="flex items-center gap-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                {studio.rating || "New"}
                {studio.reviews ? ` (${studio.reviews} reviews)` : ""}
              </span>
            </div>

            <p className="text-gray-600">{studio.overview}</p>
          </div>

          {/* Amenities */}
          {studio.amenities?.length > 0 && (
            <div>
              <h3 className="mb-3 font-semibold">Amenities</h3>

              <div className="flex flex-wrap gap-2">
                {studio.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Host */}
          <div className="rounded-xl bg-gray-50 p-4">
            <h3 className="font-semibold">Hosted by</h3>
            <p className="mt-1 text-sm text-gray-600">
              {studio.hostName || studio.host || "Studio Host"}
            </p>
          </div>

          {/* Price */}
          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">Price per hour</p>
            <p className="text-2xl font-bold">
              ৳{Number(studio.price || 0).toLocaleString("en-BD")}
            </p>
          </div>

          {/* Booking Date */}
          <div>
            <label
              htmlFor="booking-date"
              className="mb-2 block text-sm font-semibold"
            >
              Select Booking Date
            </label>

            <input
              id="booking-date"
              type="date"
              min={today || undefined}
              value={date}
              disabled={bookingRequested || isBooking}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          {/* Error */}
          {bookingError && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {bookingError}
            </p>
          )}

          {/* Success */}
          {bookingRequested && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
              <CheckCircle2 size={20} />
              <p className="text-sm font-medium">
                Booking request sent successfully!
              </p>
            </div>
          )}

          {/* Booking Button */}
          <Button
            onClick={requestBooking}
            disabled={isBooking || bookingRequested || !today}
            className="w-full bg-purple-600 py-6 text-white hover:bg-purple-700"
          >
            {isBooking
              ? "Sending Request..."
              : bookingRequested
                ? "Booking Requested"
                : "Book Workspace Now"}

            {!isBooking && !bookingRequested && (
              <ArrowRight className="ml-2" size={18} />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
