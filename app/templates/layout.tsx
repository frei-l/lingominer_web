export default function TemplatesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="flex-1 overflow-y-auto">
            <div className="container mt-8 mx-auto max-w-4xl">   
            {children}
            </div>
        </main>
    )
}