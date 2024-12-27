import { SettingsForm } from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <SettingsForm />
      </div>
    </main>
  )
}

