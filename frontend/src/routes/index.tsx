import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "@/pages/HomePage"
import CartPage from "@/pages/CartPage"
import PageLayout from "@/components/layout/PageLayout"
import FoodDetailsPage from "@/pages/FoodDetailsPage"
import CheckoutPage from "@/pages/CheckoutPage"
import OrderSuccessPage from "@/pages/OrderSuccessPage"

type Props = {
    search: string
    setSearch: React.Dispatch<React.SetStateAction<string>>
  }
  
  
export default function AppRoutes({search,setSearch}: Props) {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <PageLayout onSearch={setSearch}>
            <HomePage search={search} />
          </PageLayout>
          }
        />

        <Route
          path="/cart"
          element={
            <PageLayout onSearch={setSearch}>
            <CartPage />
          </PageLayout>
          }
        />
<Route
  path="/food/:id"
  element={
    <PageLayout onSearch={setSearch}>
      <FoodDetailsPage />
    </PageLayout>
  }
/>
<Route
  path="/checkout"
  element={
    <PageLayout onSearch={setSearch}>
      <CheckoutPage />
    </PageLayout>
  }
/>

<Route
  path="/order-success"
  element={
    <PageLayout onSearch={setSearch}>
      <OrderSuccessPage />
    </PageLayout>
  }
/>
      </Routes>

    </BrowserRouter>
  )
}