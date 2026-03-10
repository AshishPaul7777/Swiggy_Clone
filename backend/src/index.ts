import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import authRoutes from "./routes/auth.routes"
import { authenticate } from "./middleware/auth.middleware"

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(helmet())
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("My API running")
})
app.get("/api/profile", authenticate, (req, res) => {
  res.json({
    message: "Access granted",
    user: (req as any).user
  })
})
app.listen(5000, () => {
  console.log("Server running on port 5000")
})