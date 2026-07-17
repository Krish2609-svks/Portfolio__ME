import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Enterprise CMS - Admin Dashboard",
  description: "Secure content management for Engineering Portfolio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAuth = !!cookieStore.get("admin-session")?.value;

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-white h-screen flex overflow-hidden`}>
        {isAuth ? (
          <>
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-zinc-900 border-l border-zinc-800">
              {children}
            </main>
          </>
        ) : (
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        )}
      </body>
    </html>
  );
}
