import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI College Essay Reviewer",
  description: "AI-powered essay editing with suggestions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
} 