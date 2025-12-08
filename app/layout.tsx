import type { Metadata } from "next";
import { DM_Sans, Fira_Mono } from "next/font/google";
import "./globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/shared/header/header";
import AppSidebar from "@/components/shared/sidebar/sidebar";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const firaMono = Fira_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kampaign",
  description: "Bulk Email Automation",
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
            {children}
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
