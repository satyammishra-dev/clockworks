import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./header";
import Footer from "./footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Clockworks by react-custom-clock",
  description:
    "Clockworks by react-custom-clock lets you design clocks your way to use in your React apps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col items-center justify-between h-[100vh]`}
      >
        <Header />
        <main className="mt-12 w-full flex flex-col items-center justify-start">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
