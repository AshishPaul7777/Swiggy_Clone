import Navbar from "./Navbar"

type Props = {
  children: React.ReactNode
  onSearch: (value: string) => void
  showNavbar?: boolean
}

export default function PageLayout({
  children,
  onSearch,
  showNavbar = true
}: Props) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,131,36,0.12),_transparent_24%),linear-gradient(180deg,_#fff7ed_0%,_#faf7f2_45%,_#f5f5f4_100%)] text-zinc-950">
      {showNavbar ? <Navbar onSearch={onSearch} /> : null}

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        {children}
      </main>
    </div>
  )
}
