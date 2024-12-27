import { CardGallery } from "@/components/card-gallery"

export default function DashboardPage() {
  return (
    <main className="flex-1 overflow-y-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome to LingoMiner. Here's an overview of your recent activity:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Cards</h2>
          <p className="text-3xl font-bold">120</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Cards Studied Today</h2>
          <p className="text-3xl font-bold">25</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Streak</h2>
          <p className="text-3xl font-bold">7 days</p>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">Recent Cards</h2>
      <CardGallery />
    </main>
  )
}

