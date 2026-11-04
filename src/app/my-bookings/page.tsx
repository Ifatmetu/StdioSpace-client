"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AuthGate } from "@/components/auth-gate";
import { Button } from "@/components/ui/button";
import { useMyBookings, type Booking } from "@/hooks/use-my-bookings";
import { downloadBookingInvoice } from "@/lib/invoice";
import { toast } from "@/lib/toast";

const LABEL: Record<Booking["status"], string> = {
  pending: "Pending",
  accepted: "Confirmed",
  declined: "Cancelled",
  cancelled: "Cancelled",
  completed: "Completed",
};

function Bookings() {
  const { bookings, isLoading, error, updatingId, cancelBooking } = useMyBookings();

  const cancel = async (id: string) => {
    try {
      await cancelBooking(id);
      toast.success("Booking cancelled.");
    } catch (cancelError) {
      toast.error(
        cancelError instanceof Error ? cancelError.message : "Could not cancel this booking."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#db1a6e]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
        My bookings
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Pending requests can be cancelled until the host confirms them.
      </p>
      {error && (
        <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </p>
      )}
      {bookings.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <p className="text-lg font-semibold text-slate-950 dark:text-white">No bookings yet</p>
          <p className="mt-2 text-sm text-slate-500">Find a room and reserve the hours you need.</p>
          <Link href="/studios" className="mt-5 inline-block">
            <Button className="rounded-xl bg-[#db1a6e] text-white hover:bg-[#c2135f]">
              Explore studios
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                    {booking.studioTitle}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {booking.bookingDate} · {booking.startTime}–{booking.endTime} · $
                    {Number(booking.totalPrice || 0).toFixed(2)}
                  </p>
                </div>
                <span className="rounded-full bg-[#db1a6e]/10 px-3 py-1 text-xs font-bold text-[#db1a6e]">
                  {LABEL[booking.status]}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {booking.status === "pending" && (
                  <Button
                    variant="outline"
                    disabled={updatingId === booking._id}
                    onClick={() => cancel(booking._id)}
                    className="rounded-xl"
                  >
                    Cancel booking
                  </Button>
                )}
                {booking.status === "accepted" && (
                  <Button
                    className="rounded-xl bg-[#db1a6e] text-white hover:bg-[#c2135f]"
                    onClick={() =>
                      downloadBookingInvoice({
                        id: booking._id,
                        studioTitle: booking.studioTitle,
                        bookingDate: booking.bookingDate,
                        startTime: booking.startTime,
                        endTime: booking.endTime,
                        totalPrice: booking.totalPrice,
                        userName: booking.userName,
                        status: "Confirmed",
                      })
                    }
                  >
                    Download invoice
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <AuthGate>
      <Bookings />
    </AuthGate>
  );
}
