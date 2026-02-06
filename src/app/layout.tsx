import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Be My Valentine?",
  description: "A special question for a special person",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
