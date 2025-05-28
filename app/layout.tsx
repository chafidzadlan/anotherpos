import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { POSToastProvider } from "@/hooks/use-toast";
import Providers from "@/app/providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POS Supermarket",
  description: "Modern Point of Sale System for Supermarket Management",
  keywords: ["POS", "supermarket", "management", "retail"],
  authors: [{ name: "POS Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-inter antialiased">
        <div className="flex min-h-screen flex-col">
          <Providers>
            <main className="flex-1 flex flex-col">
              <POSToastProvider>
                {children}
              </POSToastProvider>
            </main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
