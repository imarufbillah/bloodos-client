"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { signInSchema, type SignInInput } from "@/lib/validators/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

/**
 * Phase 8m — Sign In Form
 * Handles email/password authentication via better-auth client SDK.
 * Rate limiting (Req 15.1-15.6) is enforced server-side; this form
 * displays the countdown on 429 responses.
 */

interface SignInFormProps {
  callbackUrl?: string;
}

export function SignInForm({ callbackUrl }: SignInFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<{
    message: string;
    retryAfter: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true);
    setRateLimitError(null);

    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        // Handle rate limiting (429)
        if (result.error.status === 429) {
          // better-auth doesn't expose headers directly in error object
          // We'll use a default retry period or check response if available
          const retryAfter = 900; // Default: 15 minutes (900 seconds)
          setRateLimitError({
            message: `Too many login attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
            retryAfter,
          });
          return;
        }

        // Handle other auth errors
        toast.error(result.error.message || "Invalid email or password");
        return;
      }

      // Success
      toast.success("Signed in successfully");
      router.push(callbackUrl || "/");
      router.refresh();
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl || "/",
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Rate limit error banner */}
      {rateLimitError && (
        <div className="flex items-start gap-3 rounded-md border border-destructive/50 bg-destructive/10 p-4">
          <FiAlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm text-destructive">{rateLimitError.message}</p>
        </div>
      )}

      {/* Google Sign In Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading || !!rateLimitError}
      >
        <FcGoogle className="h-5 w-5 mr-2" />
        {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          disabled={isLoading || !!rateLimitError}
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading || !!rateLimitError}
            {...register("password")}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading || !!rateLimitError}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FiEyeOff className="h-4 w-4" />
            ) : (
              <FiEye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || isGoogleLoading || !!rateLimitError}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
