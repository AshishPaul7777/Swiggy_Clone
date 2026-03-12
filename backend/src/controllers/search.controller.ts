import { Request, Response } from "express"
import { searchFoods } from "../services/search.service"

export const search = async (req: Request, res: Response) => {
  try {

    const query = req.query.q as string

    if (!query) {
      return res.status(400).json({
        message: "Search query required"
      })
    }

    const results = await searchFoods(query)

    res.json(results)

  } catch (error) {
    res.status(500).json({
      message: "Search failed"
    })
  }
}