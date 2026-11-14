import type { Metadata } from "next";
import { Quicksand, Spline_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

const splineSans = Spline_Sans({
  subsets: ["latin"],
  variable: "--font-spline",
});

export const metadata: Metadata = {
  title: "WheRecipe",
  description: "Descubra receitas com os ingredientes que você tem em casa.",
  icons: {
    icon: "/brand/logo.png",
    apple: "/brand/logo-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${quicksand.variable} ${splineSans.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
