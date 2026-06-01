"use client";

import React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function Loading() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative min-h-dvh w-full overflow-hidden bg-[#FFFFFF] text-[#0D0C22]"
      role="presentation"
    >
      {/* Premium gradient backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -80px, rgba(37, 99, 235, 0.18), transparent 55%), radial-gradient(900px 500px at 15% 20%, rgba(37, 99, 235, 0.10), transparent 50%), radial-gradient(800px 480px at 85% 30%, rgba(37, 99, 235, 0.08), transparent 55%)",
        }}
      />

      {/* Subtle stripe texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.65]"
        style={{
          backgroundImage:
            "linear-gradient(transparent 0 49px, rgba(37, 99, 235, 0.06) 49px 50px)",
          backgroundSize: "100% 50px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 70%)",
        }}
      />

      <main
        className="relative z-10 flex min-h-dvh items-center justify-center px-4"
        role="main"
      >
        <section
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="w-full max-w-lg"
        >
          {/* Top badge-like shimmer */}
          <div className="mb-8 flex items-center justify-center">
            <div className="relative inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white/70 px-4 py-2 shadow-[0_10px_30px_-15px_rgba(13,12,34,0.35)] backdrop-blur">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full opacity-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.18) 50%, rgba(37, 99, 235, 0) 100%)",
                }}
              />
              <span
                className="h-2 w-2 rounded-full bg-[#2563EB] shadow-[0_0_0_6px_rgba(37,99,235,0.15)]"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-[#0D0C22]/90">
                BiasLens loading experience
              </p>
            </div>
          </div>

          {/* Logo + premium pulse */}
          <div className="flex flex-col items-center gap-6">
            <motion.div
              aria-hidden="true"
              className="relative"
              initial={{ scale: 0.98, opacity: 0.65 }}
              animate={
                reduceMotion
                  ? { scale: 1, opacity: 1 }
                  : { scale: [1, 1.04, 1], opacity: [0.85, 1, 0.9] }
              }
              transition={
                reduceMotion
                  ? { duration: 0.2 }
                  : { duration: 1.6, times: [0, 0.4, 1], ease: "easeOut" }
              }
            >
              {/* Outer glow */}
              <div
                className="absolute -inset-6 rounded-full"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(37,99,235,0.35), rgba(37,99,235,0.0) 62%)",
                  filter: "blur(6px)",
                }}
              />

              {/* Simple inline logo (no dependency on assets) */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0D0C22] shadow-[0_22px_70px_-28px_rgba(13,12,34,0.7)] ring-1 ring-white/10">
                <motion.div
                  className="relative"
                  animate={
                    reduceMotion
                      ? undefined
                      : { rotate: [0, 6, 0], scale: [1, 1.03, 1] }
                  }
                  transition={
                    reduceMotion
                      ? undefined
                      : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                  }
                >
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="BiasLens logo"
                  >
                    <path
                      d="M10.2 28.6V15.4C10.2 13.8 11.5 12.5 13.1 12.5H30.9C32.5 12.5 33.8 13.8 33.8 15.4V28.6C33.8 30.2 32.5 31.5 30.9 31.5H13.1C11.5 31.5 10.2 30.2 10.2 28.6Z"
                      stroke="white"
                      strokeOpacity="0.18"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M14.2 29V16.8C14.2 15.9 14.9 15.2 15.8 15.2H28.6C29.5 15.2 30.2 15.9 30.2 16.8V29"
                      stroke="#2563EB"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.5 26.2L25.9 18.8"
                      stroke="#2563EB"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20.2 18.8H26.0V24.6"
                      stroke="#2563EB"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            <div className="text-center">
              <h1 className="text-balance text-2xl font-semibold tracking-tight text-[#0D0C22]">
                Loading BiasLens...
              </h1>
              <p className="mt-2 text-sm text-[#6E6D7A]">
                Preparing explainable AI insights
              </p>
            </div>

            {/* Progress shimmer bars */}
            <div className="w-full pt-2">
              <div className="space-y-3">
                {[
                  { w: "100%", h: 10, idx: 0 },
                  { w: "92%", h: 10, idx: 1 },
                  { w: "84%", h: 10, idx: 2 },
                ].map(({ w, h, idx }) => (
                  <div key={idx} className="relative">
                    <div
                      className="h-2.5 w-full rounded-full bg-[#0D0C22]/[0.06]"
                      aria-hidden="true"
                      style={{ height: h }}
                    />

                    <AnimatePresence initial={false}>
                      <motion.div
                        aria-hidden="true"
                        className="absolute top-0 left-0 h-2.5 rounded-full"
                        style={{
                          width: w,
                          height: h,
                          background:
                            "linear-gradient(90deg, rgba(37,99,235,0.0) 0%, rgba(37,99,235,0.55) 45%, rgba(37,99,235,0.0) 100%)",
                          boxShadow:
                            "0 0 0 1px rgba(37,99,235,0.12) inset, 0 18px 60px -30px rgba(37,99,235,0.7)",
                        }}
                        initial={{ x: "-110%", opacity: 0.35 }}
                        animate={
                          reduceMotion
                            ? { x: 0, opacity: 1 }
                            : { x: ["-110%", "110%"], opacity: [0.2, 0.95, 0.25] }
                        }
                        transition={
                          reduceMotion
                            ? { duration: 0.2 }
                            : {
                                duration: 1.35 + idx * 0.18,
                                repeat: 0,
                                ease: "easeInOut",
                                delay: idx * 0.12,
                              }
                        }
                      />
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Reduced-motion friendly static progress */}
              <div className="mt-4" aria-hidden="true">
                <div className="h-0.5 w-full rounded-full bg-[#0D0C22]/[0.08]">
                  <div
                    className="h-0.5 w-[65%] rounded-full bg-[#2563EB]/70"
                    style={{
                      boxShadow:
                        "0 0 0 1px rgba(37,99,235,0.18) inset, 0 0 30px rgba(37,99,235,0.18)",
                    }}
                  />
                </div>
              </div>

              <div className="sr-only">Preparing explainable AI insights.</div>
            </div>

            <p className="mt-6 text-center text-xs text-[#6E6D7A]">
              Tip: You can keep exploring while components initialize.
            </p>
          </div>
        </section>
      </main>

      {/* Subtle shimmer glow at bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-[120%] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(180deg, rgba(37,99,235,0.0) 0%, rgba(37,99,235,0.16) 40%, rgba(37,99,235,0.0) 100%)",
          filter: "blur(14px)",
          opacity: 0.9,
        }}
      />
    </div>
  );
}

