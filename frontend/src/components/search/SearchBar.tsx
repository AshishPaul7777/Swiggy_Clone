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
      placeholder="Search food..."
      value={value}
      onChange={handleChange}
      className="w-80"
    />
  )
}