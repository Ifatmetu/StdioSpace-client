export async function uploadImageToImgbb(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!key) {
    throw new Error(
      "Image hosting is not configured. Paste an image URL, or set NEXT_PUBLIC_IMGBB_API_KEY."
    );
  }

  const body = new FormData();
  body.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`,
    { method: "POST", body }
  );

  const result = (await response.json().catch(() => null)) as {
    success?: boolean;
    data?: { url?: string };
    error?: { message?: string };
  } | null;

  const url = result?.data?.url;

  if (!response.ok || !result?.success || !url) {
    throw new Error(result?.error?.message || "Image upload failed.");
  }

  return url;
}
