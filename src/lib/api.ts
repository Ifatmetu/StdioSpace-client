
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  // Get JWT from Better Auth
  const { data, error } = await authClient.token();

  console.log("JWT Token Response:", {
    hasToken: Boolean(data?.token),
    error: error?.message,
  });

  if (error || !data?.token) {
    throw new Error(
      error?.message || "JWT token was not generated. Please login again."
    );
  }

  // Prepare request headers
  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${data.token}`);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Send authenticated request
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || `Request failed (HTTP ${response.status}).`
    );
  }

  return result as T;
}
