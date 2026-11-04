import { HowBookingWorks } from "@/components/home/how-booking-works";
import { HostGuarantee } from "@/components/home/host-guarantee";

export default function HowItWorksPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#db1a6e]">
          How it works
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
          From an empty hour to a finished session
        </h1>
      </div>
      <HowBookingWorks />
      <HostGuarantee />
    </div>
  );
}
