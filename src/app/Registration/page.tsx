
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/auth-context";

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    existingStudio: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      login(formData.name || formData.email.split("@")[0], formData.email);

      alert("Registration successful!");

      console.log("Registered User:", data);

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        existingStudio: false,
      });

      router.push("/profile");

    } catch (error) {
      console.error("Registration Error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">

        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">
            Join StudioSpace
          </CardTitle>

          <CardDescription>
            Create your account and explore creative spaces.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-5">

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>

              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>

            {/* Existing Studio */}
            <div className="flex items-center space-x-3">

              <Checkbox
                id="existingStudio"
                checked={formData.existingStudio}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    existingStudio: checked === true,
                  }))
                }
              />

              <Label
                htmlFor="existingStudio"
                className="cursor-pointer text-sm"
              >
                I already own a studio
              </Label>

            </div>

            {/* Register Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}

              <a
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Login
              </a>
            </p>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
