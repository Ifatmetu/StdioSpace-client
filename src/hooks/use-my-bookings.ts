
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";

export type BookingStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled"
  | "completed";

export interface Booking {
  _id: string;

  userId?: string;
  userEmail: string;
  userName: string;

  hostId?: string;
  hostEmail: string;

  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;

  bookingDate: string;
  startTime?: string;
  endTime?: string;
  totalPrice: number;

  status: BookingStatus;

  createdAt: string;
  updatedAt?: string;
}

// Convert Backend status to Frontend status
function normalizeBookingStatus(status: string): BookingStatus {
  switch (String(status || "").toLowerCase()) {
    case "pending":
      return "pending";

    case "confirmed":
    case "accepted":
      return "accepted";

    case "declined":
      return "declined";

    case "cancelled":
    case "canceled":
      return "cancelled";

    case "completed":
      return "completed";

    default:
      return "pending";
  }
}

// Normalize complete booking object
function normalizeBookings(data: Booking[]): Booking[] {
  if (!Array.isArray(data)) return [];

  return data.map((booking) => ({
    ...booking,
    status: normalizeBookingStatus(booking.status),
  }));
}

export function useMyBookings() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingRequests, setBookingRequests] = useState<Booking[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  // Fetch customer bookings and host booking requests
  const fetchBookings = useCallback(
    async (signal?: AbortSignal) => {
      if (!user?.email) {
        setBookings([]);
        setBookingRequests([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [myData, hostData] = await Promise.all([
          apiFetch<Booking[]>("/bookings", {
            method: "GET",
            cache: "no-store",
            signal,
          }),

          apiFetch<Booking[]>("/bookings?role=host", {
            method: "GET",
            cache: "no-store",
            signal,
          }),
        ]);

        if (signal?.aborted) return;

        setBookings(normalizeBookings(myData));
        setBookingRequests(normalizeBookings(hostData));
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Could not load bookings"
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [user?.email]
  );

  // Initial fetch and event listener
  useEffect(() => {
    const controller = new AbortController();

    fetchBookings(controller.signal);

    const handleUpdate = () => {
      fetchBookings();
    };

    window.addEventListener("bookings-updated", handleUpdate);

    return () => {
      controller.abort();

      window.removeEventListener(
        "bookings-updated",
        handleUpdate
      );
    };
  }, [fetchBookings]);

  // Accept or decline booking request
  const updateBookingStatus = async (
    bookingId: string,
    status: "accepted" | "declined"
  ) => {
    if (!user?.email) {
      throw new Error("Please login first");
    }

    try {
      setUpdatingId(bookingId);

      await apiFetch(`/bookings/${bookingId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      await fetchBookings();

      window.dispatchEvent(new Event("bookings-updated"));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update booking status"
      );

      throw err;
    } finally {
      setUpdatingId("");
    }
  };

  // Customer cancels own pending booking
  const cancelBooking = async (bookingId: string) => {
    if (!user?.email) {
      throw new Error("Please login first");
    }

    try {
      setUpdatingId(bookingId);

      await apiFetch(`/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });

      await fetchBookings();

      window.dispatchEvent(new Event("bookings-updated"));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not cancel booking"
      );

      throw err;
    } finally {
      setUpdatingId("");
    }
  };

  return {
    bookings,
    bookingRequests,
    isLoading,
    error,
    updatingId,

    refreshBookings: () => fetchBookings(),

    updateBookingStatus,
    cancelBooking,
  };
}
