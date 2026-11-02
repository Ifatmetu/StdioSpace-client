import { Banner } from "@/components/home/banner";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { BrowseCategory } from "@/components/home/browse-category";
import { HowBookingWorks } from "@/components/home/how-booking-works";
import { HostGuarantee } from "@/components/home/host-guarantee";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Banner with live spotlight carousel */}
      <Banner />

      {/* 2. Featured Studios Grid with ratings & pricing */}
      <FeaturedStudios />

      {/* 3. Browse by Category */}
      <BrowseCategory />

      {/* 4. How Booking Works */}
      <HowBookingWorks />

      {/* 5. Host Guarantee and Creator Support */}
      <HostGuarantee />
    </div>
  );
}
