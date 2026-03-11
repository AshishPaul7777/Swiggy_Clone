import express from "express"
import {
  getAllCategories,
  getCategoryFoods
} from "../controllers/category.controller"

const router = express.Router()

router.get("/", getAllCategories)

router.get("/:id/foods", getCategoryFoods)

export default router