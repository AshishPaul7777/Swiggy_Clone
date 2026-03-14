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
      placeholder="Search cravings, biryani, burgers..."
      value={value}
      onChange={handleChange}
      className="h-11 w-full max-w-xl rounded-full border-zinc-200 bg-white/85 px-5 shadow-sm md:w-[28rem]"
    />
  )
}
