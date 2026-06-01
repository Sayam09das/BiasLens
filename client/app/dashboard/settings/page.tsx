"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  value: string;
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
        value={value}
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const values = watch();

  const avatarPreview = React.useMemo(() => {
    // For mock UX, we just show initials when no upload.
    if (!values.avatarFileName) return null;
    const parts = (values.fullName || "").trim().split(/\s+/).filter(Boolean);
    const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
    return { initials };
  }, [values.avatarFileName, values.fullName]);

  const onSubmit = async (data: SettingsFormValues) => {
    setSaveState({ status: "saving" });

    try {
      // Mock async save
      await new Promise((r) => setTimeout(r, 900));

      // Example: validate that email isn’t the same for demo (no-op)
      if (!data.workEmail.includes("@")) {
        throw new Error("Please enter a valid email.");
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

    setSaveState({ status: "idle" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22]">Profile</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6E6D7A]">
            Manage your profile, account preferences, and workspace configuration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-3 py-2 text-sm text-[#6E6D7A]">
            <span className="font-semibold text-[#0D0C22]">Secure</span> settings
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="User settings form">
        {/* 1) Profile Information */}
        <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
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
                aria-invalid={!!errors.workEmail}
                className="rounded-[1.25rem] border-[#E7E7E9] bg-[#F6F8FB] px-4 py-2.5 text-sm"
              />
              {errors.workEmail ? <p className="text-sm text-[#EF4444]">{errors.workEmail.message}</p> : null}
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
                  <p className="mt-1 text-sm text-[#6E6D7A]">Mock upload (filename stored locally).</p>
                </div>
                <div className="flex h-12 items-center justify-end">
                  <div className="relative">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#E7E7E9] bg-[#FFFFFF] text-[#2563EB]">
                      {avatarPreview ? (
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
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setValue("avatarFileName", file?.name ?? undefined, { shouldValidate: true });
                }}
              />
            </div>
          </div>
        </Card>

        {/* 2) Account Preferences */}
        <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
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
              value={values.defaultDashboardView}
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
                    checked={values.emailNotifications}
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
                    checked={values.productUpdateEmails}
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
                    checked={values.auditReportEmails}
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
                    checked={values.weeklySummaryEmails}
                    onCheckedChange={(next) => setValue("weeklySummaryEmails", next)}
                    label="Weekly summary emails toggle"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 3) Workspace Profile */}
        <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
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
              value={values.organizationType}
              onChange={(v) => setValue("organizationType", v, { shouldValidate: true })}
              options={organizationTypeOptions}
              placeholder="Select organization type"
              error={errors.organizationType?.message}
            />

            <Select
              label="Team Size"
              value={values.teamSize}
              onChange={(v) => setValue("teamSize", v, { shouldValidate: true })}
              options={teamSizeOptions}
              placeholder="Select team size"
              error={errors.teamSize?.message}
            />

            <Select
              label="Hiring Volume"
              value={values.hiringVolume}
              onChange={(v) => setValue("hiringVolume", v, { shouldValidate: true })}
              options={hiringVolumeOptions}
              placeholder="Select hiring volume"
              error={errors.hiringVolume?.message}
            />
          </div>
        </Card>

        {/* 4) Connected Account Status */}
        <Card className="rounded-[2rem] border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
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
        </Card>

        {/* 5) Save changes */}
        <div className="rounded-[2rem] border border-[#E7E7E9] bg-[#FFFFFF] p-4 shadow-[0_24px_64px_rgba(13,12,34,0.03)] sm:p-6">
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
      </form>
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
            className="inline-flex items-center rounded-[1rem] border px-3 py-1 text-xs font-semibold"
            style={{ background: vis.bg, color: vis.fg, borderColor: vis.border }}
          >
            {tone === "success" ? "OK" : tone === "warning" ? "Review" : tone === "danger" ? "Risk" : "Active"}
          </span>
        </div>
      </div>
    </div>
  );
}

