
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Star,
  Users,
  Clock,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import { toast } from "@/lib/toast";
import type { Studio } from "@/data/studio-catalog";

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
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");

  const [isBooking, setIsBooking] = useState(false);
  const [bookingRequested, setBookingRequested] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Set today's date after component mounts
  useEffect(() => {
    const currentDate = getToday();

    setToday(currentDate);
    setDate(currentDate);
  }, []);

  // Reset booking form whenever selected studio changes
  useEffect(() => {
    setBookingRequested(false);
    setBookingError("");
    setDate(today);
    setStartTime("10:00");
    setEndTime("11:00");
  }, [studio?.id, today]);

  if (!studio) return null;

  // Calculate selected booking duration
  const calculateHours = () => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    return (end - start) / 60;
  };

  const selectedHours = calculateHours();
  const estimatedPrice = selectedHours * studio.price;

  // Submit booking request
  const requestBooking = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!date) {
      toast.error("Please select a booking date.");
      return;
    }

    if (!startTime || !endTime) {
      toast.error("Please select both start and end times.");
      return;
    }

    if (selectedHours <= 0) {
      toast.error("End time must be later than start time.");
      return;
    }

    if (date < today) {
      toast.error("You cannot select a past date.");
      return;
    }

    try {
      setIsBooking(true);
      setBookingError("");

      // Backend calculates hourly rate, deposit and total price.
      await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          studioId: String(studio.id),
          bookingDate: date,
          startTime,
          endTime,
        }),
      });

      setBookingRequested(true);
      toast.success("Booking request sent. Status is pending.");

      // Notify booking-related components to refresh their data
      window.dispatchEvent(new Event("bookings-updated"));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setBookingError(message);
      toast.error(message);
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
                <Star
                  size={16}
                  className="fill-yellow-400 text-yellow-400"
                />
                {studio.rating > 0 ? studio.rating.toFixed(1) : "New"}
                {studio.reviewsCount
                  ? ` (${studio.reviewsCount} reviews)`
                  : ""}
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
                    key={`${amenity}-${index}`}
                    className="rounded-lg bg-gray-100 px-3 py-2 text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Host Information */}
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-gray-500" />
              <h3 className="font-semibold">Hosted by</h3>
            </div>

            <p className="mt-1 text-sm text-gray-600">
              {studio.owner || "Studio Host"}
            </p>
          </div>

          {/* Price Information */}
          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">Price per hour</p>

            <p className="text-2xl font-bold">
              ${Number(studio.price || 0).toLocaleString("en-US")}
              <span className="text-sm font-medium text-gray-500"> / hr</span>
            </p>

            {studio.deposit > 0 && (
              <p className="mt-2 text-sm text-gray-500">
                Security deposit: $
                {studio.deposit.toLocaleString("en-US")}
              </p>
            )}
          </div>

          {/* Booking Form */}
          <div className="space-y-4 rounded-xl border p-4">
            <h3 className="text-lg font-bold">
              Book this workspace
            </h3>

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

            {/* Start and End Time */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="start-time"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold"
                >
                  <Clock size={16} />
                  Start Time
                </label>

                <input
                  id="start-time"
                  type="time"
                  value={startTime}
                  disabled={bookingRequested || isBooking}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="end-time"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold"
                >
                  <Clock size={16} />
                  End Time
                </label>

                <input
                  id="end-time"
                  type="time"
                  value={endTime}
                  disabled={bookingRequested || isBooking}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Estimated Price */}
            {selectedHours > 0 && (
              <div className="rounded-lg bg-purple-50 p-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Duration</span>
                  <span>{selectedHours} hour(s)</span>
                </div>

                <div className="mt-2 flex justify-between font-semibold text-purple-700">
                  <span>Estimated rental price</span>
                  <span>
                    ৳{estimatedPrice.toLocaleString("en-BD")}
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Final total and security deposit will be calculated
                  by the server.
                </p>
              </div>
            )}

            {/* Error Message */}
            {bookingError && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
              >
                {bookingError}
              </p>
            )}

            {/* Success Message */}
            {bookingRequested && (
              <div className="flex items-start gap-2 rounded-lg bg-yellow-50 p-3 text-yellow-800">
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <p className="text-sm font-semibold">
                    Booking request sent successfully!
                  </p>

                  <p className="mt-1 text-sm">
                    Your request is pending. The studio owner must
                    confirm it before your booking is approved.
                  </p>
                </div>
              </div>
            )}

            {/* Booking Button */}
            <Button
              onClick={requestBooking}
              disabled={
                isBooking ||
                bookingRequested ||
                !today ||
                selectedHours <= 0
              }
              className="w-full bg-purple-600 py-6 text-white hover:bg-purple-700"
            >
              {isBooking
                ? "Sending Request..."
                : bookingRequested
                  ? "Request Sent - Awaiting Approval"
                  : "Book Workspace Now"}

              {!isBooking && !bookingRequested && (
                <ArrowRight className="ml-2" size={18} />
              )}
            </Button>

            <p className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <ShieldCheck size={14} />
              Secure booking request
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
