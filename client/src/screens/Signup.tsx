"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthForm } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/user-provider";

export default function SignupPage() {
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (password !== confirmPassword) {
      setError("Password does not match");
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            name: name,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        login({
          name: data.name ?? "User",
          email: data.email,
          token: data.token,
          id: data.id,
          avatarUrl: data.avatarUrl ?? "",
        });
        window.location.href = "/home";
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AuthLayout
      title="Create an account"
      description="Enter your email below to create your account"
    >
      <AuthForm
        type="signup"
        onSubmit={handleSubmit}
        error={error || undefined}
        isLoading={isLoading}
      />
      <div className="mt-4 text-center">
        <span className="text-sm text-muted-foreground">
          Already have an account?{" "}
        </span>
        <Button variant="link" asChild>
          <Link to="/login">Log in</Link>
        </Button>
      </div>
    </AuthLayout>
  );
}
