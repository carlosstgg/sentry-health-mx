import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import AppHeader from "@/components/AppHeader";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SentryHealth MX",
  description:
    "PWA de monitoreo biométrico para pacientes con enfermedades crónicas en México.",
  manifest: "/manifest.json",
  applicationName: "SentryHealth MX",
};

export const viewport: Viewport = {
  themeColor: "#e11d48",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-zinc-900">
        <ServiceWorkerRegistration />
        <AuthProvider>
          <AppHeader />
          {children}
          <footer className="border-t border-zinc-200 px-6 py-8">
            <p className="mx-auto w-full max-w-5xl text-center text-sm text-zinc-500">
              SentryHealth MX · Alineado con el ODS 3: Salud y Bienestar
            </p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
