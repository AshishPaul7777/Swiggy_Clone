import express from "express"
import { placeOrder } from "../controllers/order.controller"
import { authenticate } from "../middleware/auth.middleware"

const router = express.Router()

router.post("/", authenticate, placeOrder)

export default router