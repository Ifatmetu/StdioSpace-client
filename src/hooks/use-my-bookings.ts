"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

export interface Booking {
  _id: string;
  userId?: string | null;
  userEmail: string;
  userName: string;
  hostEmail: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  bookingDate: string;
  totalPrice: number;
  status: "pending" | "accepted" | "declined" | "cancelled";
  createdAt: string;
  updatedAt?: string;
}

export function useMyBookings() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingRequests, setBookingRequests] = useState<Booking[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Fetch customer bookings and owner requests
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

        const email = user.email.trim().toLowerCase();

        const [myBookingsResponse, requestsResponse] =
          await Promise.all([
            fetch(
              `${apiUrl}/bookings?userEmail=${encodeURIComponent(email)}`,
              {
                method: "GET",
                cache: "no-store",
                signal,
              }
            ),

            fetch(
              `${apiUrl}/bookings?userEmail=${encodeURIComponent(email)}&role=host`,
              {
                method: "GET",
                cache: "no-store",
                signal,
              }
            ),
          ]);

        const myBookingsData = await myBookingsResponse.json();
        const requestsData = await requestsResponse.json();

        if (!myBookingsResponse.ok) {
          throw new Error(
            myBookingsData.message || "Could not load your bookings"
          );
        }

        if (!requestsResponse.ok) {
          throw new Error(
            requestsData.message || "Could not load booking requests"
          );
        }

        setBookings(
          Array.isArray(myBookingsData) ? myBookingsData : []
        );

        setBookingRequests(
          Array.isArray(requestsData) ? requestsData : []
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [user?.email, apiUrl]
  );

  // Load bookings when the user changes
  useEffect(() => {
    const controller = new AbortController();

    fetchBookings(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchBookings]);

  // Accept or decline a booking
  const updateBookingStatus = async (
    bookingId: string,
    status: "accepted" | "declined"
  ) => {
    if (!user?.email) {
      throw new Error("Please login first");
    }

    try {
      setUpdatingId(bookingId);

      const response = await fetch(
        `${apiUrl}/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hostEmail: user.email.trim().toLowerCase(),
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not update booking status"
        );
      }

      // Refresh both lists after updating
      await fetchBookings();

      return data;
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
  };
}