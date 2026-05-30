"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Features", href: "/features" },
  { label: "AI Agent", href: "/ai-agent" },
  { label: "Resume AI", href: "/resume-ai" },
  { label: "About Us", href: "/about-us" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Resume AI");

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-10"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center justify-between rounded-[1.6rem] border border-[color:var(--border)] bg-white/78 px-4 py-3 shadow-[0_20px_60px_rgba(13,12,34,0.08)] backdrop-blur-xl sm:px-6 lg:px-8">

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/"
                className="flex items-center gap-3 rounded-full pr-4 transition hover:opacity-90"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full">
                  <img
                    src="/logo.png"
                    alt="BiasLens logo"
                    width={44}
                    height={44}
                    className="h-5 w-5"
                    loading="eager"
                  />
                </span>
                <span className="text-[1.05rem] font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">
                  BiasLens
                </span>
              </Link>
            </motion.div>

            {/* Desktop Nav Links */}
            <motion.div
              className="hidden items-center gap-2 bg-white/72 px-2 py-1 lg:flex"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {navItems.map((item, i) => {
                const isActive = activeItem === item.label;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.28 + i * 0.06, ease: "easeOut" }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setActiveItem(item.label)}
                      className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-[color:var(--primary-soft)] text-[color:var(--primary)]"
                          : "text-[color:var(--foreground-secondary)] hover:bg-[#F7F9FC] hover:text-[color:var(--foreground)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Desktop Buttons */}
            <motion.div
              className="hidden items-center gap-3 lg:flex"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button asChild variant="ghost" className="h-10 px-4">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild className="h-10 px-5 hover:-translate-y-0.5 text-white">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </motion.div>

            {/* Mobile Hamburger */}
            <motion.button
              type="button"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-white/85 text-[color:var(--foreground)] transition hover:border-[#C8D5F6] hover:bg-[#F8FAFF] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.92 }}
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                    mobileOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition duration-200 ${
                    mobileOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition duration-300 ${
                    mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[rgba(13,12,34,0.18)] backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-[88vw] max-w-sm flex-col border-l border-[color:var(--border)] bg-white/95 px-6 pb-8 pt-6 shadow-[0_30px_80px_rgba(13,12,34,0.18)] backdrop-blur-2xl lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden={!mobileOpen}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0f1117]">
                  <img
                    src="/logo.png"
                    alt="BiasLens logo"
                    width={44}
                    height={44}
                    className="h-5 w-5"
                    loading="eager"
                  />
                </span>
                <span className="text-lg font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">
                  BiasLens
                </span>
              </div>
              <button
                type="button"
                onClick={closeMobile}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--border)] text-[color:var(--foreground-secondary)] transition hover:bg-[#F7F9FC] hover:text-[color:var(--foreground)]"
                aria-label="Close navigation menu"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            </div>

            {/* Drawer Nav Links */}
            <div className="mt-8 flex flex-1 flex-col gap-2">
              {navItems.map((item, i) => {
                const isActive = activeItem === item.label;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.06 + i * 0.07, ease: "easeOut" }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => {
                        setActiveItem(item.label);
                        closeMobile();
                      }}
                      className={`block rounded-2xl px-4 py-3 text-base font-medium transition ${
                        isActive
                          ? "bg-[color:var(--primary-soft)] text-[color:var(--primary)]"
                          : "text-[color:var(--foreground-secondary)] hover:bg-[#F7F9FC] hover:text-[color:var(--foreground)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Drawer CTA Buttons */}
            <motion.div
              className="mt-8 flex flex-col gap-3 border-t border-[color:var(--border)] pt-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: 0.28, ease: "easeOut" }}
            >
              <Button asChild variant="outline" className="h-11 w-full">
                <Link href="/signin" onClick={closeMobile}>
                  Sign In
                </Link>
              </Button>
              <Button asChild className="h-11 w-full">
                <Link href="/signup" onClick={closeMobile}>
                  Sign Up
                </Link>
              </Button>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}