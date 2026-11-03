"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Aperture } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRedirect = searchParams.get("redirect");
  const redirectUrl = requestedRedirect || "/profile";
  const { login, user } = useAuth();

  const [email, setEmail] = React.useState("rina@mail.com");
  const [password, setPassword] = React.useState("password123");

  // If already logged in, redirect immediately
  React.useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const displayName = email.split("@")[0];
    login(displayName, email);
    router.push(redirectUrl);
  };

  const handleDemoHostLogin = () => {
    login("Rina Ahmed", "rina@mail.com");
    router.push(redirectUrl);
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
            Welcome back
          </h2>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            Log in to manage your spaces and take creator bookings.
          </p>
        </div>



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
              <a href="#" className="text-xs font-medium text-[#db1a6e] hover:underline">
                Forgot password?
              </a>
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

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-slate-950 font-bold text-white transition-all hover:bg-slate-800 active:scale-98 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Sign in
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#db1a6e] hover:underline">
            Register now
          </Link>
        </p>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading...</div>}>
      <LoginForm />
    </React.Suspense>
  );
}
