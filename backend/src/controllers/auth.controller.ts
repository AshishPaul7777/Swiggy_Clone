import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import { createUser, findUserByEmail } from "../services/auth.service"
import { registerSchema, loginSchema } from "../validators/auth.validator"


// register
export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body)

    const user = await createUser(
      data.name,
      data.email,
      data.password
    )

    res.status(201).json({
      message: "User created successfully",
      user
    })

  } catch (error) {
    res.status(400).json({
      message: "Registration failed",
      error
    })
  }
}


// login
export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body)

    const user = await findUserByEmail(data.email)

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      })
    }

    const isMatch = await bcrypt.compare(
      data.password,
      user.password
    )

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      })
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    )

    res.json({
      message: "Login successful",
      token
    })

  } catch (error) {
    res.status(400).json({
      message: "Login failed",
      error
    })
  }
}