"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Globe,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  Zap,
  Bell,
  KeyRound,
  Users,
  TriangleAlert,
  Trash2,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";

function FieldLabel({ htmlFor, children, className }: { htmlFor?: string; children: React.ReactNode; className?: string }) {
  return (
    <label
      {...(htmlFor ? { htmlFor } : {})}
      className={
        (className ?? "") +
        (className ? " " : "") +
        "text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]"
      }
    >
      {children}
    </label>
  );
}

function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2.5 text-sm outline-none focus:border-[#2563EB] " +
        (props.className ?? "")
      }
    />
  );
}

const Label = FieldLabel;
const Input = FieldInput;

type Option = { label: string; value: string };

const organizationTypeOptions: Option[] = [
  { label: "Startup", value: "Startup" },
  { label: "Enterprise", value: "Enterprise" },
  { label: "University", value: "University" },
  { label: "Agency", value: "Agency" },
  { label: "Government", value: "Government" },
  { label: "Other", value: "Other" },
];

const teamSizeOptions: Option[] = [
  { label: "1-5", value: "1-5" },
  { label: "6-20", value: "6-20" },
  { label: "21-100", value: "21-100" },
  { label: "101-500", value: "101-500" },
  { label: "500+", value: "500+" },
];

const hiringVolumeOptions: Option[] = [
  { label: "1-20 resumes/month", value: "1-20" },
  { label: "21-100 resumes/month", value: "21-100" },
  { label: "101-500 resumes/month", value: "101-500" },
  { label: "500+ resumes/month", value: "500+" },
];

const fullNameSchema = z
  .string()
  .trim()
  .min(2, { message: "Full name must be at least 2 characters." })
  .max(80, { message: "Full name is too long." });

const emailSchema = z
  .string()
  .trim()
  .min(1, { message: "Work email is required." })
  .email({ message: "Please enter a valid email address." });

const phoneSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" ? undefined : v))
  .refine(
    (v) => {
      if (!v) return true;
      // Basic international-friendly check: digits, spaces, +, -, parentheses
      return /^[0-9+()\-\s]{7,20}$/.test(v);
    },
    { message: "Phone number looks invalid." }
  );

const schema = z.object({
  // Profile
  fullName: fullNameSchema,
  workEmail: emailSchema,
  jobTitle: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  company: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  phoneNumber: phoneSchema,

  // Avatar: we keep it as a string (mock) to avoid backend wiring.
  avatarFileName: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),

  // Account preferences
  defaultDashboardView: z
    .string()
    .trim()
    .min(1, { message: "Select a default view." }),
  emailNotifications: z.boolean(),
  productUpdateEmails: z.boolean(),
  auditReportEmails: z.boolean(),
  weeklySummaryEmails: z.boolean(),

  // Workspace
  workspaceName: z.string().trim().min(2, { message: "Workspace name is required." }),
  organizationType: z.string().trim().min(1, { message: "Select an organization type." }),
  teamSize: z.string().trim().min(1, { message: "Select a team size." }),
  hiringVolume: z.string().trim().min(1, { message: "Select a hiring volume." }),
});


type SettingsFormValues = z.infer<typeof schema>;

