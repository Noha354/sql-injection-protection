"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react"; // Import Lucid icons
import { useState } from "react";

export default function SignIn() {
  // State for Secure Form
  const [loadingSecure, setLoadingSecure] = useState(false);
  const [errorSecure, setErrorSecure] = useState<string | null>(null);
  const [successMessageSecure, setSuccessMessageSecure] = useState<
    string | null
  >(null);

  // State for Insecure Form
  const [loadingInsecure, setLoadingInsecure] = useState(false);
  const [errorInsecure, setErrorInsecure] = useState<string | null>(null);
  const [successMessageInsecure, setSuccessMessageInsecure] = useState<
    string | null
  >(null);

  // State to control password visibility
  const [passwordVisibleSecure, setPasswordVisibleSecure] = useState(false);
  const [passwordVisibleInsecure, setPasswordVisibleInsecure] = useState(false);

  // Secure form submit handler
  const handleSecureLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSecure(true);
    setErrorSecure(null);
    setSuccessMessageSecure(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/secure-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) {
        setErrorSecure(data.error);
      } else if (data.message === "Login successful") {
        setSuccessMessageSecure(`${data.message}, Welcome ${data.user.name}!`);
      } else {
        setErrorSecure(data.message);
      }
    } catch (err) {
      setErrorSecure(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingSecure(false);
    }
  };

  // Insecure form submit handler
  const handleInsecureSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingInsecure(true);
    setErrorInsecure(null);
    setSuccessMessageInsecure(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/insecure-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.error) {
        setErrorInsecure(data.error);
      } else if (data.message === "Login successful") {
        setSuccessMessageInsecure(
          `Login successful, Welcome ${data.user.name}!`
        );
      } else {
        setErrorInsecure(data.message);
      }
    } catch (err) {
      setErrorInsecure(
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setLoadingInsecure(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-wrap gap-10 items-center justify-center bg-gray-50">
      {/* Secure Login Form */}
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account (Secure)
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSecureLogin}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="text"
                required
                className="mt-1"
                placeholder="john@example.com"
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type={passwordVisibleSecure ? "text" : "password"}
                required
                className="mt-1"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-9"
                onClick={() => setPasswordVisibleSecure(!passwordVisibleSecure)}
              >
                {passwordVisibleSecure ? (
                  <EyeOff size={20} /> // Lucid icon for hiding password
                ) : (
                  <Eye size={20} /> // Lucid icon for showing password
                )}
              </button>
            </div>
          </div>

          {errorSecure && (
            <div className="text-red-500 text-sm text-center">
              {errorSecure}
            </div>
          )}
          {successMessageSecure && (
            <div className="text-green-500 text-sm text-center">
              {successMessageSecure}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loadingSecure}>
            {loadingSecure ? "Signing in..." : "Secure Sign in"}
          </Button>
        </form>
      </div>

      {/* Insecure Login Form */}
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account (Insecure)
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleInsecureSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="text"
                required
                className="mt-1"
                placeholder="johndoe"
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type={passwordVisibleInsecure ? "text" : "password"}
                required
                className="mt-1"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-9"
                onClick={() =>
                  setPasswordVisibleInsecure(!passwordVisibleInsecure)
                }
              >
                {passwordVisibleInsecure ? (
                  <EyeOff size={20} /> // Lucid icon for hiding password
                ) : (
                  <Eye size={20} /> // Lucid icon for showing password
                )}
              </button>
            </div>
          </div>

          {errorInsecure && (
            <div className="text-red-500 text-sm text-center">
              {errorInsecure}
            </div>
          )}
          {successMessageInsecure && (
            <div className="text-green-500 text-sm text-center">
              {successMessageInsecure}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loadingInsecure}>
            {loadingInsecure ? "Signing in..." : "Insecure Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
