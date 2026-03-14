import express from "express"
import { authenticate } from "../middleware/auth.middleware"
import {
  addAddress,
  editAddress,
  getProfile,
  removeAddress,
  updateProfile
} from "../controllers/profile.controller"

const router = express.Router()

router.get("/", authenticate, getProfile)
router.put("/", authenticate, updateProfile)
router.post("/addresses", authenticate, addAddress)
router.put("/addresses/:id", authenticate, editAddress)
router.delete("/addresses/:id", authenticate, removeAddress)

export default router
