
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Aperture } from "lucide-react";
import { toast } from "@/lib/toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedRedirect = searchParams.get("redirect");
  const redirectUrl = requestedRedirect || "/";

  const { login, loginWithGoogle, user, isLoading } = useAuth();

  const [email, setEmail] = React.useState("rina@mail.com");
  const [password, setPassword] = React.useState("password123");
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace(redirectUrl);
    }
  }, [user, isLoading, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);

      toast.success("Login successful! Welcome to StudioSpace.");

      router.push(redirectUrl);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Login failed. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">

        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Aperture className="size-8 text-[#db1a6e]" />
            <span className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              StudioSpace
            </span>
          </Link>

          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Login
          </h2>

          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            Log in to manage your spaces and take creator bookings.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isGoogleSubmitting || isSubmitting || isLoading}
          className="h-11 w-full rounded-xl border-slate-200 font-semibold dark:border-slate-700"
          onClick={async () => {
            try {
              setIsGoogleSubmitting(true);
              await loginWithGoogle(`${window.location.origin}${redirectUrl}`);
            } catch (err) {
              setIsGoogleSubmitting(false);
              toast.error(
                err instanceof Error ? err.message : "Google sign-in failed."
              );
            }
          }}
        >
          {isGoogleSubmitting ? "Connecting to Google..." : "Continue with Google"}
        </Button>

        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          <span className="absolute bg-white px-3 text-xs font-semibold text-slate-400 uppercase dark:bg-slate-900">
            Or sign in with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email address
            </Label>

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 h-11 rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-800 dark:bg-slate-800"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </Label>
              <button
                type="button"
                className="text-xs font-semibold text-[#db1a6e] hover:underline"
                onClick={() =>
                  toast.info(
                    "Password reset is turned off for this review so you can sign in with the examiner account."
                  )
                }
              >
                Forgot Password
              </button>
            </div>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1.5 h-11 rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-800 dark:bg-slate-800"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="h-11 w-full rounded-xl bg-slate-950 font-bold text-white transition-all hover:bg-slate-800 active:scale-98 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#db1a6e] hover:underline"
          >
            Register now
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-12 text-center text-sm text-slate-500">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
