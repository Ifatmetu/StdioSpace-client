"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Aperture } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { getPasswordError } from "@/lib/password";
import { toast } from "@/lib/toast";

export default function Register() {
  const router = useRouter();
  const { register, logout, loginWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    const nextPasswordError = getPasswordError(password);
    setPasswordError(nextPasswordError);

    if (nextPasswordError) {
      toast.error(nextPasswordError);
      return;
    }

    setLoading(true);

    try {
      await register(name.trim(), email.trim(), password, photoUrl.trim());
      await logout().catch(() => undefined);
      toast.success("Account created. Please log in.");
      router.push("/login");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Aperture className="size-8 text-[#db1a6e]" />
            <span className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              StudioSpace
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Register
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            Create an account to book rooms or list your own studio.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-xl border-slate-200 font-semibold dark:border-slate-700"
          onClick={async () => {
            try {
              await loginWithGoogle(`${window.location.origin}/`);
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Google sign-in failed."
              );
            }
          }}
        >
          Continue with Google
        </Button>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="photo">Photo URL</Label>
            <Input
              id="photo"
              type="url"
              placeholder="https://"
              value={photoUrl}
              onChange={(event) => setPhotoUrl(event.target.value)}
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError(getPasswordError(event.target.value));
              }}
              required
              className="mt-1.5 h-11 rounded-xl"
            />
            <p className="mt-2 text-xs text-slate-500">
              Use at least 6 characters, with one uppercase and one lowercase letter.
            </p>
            {passwordError && (
              <p className="mt-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-950/30 dark:text-rose-300">
                {passwordError}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-[#db1a6e] font-bold text-white hover:bg-[#c2135f]"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#db1a6e] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
