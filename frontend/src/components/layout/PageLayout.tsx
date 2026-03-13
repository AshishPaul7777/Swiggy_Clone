import Navbar from "./Navbar"

type Props = {
  children: React.ReactNode
  onSearch: (value: string) => void
}

export default function PageLayout({ children, onSearch }: Props) {

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar onSearch={onSearch} />

      {/* Page Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>

    </div>
  )
}