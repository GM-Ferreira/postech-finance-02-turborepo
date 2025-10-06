import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ReduxProvider } from "@repo/ui";

import { AuthProvider } from "@/context/AuthContext";
import { TransactionsProvider } from "@/context/TransactionsContext";
import { ToastProvider } from "@/context/ToastContext";

import "./globals.css";
import Header from "@/components/layout/Header";
import SlowApiToast from "@/components/toast/SlowApiToast";

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
          <ToastProvider>
            <AuthProvider>
              <TransactionsProvider>
                <Header />
                {children}
                <SlowApiToast />
              </TransactionsProvider>
            </AuthProvider>
          </ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
