import AppRoutes from "./routes"
import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { getCategories } from "@/api/categoryApi"

function App() {

  const [search, setSearch] = useState("")

  const queryClient = useQueryClient()

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: getCategories,
    })
  }, [queryClient])

  return (
    <>
      <AppRoutes search={search} setSearch={setSearch} />
      <Toaster />
    </>
  )
}

export default App