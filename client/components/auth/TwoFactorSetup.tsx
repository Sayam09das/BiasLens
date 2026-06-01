"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, KeyRound, QrCode, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormHelper, FormInput, FormLabel, FormMessage } from "@/components/ui/form";

const verificationSchema = z.object({
  code: z
    .string()
    .trim()
    .min(6, "Enter the 6-digit code from your authenticator app.")
    .max(6, "Enter the 6-digit code from your authenticator app.")
    .regex(/^\d{6}$/, "Enter a valid 6-digit verification code."),
});

type VerificationValues = z.infer<typeof verificationSchema>;

export interface TwoFactorSetupProps {
  qrCodeUrl?: string;
  secretKey: string;
  issuer?: string;
  accountLabel?: string;
  backupCodes?: string[];
  onVerify?: (code: string) => Promise<{ error?: string; success?: string } | void> | { error?: string; success?: string } | void;
}

export default function TwoFactorSetup({
  qrCodeUrl,
  secretKey,
  issuer = "BiasLens",
  accountLabel = "your-workspace",
  backupCodes = [],
  onVerify,
}: TwoFactorSetupProps) {
  const [copied, setCopied] = useState<"secret" | "backup" | null>(null);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<VerificationValues>({
    resolver: zodResolver(verificationSchema),
    mode: "onChange",
    defaultValues: { code: "" },
  });

  const copyValue = async (value: string, key: "secret" | "backup") => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  };

  const submitHandler = handleSubmit(async ({ code }) => {
    if (!onVerify) {
      return;
    }

    setSubmitMessage(null);
    const result = await onVerify(code.trim());

    if (result?.error) {
      setError("code", { type: "server", message: result.error });
      setSubmitMessage({ type: "error", message: result.error });
      return;
    }

    setSubmitMessage({
      type: "success",
      message: result?.success ?? "Two-factor authentication is now enabled.",
    });
  });

  return (
    <Card className="rounded-4xl border-[#E7E7E9] bg-white shadow-[0_24px_64px_rgba(13,12,34,0.08)]">
      <CardHeader className="p-6 sm:p-8">
        <CardTitle className="text-3xl tracking-[-0.04em] text-[#0D0C22]">
          Two-factor authentication
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-[#6E6D7A]">
          Add an authenticator app for stronger access control across candidate intelligence and audit data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-0 sm:p-8 sm:pt-0">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="rounded-[1.75rem] border border-[#E7E7E9] bg-[#F6F8FB] p-5">
            <div className="flex h-[190px] items-center justify-center rounded-[1.5rem] border border-dashed border-[#BFDBFE] bg-white">
              {qrCodeUrl ? (
                <Image
                  src={qrCodeUrl}
                  alt="Two-factor QR code"
                  width={160}
                  height={160}
                  className="h-40 w-40 rounded-xl object-contain"
                  unoptimized
                />
              ) : (
                <div className="text-center text-[#6E6D7A]">
                  <QrCode className="mx-auto h-10 w-10 text-[#2563EB]" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium">QR code unavailable</p>
                  <p className="mt-1 text-xs">Use the manual setup key instead.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.75rem] border border-[#E7E7E9] bg-[#F6F8FB] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">Manual setup key</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#6E6D7A]">
                    {issuer} / {accountLabel}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => void copyValue(secretKey, "secret")}
                >
                  <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                  {copied === "secret" ? "Copied" : "Copy"}
                </Button>
              </div>
              <div className="mt-4 rounded-2xl bg-white px-4 py-3 font-mono text-sm text-[#0D0C22]">
                {secretKey}
              </div>
            </div>

            {backupCodes.length > 0 ? (
              <div className="rounded-[1.75rem] border border-[#E7E7E9] bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0D0C22]">Backup codes</p>
                    <p className="mt-1 text-sm text-[#6E6D7A]">
                      Store these in a secure location for emergency access.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => void copyValue(backupCodes.join("\n"), "backup")}
                  >
                    <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                    {copied === "backup" ? "Copied" : "Copy all"}
                  </Button>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {backupCodes.map((code) => (
                    <div
                      key={code}
                      className="rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 font-mono text-sm text-[#0D0C22]"
                    >
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
            <ShieldCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-[#0D0C22]">Scan QR code</p>
            <p className="mt-1 text-sm text-[#6E6D7A]">Use Google Authenticator, 1Password, or Authy.</p>
          </div>
          <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
            <KeyRound className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-[#0D0C22]">Enter setup key</p>
            <p className="mt-1 text-sm text-[#6E6D7A]">Manual setup is available if scanning is blocked.</p>
          </div>
          <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
            <CheckCircle2 className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-[#0D0C22]">Verify code</p>
            <p className="mt-1 text-sm text-[#6E6D7A]">Complete setup with the latest 6-digit token.</p>
          </div>
        </div>

        <Form noValidate onSubmit={submitHandler} className="space-y-5">
          <FormField>
            <FormLabel htmlFor="two-factor-code">Verification code</FormLabel>
            <FormInput
              id="two-factor-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              maxLength={6}
              aria-invalid={Boolean(errors.code)}
              aria-describedby={errors.code ? "two-factor-code-error" : undefined}
              {...register("code")}
            />
            {errors.code ? (
              <FormMessage id="two-factor-code-error" role="alert">
                {errors.code.message}
              </FormMessage>
            ) : (
              <FormHelper>Enter the current code from your authenticator app.</FormHelper>
            )}
          </FormField>

          {submitMessage ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={
                submitMessage.type === "success"
                  ? "rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm text-[#166534]"
                  : "rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]"
              }
            >
              {submitMessage.message}
            </motion.div>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={!isValid || isSubmitting}
            className="h-12 rounded-2xl bg-[#2563EB] px-6 hover:bg-[#1D4ED8]"
          >
            {isSubmitting ? "Verifying..." : "Verify and enable 2FA"}
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
