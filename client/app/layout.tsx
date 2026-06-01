import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/globals.css";
import { Providers } from "../providers/Providers";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const monaSans = localFont({
  src: [
    {
      path: "../public/fonts/Mona-Sans-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Mona-Sans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Mona-Sans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Mona-Sans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Mona-Sans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mona-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "BiasLens | Responsible Hiring Intelligence",
    template: "%s | BiasLens",
  },
  description:
    "BiasLens helps teams audit resumes, explain model decisions, review fairness signals, and deliver production-ready hiring intelligence.",
  applicationName: "BiasLens",
  keywords: [
    "BiasLens",
    "resume screening",
    "fair hiring",
    "AI audit",
    "ML explainability",
    "ATS intelligence",
  ],
  authors: [{ name: "BiasLens" }],
  creator: "BiasLens",
  publisher: "BiasLens",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  manifest: "/favicons/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/favicons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      {
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "BiasLens | Responsible Hiring Intelligence",
    description:
      "Audit resumes, explain predictions, and surface fairness signals with a production-ready hiring intelligence platform.",
    url: appUrl,
    siteName: "BiasLens",
    type: "website",
    images: [
      {
        url: "/images/Heroimg.png",
        width: 1200,
        height: 630,
        alt: "BiasLens hiring intelligence dashboard illustration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BiasLens | Responsible Hiring Intelligence",
    description:
      "Production-ready resume audit, explainability, and fairness workflows for modern hiring teams.",
    images: ["/images/Heroimg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${monaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><Providers>{children}</Providers></body>
    </html>
  );
}
