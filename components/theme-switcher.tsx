"use client"

import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()

    return (
        <Switch
            id="darkMode"
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        />
    )
}
