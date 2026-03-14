import express from "express"
import { createCheckoutOrderController } from "../controllers/order.controller"
import { authenticate } from "../middleware/auth.middleware"

const router = express.Router()

router.post("/checkout", authenticate, createCheckoutOrderController)

export default router
