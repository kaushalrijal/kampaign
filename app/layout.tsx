import type { Metadata } from "next";
import { DM_Sans, Fira_Mono } from "next/font/google";
import "./globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/shared/header/header";
import AppSidebar from "@/components/shared/sidebar/sidebar";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/contants";
import { Toaster } from "@/components/ui/sonner";

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
  title: {
    template: `%s | Dokaan`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${firaMono.variable} antialiased`}>
        <SidebarProvider>
          {/* important: explicit flex container that constrains children */}
          <div className="flex min-h-screen w-full overflow-x-hidden">
            <AppSidebar />
            <SidebarInset className="flex-1 min-w-0">
              <Header />
              <main className="flex-1 min-w-0 overflow-auto px-4 py-8 md:px-8 md:py-8 text-left">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "bg-card text-foreground border-2 border-foreground rounded-none px-4 py-3 flex gap-3 items-start uppercase tracking-tight font-semibold w-80 max-w-full",
              error:
                "bg-destructive text-white border-2 border-black",
              title: "text-sm leading-snug",
              description: "text-xs font-normal text-muted-foreground leading-snug",
              actionButton:
                "bg-primary text-primary-foreground rounded-none border-2 border-foreground px-3 py-2 hover:bg-primary/90",
              cancelButton:
                "bg-secondary text-foreground rounded-none border-2 border-foreground px-3 py-2 hover:bg-secondary/80",
              icon: "text-primary mt-0.5",
            },
            duration: 4200,
          }}
        />
      </body>
    </html>
  );
}
