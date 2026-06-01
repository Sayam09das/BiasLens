"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, BadgeCheck, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormHelper, FormInput, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required.")
      .min(2, "Full name must be at least 2 characters."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must include an uppercase letter.")
      .regex(/[a-z]/, "Password must include a lowercase letter.")
      .regex(/[0-9]/, "Password must include a number.")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character."),
    confirmPassword: z.string().min(1, "Confirm password is required."),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms to continue." }),
    }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export interface RegisterFormProps {
  title?: string;
  description?: string;
  onSubmit?: (values: RegisterFormValues) => Promise<{ error?: string; success?: string } | void> | { error?: string; success?: string } | void;
  loginHref?: string;
  termsHref?: string;
  privacyHref?: string;
  className?: string;
}

const passwordRules = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "Uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "Number", test: (value: string) => /[0-9]/.test(value) },
  { label: "Special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
] as const;

function getStrength(value: string) {
  const score = passwordRules.filter((rule) => rule.test(value)).length;

  if (score <= 2) {
    return { label: "Needs work", width: `${Math.max(score, 1) * 20}%`, color: "bg-[#EF4444]" };
  }

  if (score < 5) {
    return { label: "Strong", width: `${score * 20}%`, color: "bg-[#F59E0B]" };
  }

  return { label: "Excellent", width: "100%", color: "bg-[#22C55E]" };
}

export default function RegisterForm({
  title = "Create your BiasLens account",
  description = "Set up secure access for explainable AI resume audits and fairness workflows.",
  onSubmit,
  loginHref = "/login",
  termsHref = "/terms",
  privacyHref = "/privacy",
  className,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitState, setSubmitState] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const password = useWatch({ control, name: "password", defaultValue: "" });
  const strength = getStrength(password);

  const submitHandler = handleSubmit(async (values) => {
    if (!onSubmit) {
      return;
    }

    setSubmitState(null);

    const result = await onSubmit({
      ...values,
      fullName: values.fullName.trim(),
      email: values.email.trim(),
    });

    if (result?.error) {
      setError("root", { type: "server", message: result.error });
      setSubmitState({ type: "error", message: result.error });
      return;
    }

    if (result?.success) {
      setSubmitState({ type: "success", message: result.success });
    }
  });

  return (
    <Card className={cn("rounded-4xl border-[#E7E7E9] bg-white shadow-[0_24px_64px_rgba(13,12,34,0.08)]", className)}>
      <CardHeader className="p-6 sm:p-8">
        <CardTitle className="text-3xl tracking-[-0.04em] text-[#0D0C22]">
          {title}
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-[#6E6D7A]">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
        <Form noValidate onSubmit={submitHandler} className="space-y-5">
          <FormField>
            <FormLabel htmlFor="register-full-name">Full Name</FormLabel>
            <FormInput
              id="register-full-name"
              autoComplete="name"
              placeholder="Enter your full name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "register-full-name-error" : undefined}
              {...register("fullName")}
            />
            {errors.fullName ? (
              <FormMessage id="register-full-name-error" role="alert">
                {errors.fullName.message}
              </FormMessage>
            ) : (
              <FormHelper>Use your real name for onboarding and verification.</FormHelper>
            )}
          </FormField>

          <FormField>
            <FormLabel htmlFor="register-email">Work Email</FormLabel>
            <FormInput
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "register-email-error" : undefined}
              {...register("email")}
            />
            {errors.email ? (
              <FormMessage id="register-email-error" role="alert">
                {errors.email.message}
              </FormMessage>
            ) : (
              <FormHelper>We’ll send account verification instructions here.</FormHelper>
            )}
          </FormField>

          <div className="grid gap-5 lg:grid-cols-2">
            <FormField>
              <FormLabel htmlFor="register-password">Password</FormLabel>
              <div className="relative">
                <FormInput
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a secure password"
                  className="pr-12"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "register-password-error" : undefined}
                  {...register("password")}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#6E6D7A] transition hover:bg-[#F6F8FB] hover:text-[#0D0C22]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-3 rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-[#0D0C22]">Password strength</span>
                  <span className="text-xs font-semibold text-[#6E6D7A]">{strength.label}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white">
                  <div className={cn("h-full rounded-full transition-all", strength.color)} style={{ width: strength.width }} />
                </div>
                <div className="mt-4 grid gap-2">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <div key={rule.label} className="flex items-center gap-2 text-xs text-[#6E6D7A]">
                        <span
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-full border transition",
                            passed ? "border-[#22C55E] bg-[#22C55E] text-white" : "border-[#E7E7E9] bg-white text-transparent",
                          )}
                        >
                          <Check size={12} />
                        </span>
                        <span className={passed ? "text-[#0D0C22]" : ""}>{rule.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {errors.password ? (
                <FormMessage id="register-password-error" role="alert">
                  {errors.password.message}
                </FormMessage>
              ) : null}
            </FormField>

            <FormField>
              <FormLabel htmlFor="register-confirm-password">Confirm Password</FormLabel>
              <div className="relative">
                <FormInput
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  className="pr-12"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={errors.confirmPassword ? "register-confirm-password-error" : undefined}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#6E6D7A] transition hover:bg-[#F6F8FB] hover:text-[#0D0C22]"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword ? (
                <FormMessage id="register-confirm-password-error" role="alert">
                  {errors.confirmPassword.message}
                </FormMessage>
              ) : (
                <FormHelper>Re-enter the password exactly as above.</FormHelper>
              )}
            </FormField>
          </div>

          <FormField className="space-y-3">
            <label
              htmlFor="register-terms"
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-3"
            >
              <input
                id="register-terms"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-[#E7E7E9] text-[#2563EB] focus:ring-[#2563EB]"
                aria-invalid={Boolean(errors.acceptTerms)}
                aria-describedby={errors.acceptTerms ? "register-terms-error" : undefined}
                {...register("acceptTerms")}
              />
              <span className="text-sm leading-6 text-[#6E6D7A]">
                I agree to the{" "}
                <Link href={termsHref} className="font-medium text-[#2563EB] hover:text-[#1D4ED8]">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href={privacyHref} className="font-medium text-[#2563EB] hover:text-[#1D4ED8]">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.acceptTerms ? (
              <FormMessage id="register-terms-error" role="alert">
                {errors.acceptTerms.message}
              </FormMessage>
            ) : null}
          </FormField>

          {submitState ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm",
                submitState.type === "success"
                  ? "border-[#BBF7D0] bg-[#F0FDF4] text-[#166534]"
                  : "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]",
              )}
            >
              {submitState.type === "success" ? (
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              <span>{submitState.message}</span>
            </motion.div>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={!isValid || isSubmitting}
            className="h-12 w-full rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </Form>

        <p className="mt-6 text-sm text-[#6E6D7A]">
          Already have an account?{" "}
          <Link href={loginHref} className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
