import express from "express"
import { getFeatured } from "../controllers/featured.controller"

const router = express.Router()

router.get("/", getFeatured)

export default router