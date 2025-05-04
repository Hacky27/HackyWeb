import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HACKY SECURITY",
  description: "At Hacky Security, we offer expertly crafted courses and cybersecurity services to help you stay ahead in the cybersecurity and web development fields. Whether you’re a beginner or an advanced learner, we have something for you.",
  icons: {
    icon: "/logo1.png", // Path to your favicon inside the public folder
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body cz-shortcut-listen="true"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
