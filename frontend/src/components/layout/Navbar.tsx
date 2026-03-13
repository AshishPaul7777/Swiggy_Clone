import { Link } from "react-router-dom"
import CartDrawer from "@/components/cart/CartDrawer"
import SearchBar from "@/components/search/SearchBar"

type Props = {
  onSearch: (value: string) => void
}

export default function Navbar({ onSearch }: Props) {

  return (
    <div className="sticky top-0 z-50 bg-white flex items-center justify-between border-b px-6 py-4">

      <Link to="/" className="text-xl font-bold">
        Hell Kitchen
      </Link>

      <SearchBar onSearch={onSearch} />

      <CartDrawer />

    </div>
  )
}