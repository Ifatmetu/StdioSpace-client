
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Mail,
  Building2,
  CalendarDays,
  ArrowRight,
  Settings,
  Loader2,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuth } from "@/context/auth-context";
import { useMyBookings } from "@/hooks/use-my-bookings";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Studio {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  image?: string;
  imageUrl?: string;
  location?: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { bookings, isLoading: bookingsLoading } = useMyBookings();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [studiosLoading, setStudiosLoading] = useState(true);

  useEffect(() => {
    const fetchStudios = async () => {
      if (!user?.email) {
        setStudiosLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/studios?userEmail=${encodeURIComponent(user.email)}`
        );

        const data = await response.json();

        if (response.ok) {
          setStudios(Array.isArray(data) ? data : data.studios || []);
        }
      } catch (error) {
        console.error("Failed to fetch studios:", error);
      } finally {
        setStudiosLoading(false);
      }
    };

    fetchStudios();
  }, [user?.email]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md w-full">
          <CardContent>
            <User className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">
              Please Login
            </h2>
            <p className="text-gray-500 mb-5">
              You need to login to view your profile.
            </p>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Profile Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your account, listings and bookings.
          </p>
        </div>

        {/* Account Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Account Information
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="h-9 w-9 text-purple-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.name || "User"}
                </h2>

                <p className="flex items-center gap-2 text-gray-500">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Listings */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              My Listings
            </CardTitle>

            <Button asChild variant="outline" size="sm">
              <Link href="/create-studio">
                Add Studio
              </Link>
            </Button>
          </CardHeader>

          <CardContent>
            {studiosLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
              </div>
            ) : studios.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">
                  You haven't listed any studios yet.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/create-studio">
                    Create Your First Listing
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {studios.map((studio) => (
                  <div
                    key={studio._id || studio.id}
                    className="border rounded-xl overflow-hidden bg-white"
                  >
                    <div className="relative h-44 bg-gray-100">
                      <Image
                        src={studio.image || studio.imageUrl || "/placeholder.jpg"}
                        alt={studio.title || studio.name || "Studio"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">
                        {studio.title || studio.name || "Untitled Studio"}
                      </h3>

                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                        <MapPin className="h-4 w-4" />
                        {studio.location || "Location not specified"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Requests Link */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Booking Requests
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage booking requests received for your studios.
                </p>
              </div>

              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/booking-requests">
                  Manage Requests
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Bookings */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-purple-600" />
              My Bookings
            </CardTitle>
          </CardHeader>

          <CardContent>
            {bookingsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDays className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">
                  You haven't made any bookings yet.
                </p>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/studios">
                    Explore Studios
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-xl p-4"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {booking.studioTitle}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {booking.studioLocation}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Booking Date:{" "}
                        {booking.bookingDate
                          ? new Date(booking.bookingDate).toLocaleDateString()
                          : "N/A"}
                      </p>

                      <p className="text-sm font-medium mt-2">
                        Total: ৳{booking.totalPrice}
                      </p>
                    </div>

                    <span
                      className={`capitalize text-sm font-medium px-3 py-1 rounded-full w-fit ${
                        booking.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "declined"
                          ? "bg-red-100 text-red-700"
                          : booking.status === "cancelled"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
