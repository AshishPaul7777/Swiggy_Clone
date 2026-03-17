import { useState } from "react"
import { Input } from "@/components/ui/input"

type Props = {
  onSearch: (value: string) => void
}

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setValue(v)
    onSearch(v)
  }

  return (
    <Input
      placeholder="Search cravings..."
      value={value}
      onChange={handleChange}
      className="h-10 w-full min-w-0 rounded-full border-zinc-200 bg-white/85 px-3 text-sm shadow-sm sm:h-11 sm:px-5 sm:text-base md:max-w-xl lg:max-w-2xl"
    />
  )
}
