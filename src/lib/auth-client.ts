import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
const baseURL = rawBaseUrl.replace(/\/+$/, "");

export const authClient = createAuthClient({
  baseURL: baseURL || undefined,

  plugins: [jwtClient()],

  fetchOptions: {
    credentials: "include",
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
}});
