import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Breadcrumb } from "@/components/breadcrumb"
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import AuthCheck from "@/components/auth-check"

export const metadata: Metadata = {
  title: "LingoMiner",
  description: "LingoMiner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
                <div className="flex items-center gap-2 px-4 w-full">
                  <SidebarTrigger className="-ml-1" />
                  <Breadcrumb />
                  <AuthCheck />
                </div>
              </header>
              {children}
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
