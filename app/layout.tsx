import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Montserrat_Alternates } from "next/font/google";
import { LanguageProvider } from "./_components/i18n/language-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
});

const montserratAlternates = Montserrat_Alternates({
  variable: "--font-montserrat-alternates",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Sun* Annual Awards 2025",
  description: "Sun* Annual Awards 2025 — Root Further.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${montserratAlternates.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Client i18n boundary only -- layout stays a Server Component, `metadata`
            above is unaffected. `<html lang>` stays "en" this cycle (see
            language-provider.tsx doc comment / technical-spec.md U1). */}
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
