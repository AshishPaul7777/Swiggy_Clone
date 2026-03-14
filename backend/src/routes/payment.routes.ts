import express from "express"
import { authenticate } from "../middleware/auth.middleware"
import { verifyPaymentController } from "../controllers/payment.controller"

const router = express.Router()

router.post("/verify", authenticate, verifyPaymentController)

export default router
