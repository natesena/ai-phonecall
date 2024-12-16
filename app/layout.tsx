import Provider from "@/app/provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthWrapper from "@/components/wrapper/auth-wrapper";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import Script from "next/script";
import TiktokPixel from "@/components/pixels/tiktok-pixel";
import "./globals.css";
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '@/lib/auth/next-auth-options'
import ProtectedRoute from "@/utils/protected-route";
const siteDescription = "Have a real phone call with Santa.";
const siteName = "CallSanta.Shop";

export const metadata: Metadata = {
  metadataBase: new URL("https://callsanta.shop"),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    description: siteDescription,
    images: [
      "https://storage.googleapis.com/tnc-public-files/images/CallSantaOpenGraph.png",
    ],
    url: "https://callsanta.shop/",
  },
  twitter: {
    card: "summary_large_image",
    title: "CallSanta.Shop",
    description: siteDescription,
    siteId: "",
    creator: "",
    creatorId: "",
    images: [
      "https://storage.googleapis.com/tnc-public-files/images/CallSantaOpenGraph.png",
    ],
  },
};

export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
      const session = await getServerSession(nextAuthOptions);
      console.log(session)
    return (
      <AuthWrapper session={session}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Lobster&display=swap"
            rel="stylesheet"
          />
          {/* Google tag (gtag.js) */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=AW-16801404348"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16801404348');
            `}
          </Script>
          <TiktokPixel />
        </head>
        <body className={GeistSans.className}>
          <Provider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </Provider>
          <Analytics />
        </body>
      </html>
    </AuthWrapper>
  );
}
