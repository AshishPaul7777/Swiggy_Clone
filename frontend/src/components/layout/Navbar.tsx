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
    <div className="sticky top-0 z-50 border-b border-white/40 bg-white/75 px-2 py-3 backdrop-blur-xl sm:px-4 sm:py-4 md:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-3">
        <Link to="/" className="min-w-fit flex-shrink-0">
          <div className="leading-none">
            <p className="text-[0.5rem] font-bold uppercase tracking-[0.3em] text-orange-500 sm:text-[0.65rem] sm:tracking-[0.45em]">
              Hell
            </p>
            <p className="mt-0.5 text-xl font-black tracking-tight text-zinc-950 sm:mt-1 sm:text-2xl">
              Kitchen
            </p>
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <SearchBar onSearch={onSearch} />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 sm:gap-3">
          <Link
            to="/profile"
            className="inline-flex size-9 sm:size-11 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white"
            aria-label="Profile"
            title={user ? user.name : "Profile"}
          >
            {user ? (
              <span className="text-xs font-bold uppercase sm:text-sm">
                {user.name.slice(0, 1)}
              </span>
            ) : (
              <CircleUserRound className="size-4 sm:size-5" />
            )}
          </Link>

          <CartDrawer />
        </div>
      </div>
    </div>
  )
}
