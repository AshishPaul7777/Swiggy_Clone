import { useNavigate } from "react-router-dom"

export default function OrderSuccessPage() {

  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">

      <h1 className="text-3xl font-bold text-green-600">
        Order Placed Successfully 
      </h1>

      <p className="text-gray-500">
        Your food will arrive soon.
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-orange-500 text-white px-6 py-3 rounded-lg"
      >
        Back to Menu
      </button>

    </div>
  )
}