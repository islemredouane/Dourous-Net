export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main id="main" className="flex-1 min-h-screen bg-[#0B1120]">
      {children}
    </main>
  )
}
