import type { Metadata } from "next";
import { Geist, Geist_Mono,Poppins } from "next/font/google";
import "./../globals.css";
import Navbar from "@/components/home/Navbar";
import BottomBar from "@/components/home/BottomBar";
import Sidebar from "@/components/home/Sidebar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"], // choose weights you need
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "DLiria Verse ",
  description: "Share memories",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}`}
      >
        <Navbar />

        {/* Flex container for sidebar + content */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden md:block w-[250px] border-r h-screen fixed top-[90px] left-0">
            <Sidebar />
          </aside>

          {/* Page content */}
          <main className="md:ml-[250px] w-full">
            {children}
          </main>
        </div>

        <BottomBar />
      </body>
    </html>
  );
}

