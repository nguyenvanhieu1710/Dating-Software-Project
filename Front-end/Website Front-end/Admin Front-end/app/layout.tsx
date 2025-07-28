import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LoveConnect Admin - Hệ thống quản trị",
  description: "Hệ thống quản trị cho ứng dụng hẹn hò LoveConnect",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <LayoutContent>{children}</LayoutContent>
        <Toaster />
      </body>
    </html>
  )
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  // Check if we're on the login page
  const isLoginPage = typeof window !== "undefined" && window.location.pathname === "/"

  if (isLoginPage) {
    return children
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