function Switch({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={
        "relative inline-flex h-6 w-11 items-center rounded-full border transition " +
        (checked
          ? "border-[#2563EB] bg-[#2563EB]"
          : "border-[#E7E7E9] bg-[#FFFFFF]")
      }
    >
      <span
        className={
          "inline-block h-5 w-5 transform rounded-full bg-[#FFFFFF] shadow transition " +
          (checked ? "translate-x-5" : "translate-x-1")
        }
      />
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
  label,
  error,
  placeholder,
}: {
  value?: string;
  onChange: (v: string) => void;
  options: Option[];
  label: string;
  error?: string;
  placeholder?: string;
}) {
  const id = label;
  return (
    <div className="space-y-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2.5 text-sm outline-none focus:border-[#2563EB]"
        aria-invalid={!!error}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-[#EF4444]">{error}</p> : null}
    </div>
  );
}


export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "profile";
  const { user, status, setUser } = useAuthStore();
  const { profileAvatar, setProfileAvatar } = useUIStore();
  const mockUser = React.useMemo(
    () => ({
      fullName: "Jordan Taylor",
      workEmail: "jordan.taylor@company.com",
      jobTitle: "Product Operations",
      company: "BiasLens Labs",
      phoneNumber: "+1 (415) 555-0198",
      avatarFileName: "avatar-jordan.png",
      defaultDashboardView: "reports",
      emailNotifications: true,
      productUpdateEmails: false,
      auditReportEmails: true,
      weeklySummaryEmails: true,
      workspaceName: "BiasLens Workspace",
      organizationType: "Startup",
      teamSize: "21-100",
      hiringVolume: "21-100",
      connected: {
        emailVerified: true,
        twoFactor: true,
        activeSessions: 3,
        apiAccess: true,
      },
    }),
    []
  );

  const [saveState, setSaveState] = React.useState<
    | { status: "idle" }
    | { status: "saving" }
    | { status: "success"; message: string }
    | { status: "error"; message: string }
  >({ status: "idle" });
  const [profileError, setProfileError] = React.useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = React.useState(false);
  const [profileLoaded, setProfileLoaded] = React.useState(false);
  const [avatarDraftUrl, setAvatarDraftUrl] = React.useState<string | null>(profileAvatar);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<SettingsFormValues>,
    defaultValues: {
      fullName: mockUser.fullName,
      workEmail: mockUser.workEmail,
      jobTitle: mockUser.jobTitle,
      company: mockUser.company,
      phoneNumber: mockUser.phoneNumber,
      avatarFileName: mockUser.avatarFileName,
      defaultDashboardView: mockUser.defaultDashboardView,
      emailNotifications: mockUser.emailNotifications,
      productUpdateEmails: mockUser.productUpdateEmails,
      auditReportEmails: mockUser.auditReportEmails,
      weeklySummaryEmails: mockUser.weeklySummaryEmails,
      workspaceName: mockUser.workspaceName,
      organizationType: mockUser.organizationType,
      teamSize: mockUser.teamSize,
      hiringVolume: mockUser.hiringVolume,
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (tab !== "profile" || !user?.id || status !== "authenticated" || profileLoaded) {
      return;
    }

    const kickoff = setTimeout(() => {
      void (async () => {
        setIsProfileLoading(true);
        setProfileError(null);

        try {
          const profile = await apiFetch<{
            id: string;
            email: string;
            fullName: string;
            role: string;
            jobTitle?: string | null;
            company?: string | null;
            phoneNumber?: string | null;
            isActive: boolean;
            emailVerified: boolean;
            emailVerifiedAt?: string | null;
            createdAt?: string;
            updatedAt?: string;
          }>(`/v1/users/${user.id}`);

          reset({
            fullName: profile.fullName,
            workEmail: profile.email,
            jobTitle: profile.jobTitle ?? undefined,
            company: profile.company ?? undefined,
            phoneNumber: profile.phoneNumber ?? undefined,
            avatarFileName: undefined,
            defaultDashboardView: mockUser.defaultDashboardView,
            emailNotifications: mockUser.emailNotifications,
            productUpdateEmails: mockUser.productUpdateEmails,
            auditReportEmails: mockUser.auditReportEmails,
            weeklySummaryEmails: mockUser.weeklySummaryEmails,
            workspaceName: mockUser.workspaceName,
            organizationType: mockUser.organizationType,
            teamSize: mockUser.teamSize,
            hiringVolume: mockUser.hiringVolume,
          });

          setUser({
            id: profile.id,
            email: profile.email,
            fullName: profile.fullName,
            role: profile.role,
            jobTitle: profile.jobTitle ?? null,
            company: profile.company ?? null,
            phoneNumber: profile.phoneNumber ?? null,
            isActive: profile.isActive,
            emailVerified: profile.emailVerified,
            emailVerifiedAt: profile.emailVerifiedAt ?? null,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
          });
          setProfileLoaded(true);
        } catch (e) {
          setProfileError(e instanceof Error ? e.message : "Failed to load profile.");
        } finally {
          setIsProfileLoading(false);
        }
      })();
    }, 0);

    return () => clearTimeout(kickoff);
  }, [mockUser, profileLoaded, reset, setUser, status, tab, user?.id]);

  const values = useWatch({ control });

  const avatarPreview = React.useMemo(() => {
    if (avatarDraftUrl) {
      return { image: avatarDraftUrl, initials: null };
    }

    const parts = (values.fullName || "").trim().split(/\s+/).filter(Boolean);
    const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
    return initials ? { image: null, initials } : null;
  }, [avatarDraftUrl, values.fullName]);

  const onSubmit = async (data: SettingsFormValues) => {
    setSaveState({ status: "saving" });

    try {
      if (tab === "profile") {
        if (!user?.id) {
          throw new Error("You need to be signed in to update your profile.");
        }

        const updated = await apiFetch<{
          id: string;
          email: string;
          fullName: string;
          role: string;
          jobTitle?: string | null;
          company?: string | null;
          phoneNumber?: string | null;
          isActive: boolean;
          emailVerified: boolean;
          emailVerifiedAt?: string | null;
          createdAt?: string;
          updatedAt?: string;
        }>(`/v1/users/${user.id}`, {
          method: "PATCH",
          body: {
            fullName: data.fullName,
            jobTitle: data.jobTitle ?? "",
            company: data.company ?? "",
            phoneNumber: data.phoneNumber ?? "",
          },
        });

        reset({
          ...data,
          fullName: updated.fullName,
          workEmail: updated.email,
          jobTitle: updated.jobTitle ?? undefined,
          company: updated.company ?? undefined,
          phoneNumber: updated.phoneNumber ?? undefined,
        });
        setProfileAvatar(avatarDraftUrl);
        setUser({
          id: updated.id,
          email: updated.email,
          fullName: updated.fullName,
          role: updated.role,
          jobTitle: updated.jobTitle ?? null,
          company: updated.company ?? null,
          phoneNumber: updated.phoneNumber ?? null,
          isActive: updated.isActive,
          emailVerified: updated.emailVerified,
          emailVerifiedAt: updated.emailVerifiedAt ?? null,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        });
        setProfileError(null);
        setProfileLoaded(true);
      } else {
        await new Promise((r) => setTimeout(r, 900));
      }

      setSaveState({ status: "success", message: "Settings saved successfully." });
      await new Promise((r) => setTimeout(r, 1200));
      setSaveState({ status: "idle" });
    } catch (e) {
      setSaveState({
        status: "error",
        message: e instanceof Error ? e.message : "Failed to save settings.",
      });
    }
  };

  const cancelToMock = () => {
    if (tab === "profile" && user) {
      reset({
        ...values,
        fullName: user.fullName,
        workEmail: user.email,
        jobTitle: user.jobTitle ?? undefined,
        company: user.company ?? undefined,
        phoneNumber: user.phoneNumber ?? undefined,
        avatarFileName: undefined,
      });
      setAvatarDraftUrl(profileAvatar);
    } else {
      setValue("fullName", mockUser.fullName, { shouldValidate: true });
      setValue("workEmail", mockUser.workEmail, { shouldValidate: true });
      setValue("jobTitle", mockUser.jobTitle, { shouldValidate: true });
      setValue("company", mockUser.company, { shouldValidate: true });
      setValue("phoneNumber", mockUser.phoneNumber as string, { shouldValidate: true });
      setValue("avatarFileName", mockUser.avatarFileName, { shouldValidate: true });

      setValue("defaultDashboardView", mockUser.defaultDashboardView, { shouldValidate: true });
      setValue("emailNotifications", mockUser.emailNotifications);
      setValue("productUpdateEmails", mockUser.productUpdateEmails);
      setValue("auditReportEmails", mockUser.auditReportEmails);
      setValue("weeklySummaryEmails", mockUser.weeklySummaryEmails);

      setValue("workspaceName", mockUser.workspaceName, { shouldValidate: true });
      setValue("organizationType", mockUser.organizationType, { shouldValidate: true });
      setValue("teamSize", mockUser.teamSize, { shouldValidate: true });
      setValue("hiringVolume", mockUser.hiringVolume, { shouldValidate: true });
      setAvatarDraftUrl(profileAvatar);
    }

    setSaveState({ status: "idle" });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="User settings form">
        {/* 1) Profile Information */}
        {tab === "profile" && <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
                <UserIcon size={18} className="text-[#2563EB]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">Profile Information</p>
                <p className="mt-1 text-sm text-[#6E6D7A]">Update personal details and avatar.</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6D7A]">Premium UI</div>
            </div>
          </div>

          {profileError ? (
            <div className="mt-6 rounded-[1.25rem] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.10)] p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-[#EF4444]" size={18} aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">Profile could not be loaded</p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">{profileError}</p>
                </div>
              </div>
            </div>
          ) : null}

          {isProfileLoading ? (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded-full bg-[#dbe8ff]" />
                  <div className="h-11 animate-pulse rounded-[1.25rem] bg-[#F6F8FB]" />
                </div>
              ))}
            </div>
          ) : (

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Full Name</span>
              </Label>
              <FieldInput
                id="fullName"
                {...register("fullName")}
                placeholder="Your full name"
                aria-invalid={!!errors.fullName}
                className="rounded-[1.25rem] border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2.5 text-sm"
              />

              {errors.fullName ? <p className="text-sm text-[#EF4444]">{errors.fullName.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workEmail">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Work Email</span>
              </Label>
              <Input
                id="workEmail"
                type="email"
                {...register("workEmail")}
                placeholder="name@company.com"
                disabled
                aria-invalid={!!errors.workEmail}
                className="rounded-[1.25rem] border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2.5 text-sm"
              />
              {errors.workEmail ? <p className="text-sm text-[#EF4444]">{errors.workEmail.message}</p> : null}
              {!errors.workEmail ? <p className="text-sm text-[#6E6D7A]">Email is loaded from your account and cannot be edited here yet.</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Job Title</span>
              </Label>
              <Input
                id="jobTitle"
                {...register("jobTitle")}
                placeholder="e.g., Senior Manager"
                className="rounded-[1.25rem] border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2.5 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Company</span>
              </Label>
              <Input
                id="company"
                {...register("company")}
                placeholder="Your company"
                className="rounded-[1.25rem] border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2.5 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Phone Number (Optional)</span>
              </Label>
              <Input
                id="phoneNumber"
                {...register("phoneNumber")}
                placeholder="+1 555 123 4567"
                aria-invalid={!!errors.phoneNumber}
                className="rounded-[1.25rem] border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2.5 text-sm"
              />
              {errors.phoneNumber ? <p className="text-sm text-[#EF4444]">{errors.phoneNumber.message}</p> : null}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor="avatarUpload">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Profile Avatar Upload</span>
                  </Label>
                  <p className="mt-1 text-sm text-[#6E6D7A]">Local-only for now. Profile text fields are saved to the backend.</p>
                </div>
                <div className="flex h-12 items-center justify-end">
                  <div className="relative">
                    <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] text-[#2563EB]">
                      {avatarPreview?.image ? (
                        <Image
                          src={avatarPreview.image}
                          alt="Profile avatar preview"
                          width={48}
                          height={48}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      ) : avatarPreview ? (
                        <span className="text-sm font-semibold">{avatarPreview.initials}</span>
                      ) : (
                        <Sparkles size={18} aria-hidden="true" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                className="block w-full cursor-pointer rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2.5 text-sm text-[#6E6D7A] file:mr-3 file:rounded-full file:border file:border-[#E7E7E9] file:bg-[#FFFFFF] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[#0D0C22] hover:file:bg-[#F6F8FB]"
                aria-label="Upload profile avatar"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  setValue("avatarFileName", file?.name ?? undefined, { shouldValidate: true });

                  if (!file) {
                    setAvatarDraftUrl(profileAvatar);
                    return;
                  }

                  const nextAvatar = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === "string") {
                        resolve(reader.result);
                        return;
                      }

                      reject(new Error("Could not read the selected avatar file."));
                    };
                    reader.onerror = () => reject(reader.error ?? new Error("Could not read the selected avatar file."));
                    reader.readAsDataURL(file);
                  }).catch(() => null);

                  if (nextAvatar) {
                    setAvatarDraftUrl(nextAvatar);
                  }
                }}
              />
            </div>
          </div>
          )}
        </Card>}

        {/* 2) Account Preferences */}
        {tab === "account" && <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
                <Globe size={18} className="text-[#2563EB]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">Account Preferences</p>
                <p className="mt-1 text-sm text-[#6E6D7A]">Control notification settings and dashboard behavior.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              label="Default dashboard view"
              value={values.defaultDashboardView ?? ""}
              onChange={(v) => setValue("defaultDashboardView", v, { shouldValidate: true })}
              options={[
                { label: "Reports", value: "reports" },
                { label: "Audit Log", value: "audit" },
                { label: "Analytics", value: "analytics" },
              ]}
              placeholder="Select view"
              error={errors.defaultDashboardView?.message}
            />

            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">Email notifications</Label>
              <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0D0C22]">Email Notifications</p>
                    <p className="mt-1 text-sm text-[#6E6D7A]">Receive important account changes.</p>
                  </div>
                  <Switch
                    checked={values.emailNotifications ?? false}
                    onCheckedChange={(next) => setValue("emailNotifications", next)}
                    label="Email notifications toggle"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0D0C22]">Product Updates</p>
                    <p className="mt-1 text-sm text-[#6E6D7A]">New features and release notes.</p>
                  </div>
                  <Switch
                    checked={values.productUpdateEmails ?? false}
                    onCheckedChange={(next) => setValue("productUpdateEmails", next)}
                    label="Product update emails toggle"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0D0C22]">Audit Reports</p>
                    <p className="mt-1 text-sm text-[#6E6D7A]">When reports are generated or shared.</p>
                  </div>
                  <Switch
                    checked={values.auditReportEmails ?? false}
                    onCheckedChange={(next) => setValue("auditReportEmails", next)}
                    label="Audit report emails toggle"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0D0C22]">Weekly Summary</p>
                    <p className="mt-1 text-sm text-[#6E6D7A]">Weekly report digest.</p>
                  </div>
                  <Switch
                    checked={values.weeklySummaryEmails ?? false}
                    onCheckedChange={(next) => setValue("weeklySummaryEmails", next)}
                    label="Weekly summary emails toggle"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>}

        {/* 3) Workspace Profile */}
        {tab === "account" && <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
                <Zap size={18} className="text-[#2563EB]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">Workspace Profile</p>
                <p className="mt-1 text-sm text-[#6E6D7A]">Configure workspace-level hiring and reporting context.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="workspaceName" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                Workspace Name
              </Label>
              <Input
                id="workspaceName"
                {...register("workspaceName")}
                placeholder="Workspace name"
                aria-invalid={!!errors.workspaceName}
                className="rounded-[1.25rem] border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2.5 text-sm"
              />
              {errors.workspaceName ? <p className="text-sm text-[#EF4444]">{errors.workspaceName.message}</p> : null}
            </div>

            <Select
              label="Organization Type"
              value={values.organizationType ?? ""}
              onChange={(v) => setValue("organizationType", v, { shouldValidate: true })}
              options={organizationTypeOptions}
              placeholder="Select organization type"
              error={errors.organizationType?.message}
            />

            <Select
              label="Team Size"
              value={values.teamSize ?? ""}
              onChange={(v) => setValue("teamSize", v, { shouldValidate: true })}
              options={teamSizeOptions}
              placeholder="Select team size"
              error={errors.teamSize?.message}
            />

            <Select
              label="Hiring Volume"
              value={values.hiringVolume ?? ""}
              onChange={(v) => setValue("hiringVolume", v, { shouldValidate: true })}
              options={hiringVolumeOptions}
              placeholder="Select hiring volume"
              error={errors.hiringVolume?.message}
            />
          </div>
        </Card>}

        {/* 4) Connected Account Status */}
        {tab === "account" && <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
                <ShieldCheck size={18} className="text-[#2563EB]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">Connected Account Status</p>
                <p className="mt-1 text-sm text-[#6E6D7A]">Security and access overview (mock).</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <StatusCard
              title="Email Verified"
              value={mockUser.connected.emailVerified ? "Yes" : "No"}
              tone={mockUser.connected.emailVerified ? "success" : "danger"}
            />
            <StatusCard
              title="Two-Factor Authentication"
              value={mockUser.connected.twoFactor ? "Enabled" : "Disabled"}
              tone={mockUser.connected.twoFactor ? "success" : "warning"}
            />
            <StatusCard
              title="Active Sessions"
              value={String(mockUser.connected.activeSessions)}
              tone={mockUser.connected.activeSessions > 0 ? "primary" : "danger"}
              icon={<CreditCard size={18} aria-hidden="true" />}
            />
            <StatusCard
              title="API Access"
              value={mockUser.connected.apiAccess ? "Granted" : "Revoked"}
              tone={mockUser.connected.apiAccess ? "success" : "danger"}
              icon={<Globe size={18} aria-hidden="true" />}
            />
          </div>
        </Card>}

        {/* 5) Save changes */}
        {(tab === "profile" || tab === "account") && (
        <div className="rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#0D0C22]">Save Changes</p>
              <p className="text-sm text-[#6E6D7A]">Updates are applied to your profile preferences.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={cancelToMock}
                className="rounded-[1.25rem] border-[#E7E7E9] text-[#6E6D7A] hover:bg-[#F6F8FB]"
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[1.25rem] bg-[#2563EB] px-5 text-white hover:bg-[#1D4ED8] disabled:opacity-60"
              >
                {isSubmitting || saveState.status === "saving" ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <AnimatePresence>
              {saveState.status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-[1.25rem] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.10)] p-4"
                  role="status"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-[#22C55E]" size={18} aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-[#0D0C22]">Success</p>
                      <p className="mt-1 text-sm text-[#6E6D7A]">{saveState.message}</p>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {saveState.status === "error" ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-[1.25rem] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.10)] p-4"
                  role="alert"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-[#EF4444]" size={18} aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-[#0D0C22]">Could not save</p>
                      <p className="mt-1 text-sm text-[#6E6D7A]">{saveState.message}</p>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        )}

        {/* 6) Notifications tab */}
        {tab === "notifications" && <NotificationsTab />}

        {/* 7) API Keys tab */}
        {tab === "api-keys" && <ApiKeysTab />}

        {tab === "billing" && <BillingTab />}
        {tab === "team" && <TeamTab />}
        {tab === "danger" && <DangerTab />}
      </form>
    </div>
  );
}

