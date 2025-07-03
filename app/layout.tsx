import HeaderUserMenu from "@/components/ui/header-user-menu";
import { checkDbConnection } from "@/lib/dbUtils";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Questack",
  description: "Your question stack app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDbHealthy = await checkDbConnection();
  return (
    <html lang="en" className="dark">
      <body
        className={`bg-zinc-950 text-zinc-100 ${geistSans.variable} ${geistMono.variable}`}
      >
        <div className="flex flex-col h-screen w-screen overflow-hidden">
          <header className="flex items-center justify-between px-4 h-14 border-b border-zinc-800 bg-zinc-900">
            <div />
            <Link href="/" className="text-lg font-bold text-white">
              Questack
            </Link>
            <HeaderUserMenu />
          </header>

          <main className="flex-1 overflow-hidden">
            {!isDbHealthy ? (
              <div className="flex items-center justify-center h-full">
                <h1 className="text-2xl text-zinc-300">🚧 Maintenance</h1>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </body>
    </html>
  );
}
