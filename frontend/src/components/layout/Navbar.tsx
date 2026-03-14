import { CircleUserRound } from "lucide-react"
import { Link } from "react-router-dom"
import CartDrawer from "@/components/cart/CartDrawer"
import SearchBar from "@/components/search/SearchBar"
import { useAuthStore } from "@/store/authStore"

type Props = {
  onSearch: (value: string) => void
}

export default function Navbar({ onSearch }: Props) {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="sticky top-0 z-50 border-b border-white/40 bg-white/75 px-4 py-4 backdrop-blur-xl md:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <Link to="/" className="min-w-fit">
          <div className="leading-none">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.45em] text-orange-500">
              Hell
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight text-zinc-950">
              Kitchen
            </p>
          </div>
        </Link>

        <SearchBar onSearch={onSearch} />

        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="inline-flex size-11 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white"
            aria-label="Profile"
            title={user ? user.name : "Profile"}
          >
            {user ? (
              <span className="text-sm font-bold uppercase">
                {user.name.slice(0, 1)}
              </span>
            ) : (
              <CircleUserRound className="size-5" />
            )}
          </Link>

          <CartDrawer />
        </div>
      </div>
    </div>
  )
}
