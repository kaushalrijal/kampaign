import type { Metadata } from "next";
import { DM_Sans, Fira_Mono } from "next/font/google";
import "./globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/shared/header/header";
import AppSidebar from "@/components/shared/sidebar/sidebar";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/contants";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const firaMono = Fira_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata:Metadata = {
  title: {
    template: `%s | Dokaan`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${firaMono.variable} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <main className="flex-1 overflow-auto overflow-x-hidden md:overflow-x-hidden px-4 py-8 md:px-8 md:py-8 text-left">
            {children}
          </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
