import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pinheiro Pets",
  description:
    "Plataforma educacional de extensão universitária para divulgação de pets perdidos, adoção responsável e apoio a ONGs de proteção animal no Distrito Federal.",
  icons: {
    icon: "/branding/pinheiro-pets-logo.png",
    shortcut: "/branding/pinheiro-pets-logo.png",
    apple: "/branding/pinheiro-pets-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}