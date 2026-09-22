import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pinheiro Pets",
  description:
    "Projeto educacional de extensão universitária voltado à causa animal no Distrito Federal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}