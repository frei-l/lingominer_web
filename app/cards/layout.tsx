export default function CardsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="flex-1 overflow-y-auto p-4">
            {children}
        </main>
    )
}