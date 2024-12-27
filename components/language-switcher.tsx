"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface Language {
  name: string
  code: string
  flag: string
}

const languages: Language[] = [
  {
    name: "English",
    code: "en",
    flag: "🇬🇧",
  },
  {
    name: "German",
    code: "de",
    flag: "🇩🇪",
  },
  {
    name: "French",
    code: "fr",
    flag: "🇫🇷",
  },
  {
    name: "Spanish",
    code: "es",
    flag: "🇪🇸",
  },
]

export function LanguageSwitcher() {
  const { isMobile } = useSidebar()
  const [activeLanguage, setActiveLanguage] = React.useState(languages[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center">
                <span className="text-2xl">{activeLanguage.flag}</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeLanguage.name}
                </span>
                <span className="truncate text-xs">Lingominer</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Available Languages
            </DropdownMenuLabel>
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => setActiveLanguage(language)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center">
                  <span className="text-xl">{language.flag}</span>
                </div>
                {language.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add language</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

