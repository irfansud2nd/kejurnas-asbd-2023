"use client";
import TopBar from "@/components/TopBar";
import "./globals.css";
import { ContextProvider } from "@/context/Context";
import Footer from "@/components/Footer";
import BackgroundImage from "@/components/BackgroundImage";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-sm md:text-base font-inter min-h-screen grid grid-rows-[auto_1fr_auto]">
        <div className="w-screen h-screen overflow-hidden absolute -z-10">
          <img
            src="/images/bg-bw.png"
            alt="bg-bw"
            className="h-full w-full object-cover"
          />
        </div>
        <ContextProvider>
          <TopBar />
          {children}
          <Footer />
        </ContextProvider>
      </body>
    </html>
  );
}
