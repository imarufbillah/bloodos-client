"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { signUpSchema, type SignUpInput } from "@/lib/validators/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleAuth from "@/components/auth/GoogleAuth";
import { AlertCircle, Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck } from "lucide-react";
import { triggerTactileFeedback, HAPTIC_PATTERNS } from "@/lib/haptics";

interface SignUpFormProps {
  callbackUrl?: string;
}

export function SignUpForm({ callbackUrl }: SignUpFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<{
    message: string;
    retryAfter: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    triggerTactileFeedback(HAPTIC_PATTERNS.MEDIUM);
    setIsLoading(true);
    setRateLimitError(null);

    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        if (result.error.status === 429) {
          const retryAfter = 900; // 15 minutes
          setRateLimitError({
            message: `Too many registration attempts. Please wait ${Math.ceil(retryAfter / 60)} minutes.`,
            retryAfter,
          });
          return;
        }

        if (
          result.error.status === 400 &&
          result.error.message?.toLowerCase().includes("already exists")
        ) {
          toast.error("An account with this email already exists. Try signing in.");
          return;
        }

        toast.error(result.error.message || "Failed to create account");
        return;
      }

      toast.success("Account registered! Welcome to the BloodOS Lifesaver network.");
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
            <p className="font-semibold">Registration Cooldown</p>
            <p className="text-destructive/90">{rateLimitError.message}</p>
          </div>
        </div>
      )}

      {/* 1. Fast Google 1-Tap OAuth */}
      <div className="space-y-2">
        <GoogleAuth label="Register with Google" />
      </div>

      {/* 2. Tactical Divider */}
      <div className="relative flex items-center justify-center py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/80" />
        </div>
        <div className="relative flex justify-center bg-card px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Or register with email</span>
        </div>
      </div>

      {/* 3. High-Contrast Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-name" className="text-xs font-semibold text-foreground">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="signup-name"
              type="text"
              inputMode="text"
              autoCapitalize="words"
              autoCorrect="off"
              placeholder="e.g. Dr. Sadia Rahman or Maruf Billah"
              autoComplete="name"
              disabled={isLoading || !!rateLimitError}
              className="h-11 min-h-[44px] pl-10 bg-background border-border text-base sm:text-sm placeholder:text-muted-foreground/70 focus:border-crimson focus:ring-1 focus:ring-crimson touch-manipulation"
              {...register("name")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "signup-name-error" : undefined}
            />
          </div>
          {errors.name && (
            <p id="signup-name-error" className="text-xs font-medium text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.name.message}</span>
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-email" className="text-xs font-semibold text-foreground">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="signup-email"
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="donor@example.com"
              autoComplete="email"
              disabled={isLoading || !!rateLimitError}
              className="h-11 min-h-[44px] pl-10 bg-background border-border text-base sm:text-sm placeholder:text-muted-foreground/70 focus:border-crimson focus:ring-1 focus:ring-crimson touch-manipulation"
              {...register("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "signup-email-error" : undefined}
            />
          </div>
          {errors.email && (
            <p id="signup-email-error" className="text-xs font-medium text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-password" className="text-xs font-semibold text-foreground">
            Create Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              disabled={isLoading || !!rateLimitError}
              className="h-11 min-h-[44px] pl-10 pr-11 bg-background border-border text-base sm:text-sm placeholder:text-muted-foreground/70 focus:border-crimson focus:ring-1 focus:ring-crimson touch-manipulation"
              {...register("password")}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "signup-password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors touch-manipulation"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="signup-password-error" className="text-xs font-medium text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-confirm-password" className="text-xs font-semibold text-foreground">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              autoComplete="new-password"
              disabled={isLoading || !!rateLimitError}
              className="h-11 min-h-[44px] pl-10 pr-11 bg-background border-border text-base sm:text-sm placeholder:text-muted-foreground/70 focus:border-crimson focus:ring-1 focus:ring-crimson touch-manipulation"
              {...register("confirmPassword")}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? "signup-confirm-password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors touch-manipulation"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="signup-confirm-password-error" className="text-xs font-medium text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.confirmPassword.message}</span>
            </p>
          )}
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          size="lg"
          disabled={isLoading || !!rateLimitError}
          className="w-full h-11 min-h-[44px] bg-primary hover:bg-primary/90 text-paper font-semibold gap-2 shadow-xs transition-all duration-150 active:scale-[0.98] touch-manipulation mt-2"
        >
          <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
          <ArrowRight className="h-4 w-4 opacity-80" />
        </Button>
      </form>
    </div>
  );
}
