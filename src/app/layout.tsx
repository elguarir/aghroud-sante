import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import clsx from "clsx";
import { TRPCReactProvider } from "@/trpc/react";
import { NextUIThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-dvh bg-background text-foreground antialiased",
          GeistSans.className,
          GeistMono.variable,
        )}
      >
        <NextUIThemeProvider
          themeProps={{ attribute: "class", defaultTheme: "light" }}
        >
          <TRPCReactProvider>
            <main className="relative flex min-h-screen flex-col">
              {children}
              <Toaster />
            </main>
          </TRPCReactProvider>
        </NextUIThemeProvider>
      </body>
    </html>
  );
}
