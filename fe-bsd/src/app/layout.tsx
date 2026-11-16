import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bank Sampah Digital",
    template: "%s | Bank Sampah Digital",
  },
  description:
    "Platform digital untuk mengajukan setoran sampah, menimbang, dan memantau transaksi Bank Sampah.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${poppins.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-surface font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
