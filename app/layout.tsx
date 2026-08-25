import type { Metadata } from "next";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { ConvexClientProvider } from "@/components/convex-provider";

export const metadata: Metadata = {
  title: "Matt Blanke",
  description: "CS student and software engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthKitProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </AuthKitProvider>
      </body>
    </html>
  );
}
