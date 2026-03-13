import { Request, Response } from "express"
import {
  getAllFoods,
  getFoodById,
  createFood
} from "../services/food.service"

export const getFoods = async (req: Request, res: Response) => {
  const categoryId = req.query.categoryId as string | undefined

  const foods = await getAllFoods(categoryId)

  res.json(foods)
}
export const getFood = async (req: Request, res: Response) => {
  const id = req.params.id as string  
  const food = await getFoodById(id)

  if (!food) {
    return res.status(404).json({ message: "Food not found" })
  }

  res.json(food)
}

export const addFood = async (req: Request, res: Response) => {
  const food = await createFood(req.body)
  res.status(201).json(food)
}