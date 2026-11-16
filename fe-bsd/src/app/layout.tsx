import type { Metadata, Viewport } from "next";
import { OfflineBanner } from "@/components/offline-banner";
import { PwaRegister } from "@/components/pwa-register";
import { Inter, Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Inter dan Plus Jakarta Sans dipakai desain Figma pada layar auth/onboarding (label, kartu fitur).
const inter = Inter({
  variable: "--font-inter-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta-face",
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
  icons: { apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "BSD", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#00c65c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${inter.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-surface font-sans text-foreground">
        {children}
        <OfflineBanner />
        <PwaRegister />
      </body>
    </html>
  );
}
