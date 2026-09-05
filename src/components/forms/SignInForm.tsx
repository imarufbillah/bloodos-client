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
import GoogleAuth from "@/components/auth/GoogleAuth";
import { AlertCircle, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface SignInFormProps {
  callbackUrl?: string;
}

export function SignInForm({ callbackUrl }: SignInFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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
    triggerTactileFeedback(HAPTIC_PATTERNS.MEDIUM);
    setIsLoading(true);
    setRateLimitError(null);

    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        if (result.error.status === 429) {
          const retryAfter = 900; // 15 minutes
          setRateLimitError({
            message: `Too many login attempts. For security, please wait ${Math.ceil(retryAfter / 60)} minutes.`,
            retryAfter,
          });
          return;
        }

        toast.error(result.error.message || "Invalid email or password");
        return;
      }

      toast.success("Welcome back! Signed in successfully.");
      router.push(callbackUrl || "/profile");
      router.refresh();
    } catch {
      toast.error("An unexpected connection error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Rate limit warning banner */}
      {rateLimitError && (
        <div 
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive animate-in fade-in duration-200"
        >
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <p className="font-semibold">Security Cooldown Triggered</p>
            <p className="text-destructive/90">{rateLimitError.message}</p>
          </div>
        </div>
      )}

      {/* 1. Fast Google 1-Tap OAuth */}
      <div className="space-y-2">
        <GoogleAuth label="Sign in with Google" />
      </div>

      {/* 2. Tactical Divider */}
      <div className="relative flex items-center justify-center py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/80" />
        </div>
        <div className="relative flex justify-center bg-card px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Or sign in with email</span>
        </div>
      </div>

      {/* 3. High-Contrast Email / Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1.5">
          <Label htmlFor="signin-email" className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>Email Address</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="signin-email"
              type="email"
              placeholder="lifesaver@example.com"
              autoComplete="email"
              disabled={isLoading || !!rateLimitError}
              className="h-11 pl-10 bg-background border-border text-sm placeholder:text-muted-foreground/70 focus:border-crimson focus:ring-1 focus:ring-crimson"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "signin-email-error" : undefined}
            />
          </div>
          {errors.email && (
            <p id="signin-email-error" className="text-xs font-medium text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="signin-password" className="text-xs font-semibold text-foreground">
              Password
            </Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              autoComplete="current-password"
              disabled={isLoading || !!rateLimitError}
              className="h-11 pl-10 pr-10 bg-background border-border text-sm placeholder:text-muted-foreground/70 focus:border-crimson focus:ring-1 focus:ring-crimson"
              {...register("password")}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "signin-password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="signin-password-error" className="text-xs font-medium text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !!rateLimitError}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-paper font-semibold gap-2 shadow-xs transition-all duration-150 active:scale-[0.98] mt-2"
        >
          <span>{isLoading ? "Verifying Credentials..." : "Sign In to BloodOS"}</span>
          <ArrowRight className="h-4 w-4 opacity-80" />
        </Button>
      </form>

      {/* Security Reassurance Note */}
      <div className="flex items-center gap-2 rounded-lg bg-muted/40 border border-border/70 p-2.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-teal shrink-0" />
        <span>End-to-end encrypted session. Cooldown timers & phone privacy remain active.</span>
      </div>
    </div>
  );
}
