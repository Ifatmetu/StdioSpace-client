import { Suspense } from "react";
import { StudioDetail } from "@/components/studios/studio-detail";

async function StudioContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <StudioDetail id={id} />;
}

export default function StudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-600 border-t-transparent" />
        </div>
      }
    >
      <StudioContent params={params} />
    </Suspense>
  );
}