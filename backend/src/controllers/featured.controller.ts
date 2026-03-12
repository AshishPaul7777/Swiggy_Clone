import { Request, Response } from "express"
import { getFeaturedFoods } from "../services/featured.service"

export const getFeatured = async (req: Request, res: Response) => {
  try {
    const foods = await getFeaturedFoods()

    res.json(foods)

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch featured foods"
    })
  }
}