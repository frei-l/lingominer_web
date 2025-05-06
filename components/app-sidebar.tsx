"use client"

import * as React from "react"
import { WalletCardsIcon as Cards, FileText, Settings, LayoutDashboard, BookOpen, Blocks} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

// This is sample data.
const data = {

  navMain: [
    {
      title: "Cards",
      url: "/cards",
      icon: Cards,
    },
    {
      title: "Templates",
      url: "/templates",
      icon: FileText,
    },
    {
      title: "Reader",
      url: "/reader",
      icon: BookOpen,
    },
    {
      title: "Mochi",
      url: "/mochi",
      icon: Blocks,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="group-data-[collapsible=icon]:hidden">
        <h1 className="text-md font-bold ml-2 mt-4">LingoMiner</h1>
      </SidebarHeader>
      <div className="group-data-[collapsible=icon]:mt-4"/>
      <SidebarContent >
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="mb-1 text-md">
                <Link href={item.url}>
                  {item.icon && <item.icon className="mx-2" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
