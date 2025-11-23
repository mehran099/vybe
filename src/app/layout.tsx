import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/auth/AuthProvider";
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
  title: "Vybe - Social Chat & Collaboration",
  description: "Connect, chat, and collaborate with friends. Real-time messaging, voice calls, whiteboards, and more.",
  keywords: ["social", "chat", "collaboration", "messaging", "voice calls", "whiteboard"],
  authors: [{ name: "Vybe Team" }],
  openGraph: {
    title: "Vybe - Social Chat & Collaboration",
    description: "Connect, chat, and collaborate with friends in real-time",
    type: "website",
    url: "https://vybe.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vybe - Social Chat & Collaboration",
    description: "Connect, chat, and collaborate with friends in real-time",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
