import { Request, Response } from "express"
import {
  getCategories,
  getFoodsByCategory
} from "../services/category.service"

export const getAllCategories = async (req: Request, res: Response) => {
  const data = await getCategories()
  res.json(data)
}

export const getCategoryFoods = async (req: Request, res: Response) => {
    const { id } = req.params

    const foods = await getFoodsByCategory(typeof id === 'string' ? id : id[0])

    res.json(foods)
}