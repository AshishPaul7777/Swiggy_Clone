import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import authRoutes from "./routes/auth.routes"
import { authenticate } from "./middleware/auth.middleware"
import foodRoutes from "./routes/food.routes"
import cartRoutes from "./routes/cart.routes"
import orderRoutes from "./routes/order.routes"
import categoryRoutes from "./routes/category.routes"
import featuredRoutes from "./routes/featured.routes"
import paymentRoutes from "./routes/payment.routes"
import searchRoutes from "./routes/search.routes"
import profileRoutes from "./routes/profile.routes"
import { errorHandler } from "./middleware/error.middleware"

const app = express()
const port = Number(process.env.PORT) || 5000

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
]
  .filter((origin): origin is string => Boolean(origin))
  .map((origin) => origin.trim().replace(/\/$/, ""))

app.set("trust proxy", 1)
app.use(express.json())
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true)
        return
      }

      const normalizedOrigin = origin.replace(/\/$/, "")

      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true)
        return
      }

      callback(new Error("Origin not allowed by CORS"))
    },
    credentials: true
  })
)
app.use(cookieParser())
app.use(helmet())
app.use("/api/auth", authRoutes)
app.use("/api/foods", foodRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/featured", featuredRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/profile", profileRoutes)
app.use(errorHandler)

app.get("/", (req, res) => {
  res.send("My API running")
})

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`)
})
