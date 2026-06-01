'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { MdVerified } from 'react-icons/md';
import { HiShieldCheck } from 'react-icons/hi2';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { MdOutlineWork } from 'react-icons/md';


export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#FFFFFF] text-[#0D0C22] border-t border-[#E7E7E9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              aria-label="BiasLens home"
              className="inline-flex items-center gap-3 group"
            >
              <span
                aria-hidden="true"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7E7E9] bg-white shadow-sm transition-transform duration-300 group-hover:translate-y-[-2px]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#2563EB]/20 via-[#2563EB]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <HiOutlineSparkles className="h-5 w-5 text-[#2563EB] relative" aria-hidden="true" />
              </span>

              <span className="text-lg font-semibold tracking-tight">BiasLens</span>
            </Link>

            <p className="mt-4 max-w-[44ch] text-sm leading-6 text-[#6E6D7A]">
              AI-powered resume auditing, explainability, and fairness intelligence for modern hiring teams.
            </p>

            {/* Additional Enterprise Elements */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-[#E7E7E9] bg-white p-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB]/10">
                  <MdVerified className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-5">Responsible AI</div>
                  <div className="text-xs leading-5 text-[#6E6D7A]">Fairness-first auditing</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-[#E7E7E9] bg-white p-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB]/10">
                  <HiShieldCheck className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-5">Security & Privacy</div>
                  <div className="text-xs leading-5 text-[#6E6D7A]">Protected hiring workflows</div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-[#E7E7E9] bg-white p-3 sm:col-span-2">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB]/10">
                  <MdOutlineWork className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
                </div>

                <div>
                  <div className="text-sm font-semibold leading-5">Compliance Ready</div>
                  <div className="text-xs leading-5 text-[#6E6D7A]">
                    Governance-friendly reporting for transparent decisions
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <nav aria-label="Product">
                <div className="text-sm font-semibold tracking-tight">Product</div>
                <ul className="mt-4 space-y-3">
                  {[
                    ['Home', '/'],
                    ['Features', '/features'],
                    ['AI Agent', '/ai-agent'],
                    ['Sign In', '/login'],
                    ['Get Started', '/register'],
                  ].map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="group inline-flex items-center text-sm text-[#6E6D7A] transition-colors duration-200 hover:text-[#0D0C22]"
                      >
                        <span className="relative">
                          {label}
                          <span
                            aria-hidden="true"
                            className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-[#2563EB] transition-transform duration-200 group-hover:scale-x-100"
                          />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label="Resources">
                <div className="text-sm font-semibold tracking-tight">Resources</div>
                <ul className="mt-4 space-y-3">
                  {[
                    ['Resume Intelligence', '/features'],
                    ['Fairness Workflows', '/features'],
                    ['Audit Automation', '/ai-agent'],
                    ['Secure Access', '/login'],
                  ].map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="group inline-flex items-center text-sm text-[#6E6D7A] transition-colors duration-200 hover:text-[#0D0C22]"
                      >
                        <span className="relative">
                          {label}
                          <span
                            aria-hidden="true"
                            className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-[#2563EB] transition-transform duration-200 group-hover:scale-x-100"
                          />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label="Company">
                <div className="text-sm font-semibold tracking-tight">Company</div>
                <ul className="mt-4 space-y-3">
                  {[
                    ['About BiasLens', '/'],
                    ['Responsible AI', '/features'],
                    ['Automation', '/ai-agent'],
                    ['Create Account', '/register'],
                  ].map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="group inline-flex items-center text-sm text-[#6E6D7A] transition-colors duration-200 hover:text-[#0D0C22]"
                      >
                        <span className="relative">
                          {label}
                          <span
                            aria-hidden="true"
                            className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-[#2563EB] transition-transform duration-200 group-hover:scale-x-100"
                          />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label="Legal" className="sm:col-span-2 lg:col-span-3">
                <div className="text-sm font-semibold tracking-tight">Legal</div>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                  {[
                    ['Register', '/register'],
                    ['Login', '/login'],
                    ['Features', '/features'],
                  ].map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="group inline-flex items-center text-sm text-[#6E6D7A] transition-colors duration-200 hover:text-[#0D0C22]"
                      >
                        <span className="relative">
                          {label}
                          <span
                            aria-hidden="true"
                            className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-[#2563EB] transition-transform duration-200 group-hover:scale-x-100"
                          />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Social Links */}
            <div className="mt-10">
              <div className="text-sm font-semibold tracking-tight">Social</div>
              <ul className="mt-4 flex flex-wrap items-center gap-3">
                {[
                  { label: 'GitHub', href: 'https://github.com', Icon: FaGithub },
                  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: FaLinkedinIn },
                  { label: 'X (Twitter)', href: 'https://x.com', Icon: FaXTwitter },
                ].map(({ label, href, Icon }) => ( 
                  <li key={label}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="group inline-flex h-11 items-center justify-center rounded-2xl border border-[#E7E7E9] bg-white px-4 transition-all duration-200 hover:border-[#2563EB]/50 hover:shadow-sm"
                    >
                      <span className="sr-only">{label}</span>
                      <Icon
                        className="h-5 w-5 text-[#0D0C22] transition-colors duration-200 group-hover:text-[#2563EB]"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#E7E7E9] pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#6E6D7A]">
              Copyright © {year} BiasLens.{' '}
              <span className="text-[#0D0C22] font-medium">Built for Transparent Hiring</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E7E9] bg-white px-3 py-1.5">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"
                />
                <span className="text-xs font-semibold text-[#0D0C22]">All Systems Operational</span>
              </span>
            </div>
          </div>

          <div className="sr-only" aria-live="polite">
            Footer status: All Systems Operational.
          </div>
        </div>
      </div>
    </footer>
  );
}