function NotificationsTab() {
  type Prefs = {
    // Email
    emailAuditComplete: boolean;
    emailFairnessAlert: boolean;
    emailReportShared: boolean;
    emailWeeklyDigest: boolean;
    emailProductUpdates: boolean;
    emailSecurityAlerts: boolean;
    // In-app
    inAppAuditComplete: boolean;
    inAppFairnessAlert: boolean;
    inAppReportShared: boolean;
    inAppTeamActivity: boolean;
    // Frequency
    digestFrequency: "realtime" | "daily" | "weekly";
    quietHoursEnabled: boolean;
    quietFrom: string;
    quietTo: string;
  };

  const [prefs, setPrefs] = React.useState<Prefs>({
    emailAuditComplete: true,
    emailFairnessAlert: true,
    emailReportShared: true,
    emailWeeklyDigest: true,
    emailProductUpdates: false,
    emailSecurityAlerts: true,
    inAppAuditComplete: true,
    inAppFairnessAlert: true,
    inAppReportShared: false,
    inAppTeamActivity: true,
    digestFrequency: "daily",
    quietHoursEnabled: false,
    quietFrom: "22:00",
    quietTo: "08:00",
  });

  const set = <K extends keyof Prefs>(key: K, val: Prefs[K]) =>
    setPrefs((p) => ({ ...p, [key]: val }));

  const [saveState, setSaveState] = React.useState<
    | { status: "idle" }
    | { status: "saving" }
    | { status: "success" }
    | { status: "error" }
  >({ status: "idle" });

  const save = async () => {
    setSaveState({ status: "saving" });
    await new Promise((r) => setTimeout(r, 800));
    setSaveState({ status: "success" });
    await new Promise((r) => setTimeout(r, 1400));
    setSaveState({ status: "idle" });
  };

  const emailRows = [
    { key: "emailAuditComplete" as const,   label: "Audit complete",      desc: "When a resume audit finishes processing."              },
    { key: "emailFairnessAlert" as const,   label: "Fairness alert",      desc: "When bias or fairness risks are detected."             },
    { key: "emailReportShared" as const,    label: "Report shared",       desc: "When a report is shared with you or your team."        },
    { key: "emailWeeklyDigest" as const,    label: "Weekly digest",       desc: "A summary of audits and insights every week."          },
    { key: "emailProductUpdates" as const,  label: "Product updates",     desc: "New features, improvements, and release notes."        },
    { key: "emailSecurityAlerts" as const,  label: "Security alerts",     desc: "Unusual login activity or account changes."            },
  ];

  const inAppRows = [
    { key: "inAppAuditComplete" as const,   label: "Audit complete",      desc: "Show a notification when an audit finishes."           },
    { key: "inAppFairnessAlert" as const,   label: "Fairness alert",      desc: "Highlight fairness issues in the dashboard."           },
    { key: "inAppReportShared" as const,    label: "Report shared",       desc: "Notify when a report is shared with you."              },
    { key: "inAppTeamActivity" as const,    label: "Team activity",       desc: "Activity from teammates in your workspace."            },
  ];

  const enabledEmailCount = emailRows.filter((r) => prefs[r.key]).length;
  const enabledInAppCount = inAppRows.filter((r) => prefs[r.key]).length;

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Email on",   value: enabledEmailCount,  total: emailRows.length,  icon: <Bell size={16} className="text-[#2563EB]" /> },
          { label: "In-app on",  value: enabledInAppCount,  total: inAppRows.length,  icon: <Bell size={16} className="text-[#2563EB]" /> },
          { label: "Frequency",  value: prefs.digestFrequency.charAt(0).toUpperCase() + prefs.digestFrequency.slice(1), total: null, icon: <Bell size={16} className="text-[#2563EB]" /> },
        ].map((stat) => (
          <Card key={stat.label} className="rounded-[1.9rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_20px_50px_rgba(13,12,34,0.05)]">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
                {stat.icon}
              </span>
              <p className="text-xs font-semibold text-[#6E6D7A]">{stat.label}</p>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
              {stat.total !== null ? `${stat.value}/${stat.total}` : stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Email notifications */}
      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
              <Bell size={18} className="text-[#2563EB]" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0D0C22]">Email Notifications</p>
              <p className="mt-1 text-sm text-[#6E6D7A]">Choose which events trigger an email to your inbox.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => emailRows.forEach((r) => set(r.key, true))}
            className="hidden text-xs font-semibold text-[#2563EB] hover:underline sm:block"
          >
            Enable all
          </button>
        </div>

        <div className="mt-5 divide-y divide-[#E7E7E9] rounded-[1.5rem] border border-[#E7E7E9]">
          {emailRows.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-4 px-4 py-3.5 first:rounded-t-[1.5rem] last:rounded-b-[1.5rem] hover:bg-[#F6F8FB] transition">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0D0C22]">{row.label}</p>
                <p className="mt-0.5 text-xs text-[#6E6D7A]">{row.desc}</p>
              </div>
              <Switch checked={prefs[row.key]} onCheckedChange={(v) => set(row.key, v)} label={row.label} />
            </div>
          ))}
        </div>
      </Card>

      {/* In-app notifications */}
      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
              <Bell size={18} className="text-[#2563EB]" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0D0C22]">In-App Notifications</p>
              <p className="mt-1 text-sm text-[#6E6D7A]">Control what appears in your dashboard notification panel.</p>
            </div>
          </div>
        </div>

        <div className="mt-5 divide-y divide-[#E7E7E9] rounded-[1.5rem] border border-[#E7E7E9]">
          {inAppRows.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-4 px-4 py-3.5 first:rounded-t-[1.5rem] last:rounded-b-[1.5rem] hover:bg-[#F6F8FB] transition">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0D0C22]">{row.label}</p>
                <p className="mt-0.5 text-xs text-[#6E6D7A]">{row.desc}</p>
              </div>
              <Switch checked={prefs[row.key]} onCheckedChange={(v) => set(row.key, v)} label={row.label} />
            </div>
          ))}
        </div>
      </Card>

      {/* Digest frequency + quiet hours */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
              <Bell size={18} className="text-[#2563EB]" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0D0C22]">Digest Frequency</p>
              <p className="mt-1 text-sm text-[#6E6D7A]">How often you receive bundled notifications.</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {(["realtime", "daily", "weekly"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => set("digestFrequency", f)}
                className={
                  "rounded-[1.25rem] border px-3 py-2.5 text-sm font-semibold transition " +
                  (prefs.digestFrequency === f
                    ? "border-[#1463ff]/30 bg-[#dbe8ff] text-[#1463ff]"
                    : "border-[#E7E7E9] bg-[#F6F8FB] text-[#6E6D7A] hover:bg-white hover:text-[#0D0C22]")
                }
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </Card>

        <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
                <Bell size={18} className="text-[#2563EB]" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">Quiet Hours</p>
                <p className="mt-1 text-sm text-[#6E6D7A]">Pause notifications during a set time window.</p>
              </div>
            </div>
            <Switch
              checked={prefs.quietHoursEnabled}
              onCheckedChange={(v) => set("quietHoursEnabled", v)}
              label="Quiet hours toggle"
            />
          </div>
          <div className={"mt-5 grid grid-cols-2 gap-3 transition " + (!prefs.quietHoursEnabled ? "pointer-events-none opacity-40" : "")}>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">From</p>
              <input
                type="time"
                value={prefs.quietFrom}
                onChange={(e) => set("quietFrom", e.target.value)}
                disabled={!prefs.quietHoursEnabled}
                className="w-full rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2.5 text-sm outline-none focus:border-[#2563EB]"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">To</p>
              <input
                type="time"
                value={prefs.quietTo}
                onChange={(e) => set("quietTo", e.target.value)}
                disabled={!prefs.quietHoursEnabled}
                className="w-full rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2.5 text-sm outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Save */}
      <div className="rounded-4xl border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#0D0C22]">Save Preferences</p>
            <p className="text-sm text-[#6E6D7A]">Your notification settings will be applied immediately.</p>
          </div>
          <Button
            type="button"
            onClick={save}
            disabled={saveState.status === "saving"}
            className="rounded-[1.25rem] bg-[#2563EB] px-5 text-white hover:bg-[#1D4ED8] disabled:opacity-60"
          >
            {saveState.status === "saving" ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
        <div className="mt-4">
          <AnimatePresence>
            {saveState.status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-[1.25rem] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.10)] p-4"
                role="status"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#22C55E]" size={18} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[#0D0C22]">Saved</p>
                    <p className="mt-1 text-sm text-[#6E6D7A]">Notification preferences updated successfully.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ApiKeysTab() {
  const [apiKeys, setApiKeys] = React.useState([
    { id: "key_1", name: "Production API", created: "2024-01-15", lastUsed: "2024-01-20", active: true },
    { id: "key_2", name: "Development API", created: "2024-01-10", lastUsed: "2024-01-18", active: true },
  ]);

  const [showNewKey, setShowNewKey] = React.useState(false);
  const [newKeyName, setNewKeyName] = React.useState("");

  const handleCreateKey = () => {
    if (newKeyName.trim()) {
      const newKey = {
        id: `key_${Date.now()}`,
        name: newKeyName,
        created: new Date().toISOString().split("T")[0],
        lastUsed: "Never",
        active: true,
      };
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName("");
      setShowNewKey(false);
    }
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB]">
              <KeyRound size={18} className="text-[#2563EB]" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0D0C22]">API Keys</p>
              <p className="mt-1 text-sm text-[#6E6D7A]">Manage your API keys for programmatic access.</p>
            </div>
          </div>
          {!showNewKey && (
            <Button
              onClick={() => setShowNewKey(true)}
              className="rounded-[1.25rem] bg-[#2563EB] px-5 text-white hover:bg-[#1D4ED8] flex items-center gap-2"
            >
              <Plus size={16} />
              New Key
            </Button>
          )}
        </div>

        {showNewKey && (
          <div className="mb-6 p-4 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB]">
            <p className="text-sm font-semibold text-[#0D0C22] mb-3">Create New API Key</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter key name (e.g., Production, Development)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="flex-1 rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2.5 text-sm outline-none focus:border-[#2563EB]"
              />
              <Button
                onClick={handleCreateKey}
                disabled={!newKeyName.trim()}
                className="rounded-[1.25rem] bg-[#2563EB] px-5 text-white hover:bg-[#1D4ED8] disabled:opacity-50"
              >
                Create
              </Button>
              <Button
                onClick={() => {
                  setShowNewKey(false);
                  setNewKeyName("");
                }}
                className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-5 text-[#0D0C22] hover:bg-[#F6F8FB]"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="divide-y divide-[#E7E7E9] rounded-[1.5rem] border border-[#E7E7E9]">
          {apiKeys.map((key) => (
            <div key={key.id} className="flex items-center justify-between gap-4 px-4 py-3.5 first:rounded-t-[1.5rem] last:rounded-b-[1.5rem] hover:bg-[#F6F8FB] transition">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#0D0C22]">{key.name}</p>
                <p className="mt-0.5 text-xs text-[#6E6D7A]">Created {key.created} • Last used {key.lastUsed}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-2xl border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.10)] px-3 py-1 text-xs font-semibold text-[#22C55E]">
                  Active
                </span>
                <Button
                  onClick={() => handleDeleteKey(key.id)}
                  className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] p-2 text-[#EF4444] hover:bg-[#FEF2F2]"
                  title="Delete key"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function BillingTab() {
  const paymentMethods = [
    { id: "pm_1", brand: "Visa", last4: "4242", exp: "12/26", primary: true },
    { id: "pm_2", brand: "Mastercard", last4: "9876", exp: "08/25", primary: false },
  ];

  const invoices = [
    { id: "INV-0081", date: "May 1, 2024", amount: "$120.00", status: "Paid" },
    { id: "INV-0080", date: "Apr 1, 2024", amount: "$110.00", status: "Paid" },
    { id: "INV-0079", date: "Mar 1, 2024", amount: "$98.00", status: "Due" },
  ];

  const [selectedMethod, setSelectedMethod] = React.useState(paymentMethods[0].id);

  const activeMethod = paymentMethods.find((method) => method.id === selectedMethod) ?? paymentMethods[0];

  return (
    <div className="space-y-6">
      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-6 shadow-[0_24px_64px_rgba(13,12,34,0.03)]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
              <CreditCard size={18} className="text-[#2563EB]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0D0C22]">Billing</p>
              <p className="mt-1 text-sm text-[#6E6D7A]">
                Manage invoices, payment methods, and subscription details.
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-3 text-sm text-[#6E6D7A]">
            Next renewal: <span className="font-semibold text-[#0D0C22]">June 5, 2024</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="rounded-[1.75rem] border-[#E7E7E9] bg-[#FFFFFF] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6E6D7A]">Current invoice</p>
            <p className="mt-3 text-2xl font-semibold text-[#0D0C22]">$120.00</p>
            <p className="mt-2 text-sm text-[#6E6D7A]">Due May 1, 2024</p>
          </Card>
          <Card className="rounded-[1.75rem] border-[#E7E7E9] bg-[#FFFFFF] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6E6D7A]">Subscription plan</p>
            <p className="mt-3 text-2xl font-semibold text-[#0D0C22]">Scale</p>
            <p className="mt-2 text-sm text-[#6E6D7A]">Up to 50 users and audit reports.</p>
          </Card>
          <Card className="rounded-[1.75rem] border-[#E7E7E9] bg-[#FFFFFF] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6E6D7A]">Payment method</p>
            <p className="mt-3 text-sm font-semibold text-[#0D0C22]">
              {activeMethod.brand} •••• {activeMethod.last4}
            </p>
            <p className="mt-2 text-sm text-[#6E6D7A]">Expires {activeMethod.exp}</p>
          </Card>
        </div>
      </Card>

      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-6 shadow-[0_24px_64px_rgba(13,12,34,0.03)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#0D0C22]">Payment Methods</p>
            <p className="mt-1 text-sm text-[#6E6D7A]">Select the card for your next renewal.</p>
          </div>
          <Button className="rounded-[1.25rem] bg-[#2563EB] px-5 text-white hover:bg-[#1D4ED8]">
            Add card
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethod(method.id)}
              className={
                "w-full rounded-[1.5rem] border px-4 py-4 text-left transition " +
                (selectedMethod === method.id
                  ? "border-[#2563EB] bg-[#EFF6FF]"
                  : "border-[#E7E7E9] bg-[#F6F8FB] hover:bg-white")
              }
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#0D0C22]">
                    {method.brand} •••• {method.last4}
                  </p>
                  <p className="mt-1 text-sm text-[#6E6D7A]">Expires {method.exp}</p>
                </div>
                {method.primary ? (
                  <span className="inline-flex items-center rounded-2xl bg-[#2563EB] px-3 py-1 text-xs font-semibold text-white">
                    Primary
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-6 shadow-[0_24px_64px_rgba(13,12,34,0.03)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#0D0C22]">Recent invoices</p>
            <p className="mt-1 text-sm text-[#6E6D7A]">Review past payments and download receipts.</p>
          </div>
        </div>

        <div className="mt-5 divide-y divide-[#E7E7E9] rounded-[1.5rem] border border-[#E7E7E9]">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex flex-col gap-3 px-4 py-4 first:rounded-t-[1.5rem] last:rounded-b-[1.5rem] md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">{invoice.id}</p>
                <p className="mt-1 text-sm text-[#6E6D7A]">{invoice.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-[#0D0C22]">{invoice.amount}</p>
                <span
                  className={
                    "inline-flex rounded-2xl border px-3 py-1 text-xs font-semibold " +
                    (invoice.status === "Paid"
                      ? "border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.10)] text-[#22C55E]"
                      : "border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.10)] text-[#F59E0B]")
                  }
                >
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TeamTab() {
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [members, setMembers] = React.useState([
    { id: "m1", name: "Jordan Taylor", role: "Owner", status: "You" },
    { id: "m2", name: "Avery Blake", role: "Admin", status: "Active" },
    { id: "m3", name: "Morgan Lee", role: "Member", status: "Pending" },
  ]);

  const handleInvite = () => {
    const email = inviteEmail.trim();
    if (!email) return;
    setMembers((current) => [
      ...current,
      { id: `m_${Date.now()}`, name: email, role: "Member", status: "Invited" },
    ]);
    setInviteEmail("");
  };

  const handleRemove = (id: string) => {
    setMembers((current) => current.filter((member) => member.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-6 shadow-[0_24px_64px_rgba(13,12,34,0.03)]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
              <Users size={18} className="text-[#2563EB]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#0D0C22]">Team</p>
              <p className="mt-1 text-sm text-[#6E6D7A]">Invite members, manage roles, and keep team access up to date.</p>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-3 text-sm text-[#6E6D7A]">
            {members.length} team members, {members.filter((member) => member.status === "Pending").length} pending invites
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
            <p className="text-sm font-semibold text-[#0D0C22]">Team access</p>
            <p className="mt-2 text-sm text-[#6E6D7A]">
              Grant teammates access to audits, reports, and workspace settings.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#F6F8FB] p-4">
            <p className="text-sm font-semibold text-[#0D0C22]">Invite new member</p>
            <p className="mt-2 text-sm text-[#6E6D7A]">Send an invite to someone who should access your workspace.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="Email address"
                className="w-full rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2.5 text-sm outline-none focus:border-[#2563EB]"
              />
              <Button
                type="button"
                onClick={handleInvite}
                disabled={!inviteEmail.trim()}
                className="rounded-[1.25rem] bg-[#2563EB] px-5 text-white hover:bg-[#1D4ED8] disabled:opacity-60"
              >
                Invite
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-4xl border-[#E7E7E9] bg-[#FFFFFF] p-6 shadow-[0_24px_64px_rgba(13,12,34,0.03)]">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-[#0D0C22]">Team members</p>
            <p className="mt-1 text-sm text-[#6E6D7A]">See who has access and remove users as needed.</p>
          </div>
        </div>

        <div className="divide-y divide-[#E7E7E9] rounded-[1.5rem] border border-[#E7E7E9]">
          {members.map((member) => (
            <div key={member.id} className="flex flex-col gap-4 px-4 py-4 first:rounded-t-[1.5rem] last:rounded-b-[1.5rem] md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">{member.name}</p>
                <p className="mt-1 text-sm text-[#6E6D7A]">{member.role}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-2xl border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-1 text-xs font-semibold text-[#6E6D7A]">
                  {member.status}
                </span>
                {member.status !== "You" ? (
                  <Button
                    type="button"
                    onClick={() => handleRemove(member.id)}
                    className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2 text-sm text-[#EF4444] hover:bg-[#FEF2F2]"
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function DangerTab() {
  const [confirmText, setConfirmText] = React.useState("");
  const canDelete = confirmText === "DELETE";

  return (
    <div className="space-y-6">
      <Card className="rounded-4xl border-[#FECACA] bg-[#FEF2F2] p-6 shadow-[0_24px_64px_rgba(239,68,68,0.08)]">
        <div className="flex items-center gap-3">
          <TriangleAlert size={18} className="text-[#DC2626]" />
          <div>
            <p className="text-sm font-semibold text-[#B91C1C]">Danger Zone</p>
            <p className="mt-1 text-sm text-[#7C2D2D]">
              These actions are permanent and can’t be undone. Use caution when making changes.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="rounded-[1.75rem] border-[#FECACA] bg-[#FEF2F2] p-4">
          <p className="text-sm font-semibold text-[#B91C1C]">Export workspace data</p>
          <p className="mt-2 text-sm text-[#6E6D7A]">Generate a backup of your workspace before proceeding with destructive changes.</p>
          <Button className="mt-4 rounded-[1.25rem] bg-[#B91C1C] px-5 text-white hover:bg-[#991B1B]">
            Export data
          </Button>
        </Card>

        <Card className="rounded-[1.75rem] border-[#FECACA] bg-[#FEF2F2] p-4">
          <p className="text-sm font-semibold text-[#B91C1C]">Disable workspace</p>
          <p className="mt-2 text-sm text-[#6E6D7A]">Temporarily stop activity and sign-ins for your current workspace.</p>
          <Button className="mt-4 rounded-[1.25rem] border border-[#EF4444] bg-white px-5 text-[#EF4444] hover:bg-[#FEE2E2]">
            Disable workspace
          </Button>
        </Card>

        <Card className="rounded-[1.75rem] border-[#FECACA] bg-[#FEF2F2] p-4">
          <p className="text-sm font-semibold text-[#B91C1C]">Delete account</p>
          <p className="mt-2 text-sm text-[#6E6D7A]">Permanently delete all workspace data and remove access for everyone.</p>
          <Button className="mt-4 rounded-[1.25rem] bg-[#EF4444] px-5 text-white hover:bg-[#DC2626]">
            Delete account
          </Button>
        </Card>
      </div>

      <Card className="rounded-4xl border-[#FECACA] bg-[#FFF1F2] p-6 shadow-[0_24px_64px_rgba(239,68,68,0.08)]">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-[#0D0C22]">Confirm deletion</p>
          <p className="text-sm text-[#6E6D7A]">Type DELETE to confirm you understand that this action is irreversible.</p>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="text"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full rounded-[1.25rem] border border-[#E7E7E9] bg-[#FFFFFF] px-4 py-2.5 text-sm outline-none focus:border-[#DC2626]"
            />
            <Button
              type="button"
              disabled={!canDelete}
              className="rounded-[1.25rem] bg-[#EF4444] px-5 text-white hover:bg-[#DC2626] disabled:opacity-50"
            >
              Confirm delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StatusCard({
  title,
  value,
  tone,
  icon,
}: {
  title: string;
  value: string;
  tone: "success" | "warning" | "danger" | "primary";
  icon?: React.ReactNode;
}) {
  const vis =
    tone === "success"
      ? { bg: "rgba(34,197,94,0.10)", fg: "#22C55E", border: "rgba(34,197,94,0.25)" }
      : tone === "warning"
        ? { bg: "rgba(245,158,11,0.10)", fg: "#F59E0B", border: "rgba(245,158,11,0.25)" }
        : tone === "danger"
          ? { bg: "rgba(239,68,68,0.10)", fg: "#EF4444", border: "rgba(239,68,68,0.25)" }
          : { bg: "rgba(37,99,235,0.10)", fg: "#2563EB", border: "rgba(37,99,235,0.25)" };

  return (
    <div
      className="rounded-[1.5rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4"
      role="group"
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#0D0C22]">{title}</p>
          <div className="mt-3" />
          <p className="text-sm text-[#6E6D7A]">{value}</p>
        </div>
        <div className="flex items-center gap-2">
          {icon ? (
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F6F8FB] border border-[#E7E7E9]">
              {icon}
            </span>
          ) : null}
          <span
            className="inline-flex items-center rounded-2xl border px-3 py-1 text-xs font-semibold"
            style={{ background: vis.bg, color: vis.fg, borderColor: vis.border }}
          >
            {tone === "success" ? "OK" : tone === "warning" ? "Review" : tone === "danger" ? "Risk" : "Active"}
          </span>
        </div>
      </div>
    </div>
  );
}
