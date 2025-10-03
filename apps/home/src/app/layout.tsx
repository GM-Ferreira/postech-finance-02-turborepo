import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ReduxProvider } from "@repo/ui";

import { AuthProvider } from "@/context/AuthContext";
import { TransactionsProvider } from "@/context/TransactionsContext";

import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Postech Finance App",
  description: "Melhor local para sua gestão financeira",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${inter.variable}`}>
        <ReduxProvider>
          <AuthProvider>
            <TransactionsProvider>
              <Header />
              {children}
            </TransactionsProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
