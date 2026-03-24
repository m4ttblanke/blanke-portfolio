import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { ConvexClientProvider } from "@/components/convex-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matt Blanke",
  description: "CS student and software engineer.",
  openGraph: {
    title: "Matt Blanke",
    description: "CS student and software engineer.",
    url: "https://blanke-portfolio.vercel.app",
    siteName: "Matt Blanke",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthKitProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </AuthKitProvider>
      </body>
    </html>
  );
}
