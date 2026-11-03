
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
  MapPin,
  ChevronDown,
  Settings,
  Loader2,
  ClipboardList,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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

type SectionName = "account" | "listings" | "bookings";

export default function ProfilePage() {
  const { user } = useAuth();

  const { bookings, isLoading: bookingsLoading } = useMyBookings();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [studiosLoading, setStudiosLoading] = useState(true);

  const [openSection, setOpenSection] =
    useState<SectionName | null>("account");

  const toggleSection = (section: SectionName) => {
    setOpenSection((current) =>
      current === section ? null : section
    );
  };

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
          setStudios(
            Array.isArray(data) ? data : data.studios || []
          );
        }
      } catch (error) {
        console.error("Failed to fetch studios:", error);
      } finally {
        setStudiosLoading(false);
      }
    };

    fetchStudios();
  }, [user?.email]);

  const SectionHeader = ({
    title,
    icon,
    section,
    description,
  }: {
    title: string;
    icon: React.ReactNode;
    section: SectionName;
    description: string;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-50 transition"
      aria-expanded={openSection === section}
    >
      <div className="flex items-center gap-4">
        <div className="h-11 w-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
          {icon}
        </div>

        <div>
          <h2 className="font-semibold text-gray-900">
            {title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        </div>
      </div>

      <ChevronDown
        className={`h-5 w-5 text-gray-500 shrink-0 transition-transform duration-200 ${
          openSection === section ? "rotate-180" : ""
        }`}
      />
    </button>
  );

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
              You need to login to view your profile.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-md bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition"
            >
              Login
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Profile Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
              <User className="h-8 w-8 text-purple-600" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {user.name || "My Profile"}
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                {user.email}
              </p>
            </div>
          </div>

          <p className="text-gray-500 mt-5">
            Manage your account and activities.
          </p>
        </div>

        {/* Dropdown Sections */}
        <Card className="border border-gray-200 shadow-sm divide-y overflow-hidden">

          {/* Account Information */}
          <div>
            <SectionHeader
              title="Account Information"
              description="View your personal information"
              section="account"
              icon={<User className="h-5 w-5" />}
            />

            {openSection === "account" && (
              <div className="px-5 pb-5 pt-1">
                <div className="rounded-xl bg-gray-50 p-4 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Full Name
                    </p>
                    <p className="font-medium text-gray-900">
                      {user.name || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Email Address
                    </p>
                    <p className="font-medium text-gray-900 break-all">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* My Listings */}
          <div>
            <SectionHeader
              title="My Listings"
              description={`${studios.length} studio${studios.length === 1 ? "" : "s"} listed`}
              section="listings"
              icon={<Building2 className="h-5 w-5" />}
            />

            {openSection === "listings" && (
              <div className="px-5 pb-5 pt-1">
                {studiosLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                  </div>
                ) : studios.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-10 w-10 mx-auto text-gray-300 mb-3" />

                    <p className="text-gray-500 text-sm">
                      You haven't listed any studios yet.
                    </p>

                    <Link
                      href="/create-studio"
                      className="inline-flex items-center justify-center mt-4 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition"
                    >
                      Add Your First Studio
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {studios.map((studio) => (
                      <div
                        key={studio._id || studio.id}
                        className="flex items-center gap-4 border rounded-xl p-3"
                      >
                        <div className="relative h-16 w-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <Image
                            src={
                              studio.image ||
                              studio.imageUrl ||
                              "/placeholder.jpg"
                            }
                            alt={
                              studio.title ||
                              studio.name ||
                              "Studio"
                            }
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {studio.title ||
                              studio.name ||
                              "Untitled Studio"}
                          </h3>

                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {studio.location ||
                                "Location not specified"}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}

                    <Link
                      href="/create-studio"
                      className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 pt-2"
                    >
                      <Building2 className="h-4 w-4" />
                      Add another studio
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* My Bookings */}
          <div>
            <SectionHeader
              title="My Bookings"
              description={`${bookings.length} booking${bookings.length === 1 ? "" : "s"} made`}
              section="bookings"
              icon={<CalendarDays className="h-5 w-5" />}
            />

            {openSection === "bookings" && (
              <div className="px-5 pb-5 pt-1">
                {bookingsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarDays className="h-10 w-10 mx-auto text-gray-300 mb-3" />

                    <p className="text-gray-500 text-sm">
                      You haven't made any bookings yet.
                    </p>

                    <Link
                      href="/studios"
                      className="inline-flex items-center justify-center mt-4 rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
                    >
                      Explore Studios
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {booking.studioTitle}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            {booking.studioLocation}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            Booking Date:{" "}
                            {booking.bookingDate
                              ? new Date(
                                  booking.bookingDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>

                          <p className="text-sm font-semibold text-gray-900 mt-2">
                            ৳{booking.totalPrice}
                          </p>
                        </div>

                        <span
                          className={`capitalize text-xs font-semibold px-3 py-1.5 rounded-full w-fit ${
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
              </div>
            )}
          </div>
        </Card>

        {/* Separate Booking Requests Page */}
        <div className="mt-6">
          <Link
            href="/booking-requests"
            className="flex items-center justify-between gap-4 rounded-xl border border-purple-100 bg-purple-50 p-4 hover:bg-purple-100 transition"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-purple-600">
                <ClipboardList className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Manage Booking Requests
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Accept or decline requests for your studios.
                </p>
              </div>
            </div>

            <ArrowRight className="h-5 w-5 text-purple-600 shrink-0" />
          </Link>
        </div>

      </div>
    </main>
  );
}
