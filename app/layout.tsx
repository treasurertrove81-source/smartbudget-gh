import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SmartBudget GH",
  description: "Personal budget management dashboard for Ghanaian households",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
