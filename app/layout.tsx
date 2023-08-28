import ModalProvider from "@/providers/modal-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Provider from "@/providers/session-provider";

const montserrat = Montserrat({ subsets: ["latin"] });

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
      <body className={montserrat.className}>
        <Provider>
          <Toaster />
          <ModalProvider />
          {children}
        </Provider>
      </body>
    </html>
  );
}
