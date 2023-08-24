import ModalProvider from "@/providers/modal-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Provider from "@/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard for controlling EASTore website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("1")
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Toaster />
          <ModalProvider />
          {children}
        </Provider>
      </body>
    </html>
  );
}
