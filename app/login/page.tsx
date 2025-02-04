import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Welcome to LingoMiner</h1>
        <LoginForm />
      </div>
    </main>
  )
} 