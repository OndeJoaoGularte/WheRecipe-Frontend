import type { Metadata } from "next";
import { Quicksand, Spline_Sans } from "next/font/google";
import "./globals.css";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${quicksand.variable} ${splineSans.variable} h-full antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
