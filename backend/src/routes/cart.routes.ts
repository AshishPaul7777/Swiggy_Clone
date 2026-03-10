import express from "express"
import {
  addItem,
  getUserCart,
  updateItem,
  removeItem
} from "../controllers/cart.controller"

import { authenticate } from "../middleware/auth.middleware"

const router = express.Router()

router.post("/add", authenticate, addItem)
router.get("/", authenticate, getUserCart)
router.patch("/update", authenticate, updateItem)
router.delete("/remove", authenticate, removeItem)

export default router