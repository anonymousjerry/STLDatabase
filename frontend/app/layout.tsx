import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/utils/SessionProvider";
import Providers from "@/Providers";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "@/context/ThemeContext";
import { SearchProvider } from "@/context/SearchContext";
import 'svgmap/dist/svgMap.min.css';




const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "STLDatase",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <SessionProvider session={session}>
            <SearchProvider>
              <Providers>
              {children}
              </Providers>
            </SearchProvider>
          </SessionProvider>
        </ThemeProvider>
        </body>
    </html>
  );
}
