import express from "express"
import {
  getFoods,
  getFood,
  addFood
} from "../controllers/food.controller"

const router = express.Router()

router.get("/", getFoods)
router.get("/:id", getFood)
router.post("/", addFood)

export default router