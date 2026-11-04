"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  X,
  MapPin,
  User,
  Mail,
  Loader2,
  Inbox,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { useAuth } from "@/context/auth-context";
import { useMyBookings } from "@/hooks/use-my-bookings";

type BookingStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled"
  | "completed";

type FilterStatus = "all" | BookingStatus;

export default function BookingRequestsPage() {
  const { user } = useAuth();

  const {
    bookingRequests,
    isLoading,
    error,
    updatingId,
    updateBookingStatus,
    refreshBookings,
  } = useMyBookings();

  const [filter, setFilter] = useState<FilterStatus>("all");

  const filteredRequests = useMemo(() => {
    if (filter === "all") return bookingRequests;

    return bookingRequests.filter(
      (booking) => booking.status === filter
    );
  }, [bookingRequests, filter]);

  const pendingCount = bookingRequests.filter(
    (booking) => booking.status === "pending"
  ).length;

  const acceptedCount = bookingRequests.filter(
    (booking) => booking.status === "accepted"
  ).length;

  const handleStatusUpdate = async (
    bookingId: string,
    status: "accepted" | "declined"
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${status} this booking request?`
    );

    if (!confirmed) return;

    await updateBookingStatus(bookingId, status);
  };

  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";

      case "declined":
      case "cancelled":
        return "bg-red-100 text-red-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />

            <h2 className="text-xl font-semibold">
              Please Login
            </h2>

            <p className="text-gray-500 mt-2 mb-5">
              Login to manage your booking requests.
            </p>

            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-7">

        {/* Header */}
        <div>
          <Link
            href="/profile"
            className="mb-4 -ml-3 inline-flex"
          >
            <Button variant="ghost" className="text-gray-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Booking Requests
              </h1>

              <p className="text-gray-500 mt-2">
                Review and manage requests for your studios.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={refreshBookings}
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm text-gray-500">
                Total Requests
              </p>
              <h2 className="text-2xl font-bold mt-2">
                {bookingRequests.length}
              </h2>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm text-gray-500">
                Pending
              </p>
              <h2 className="text-2xl font-bold text-yellow-600 mt-2">
                {pendingCount}
              </h2>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm col-span-2 sm:col-span-1">
            <CardContent className="p-5">
              <p className="text-sm text-gray-500">
                Accepted
              </p>
              <h2 className="text-2xl font-bold text-green-600 mt-2">
                {acceptedCount}
              </h2>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {(
            [
              "all",
              "pending",
              "accepted",
              "declined",
              "cancelled",
              "completed",
            ] as FilterStatus[]
          ).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
                filter === status
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 border hover:bg-gray-100"
              }`}
            >
              {status === "all" ? "All Requests" : status}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Loading and Requests */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <Inbox className="h-14 w-14 mx-auto text-gray-300 mb-4" />

              <h2 className="text-lg font-semibold text-gray-800">
                No Booking Requests Found
              </h2>

              <p className="text-gray-500 mt-2">
                {filter === "all"
                  ? "You haven't received any booking requests yet."
                  : `There are no ${filter} booking requests.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {filteredRequests.map((booking) => (
              <Card
                key={booking._id}
                className="border-0 shadow-sm overflow-hidden"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row gap-5">

                    {/* Studio Image */}
                    <div className="relative w-full md:w-48 h-48 md:h-36 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={
                          booking.studioImage || "/placeholder.jpg"
                        }
                        alt={booking.studioTitle || "Studio"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Booking Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            {booking.studioTitle}
                          </h2>

                          <p className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                            <MapPin className="h-4 w-4" />
                            {booking.studioLocation ||
                              "Location not specified"}
                          </p>
                        </div>

                        <span
                          className={`capitalize text-xs font-semibold px-3 py-1.5 rounded-full w-fit ${getStatusStyle(
                            booking.status as BookingStatus
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 mt-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4 text-purple-600" />
                          {booking.userName || "Customer"}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 break-all">
                          <Mail className="h-4 w-4 text-purple-600 shrink-0" />
                          {booking.userEmail}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays className="h-4 w-4 text-purple-600" />
                          {booking.bookingDate
                            ? new Date(
                                booking.bookingDate
                              ).toLocaleDateString()
                            : "Date not available"}
                        </div>

                        <div className="text-sm font-semibold text-gray-900">
                          Total: ৳{booking.totalPrice}
                        </div>
                      </div>

                      {/* Accept / Decline */}
                      {booking.status === "pending" && (
                        <div className="flex flex-wrap gap-3 mt-5">
                          <Button
                            onClick={() =>
                              handleStatusUpdate(
                                booking._id,
                                "accepted"
                              )
                            }
                            disabled={updatingId === booking._id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {updatingId === booking._id ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4 mr-2" />
                            )}
                            Accept
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() =>
                              handleStatusUpdate(
                                booking._id,
                                "declined"
                              )
                            }
                            disabled={updatingId === booking._id}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}