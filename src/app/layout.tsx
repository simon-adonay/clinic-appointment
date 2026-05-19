import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClinicFlow",
  description: "Patient management, scheduling, AI follow-up reminders, and billing for modern clinics."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
