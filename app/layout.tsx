import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Binary 01",
  description: "Binary 01 local AI assistant",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
