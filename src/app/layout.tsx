import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrainSpace - AI-Powered Interactive Whiteboard",
  description: "Collaborate, create, and innovate with AI-driven interactive whiteboards. Perfect for students, educators, and businesses.",
  keywords: "whiteboard, collaboration, AI, education, business, mindmap, calendar",
  authors: [{ name: "BrainSpace Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
