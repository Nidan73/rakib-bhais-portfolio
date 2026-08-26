import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rakib — Study Abroad Executive, Dhaka",
  description:
    "Study abroad executive placing Bangladeshi students in Ireland and the UK. Counsellor training, UK Student Route compliance, and partnership enquiries.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
