import { Suspense, lazy } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import PageLayout from "@/components/layout/PageLayout"
import RequireAuth from "@/components/auth/RequireAuth"
import { Skeleton } from "@/components/ui/skeleton"

const HomePage = lazy(() => import("@/pages/HomePage"))
const CartPage = lazy(() => import("@/pages/CartPage"))
const FoodDetailsPage = lazy(() => import("@/pages/FoodDetailsPage"))
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"))
const OrderSuccessPage = lazy(() => import("@/pages/OrderSuccessPage"))
const ProfilePage = lazy(() => import("@/pages/ProfilePage"))
const LoginPage = lazy(() => import("@/pages/LoginPage"))
const SignupPage = lazy(() => import("@/pages/SignupPage"))

type Props = {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

function RouteFallback() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 py-6">
      <Skeleton className="h-12 w-full rounded-2xl" />
      <Skeleton className="h-10 w-64 rounded-xl" />
      <Skeleton className="h-64 w-full rounded-[28px]" />
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-52 w-full rounded-[28px]" />
        ))}
      </div>
    </div>
  )
}

export default function AppRoutes({ search, setSearch }: Props) {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
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
            path="/foods/:id"
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
                <RequireAuth>
                  <CheckoutPage />
                </RequireAuth>
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

          <Route
            path="/profile"
            element={
              <PageLayout onSearch={setSearch} showNavbar={false}>
                <ProfilePage />
              </PageLayout>
            }
          />

          <Route
            path="/login"
            element={
              <PageLayout onSearch={setSearch}>
                <LoginPage />
              </PageLayout>
            }
          />

          <Route
            path="/signup"
            element={
              <PageLayout onSearch={setSearch}>
                <SignupPage />
              </PageLayout>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
