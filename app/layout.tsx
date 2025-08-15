import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/ui/header";

export const metadata: Metadata = {
  title: "AI College Essay Reviewer",
  description: "AI-powered essay editing with suggestions",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />  {/* ← Shows on ALL pages */}
        {children}
      </body>
    </html>
  );
} 