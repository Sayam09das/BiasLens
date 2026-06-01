"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormHelper, FormInput, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface LoginFormProps {
  title?: string;
  description?: string;
  defaultEmail?: string;
  onSubmit?: (values: LoginFormValues) => Promise<{ error?: string } | void> | { error?: string } | void;
  forgotPasswordHref?: string;
  registerHref?: string;
  className?: string;
}

export default function LoginForm({
  title = "Welcome back",
  description = "Sign in to continue auditing resumes and reviewing fairness signals.",
  defaultEmail = "",
  onSubmit,
  forgotPasswordHref = "/forgot-password",
  registerHref = "/register",
  className,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: defaultEmail,
      password: "",
      rememberMe: false,
    },
  });

  const submitHandler = handleSubmit(async (values) => {
    if (!onSubmit) {
      return;
    }

    setSubmitError(null);

    const result = await onSubmit({
      email: values.email.trim(),
      password: values.password,
      rememberMe: values.rememberMe ?? false,
    });

    if (result?.error) {
      setError("root", { type: "server", message: result.error });
      setSubmitError(result.error);
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
            <FormLabel htmlFor="login-email">Work Email</FormLabel>
            <FormInput
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              {...register("email")}
            />
            {errors.email ? (
              <FormMessage id="login-email-error" role="alert">
                {errors.email.message}
              </FormMessage>
            ) : (
              <FormHelper>Use the email associated with your BiasLens account.</FormHelper>
            )}
          </FormField>

          <FormField>
            <div className="flex items-center justify-between gap-3">
              <FormLabel htmlFor="login-password">Password</FormLabel>
              <Link
                href={forgotPasswordHref}
                className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8]"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <FormInput
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="pr-12"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "login-password-error" : undefined}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-[#6E6D7A] transition hover:bg-[#F6F8FB] hover:text-[#0D0C22]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password ? (
              <FormMessage id="login-password-error" role="alert">
                {errors.password.message}
              </FormMessage>
            ) : null}
          </FormField>

          <label className="flex items-center gap-3 text-sm text-[#6E6D7A]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#E7E7E9] text-[#2563EB] focus:ring-[#2563EB]"
              {...register("rememberMe")}
            />
            Keep me signed in on this device
          </label>

          {submitError ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{submitError}</span>
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
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </Form>

        <p className="mt-6 text-sm text-[#6E6D7A]">
          Don&apos;t have an account?{" "}
          <Link href={registerHref} className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
