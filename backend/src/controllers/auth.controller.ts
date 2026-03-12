import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"

import { db } from "../db"
import { refreshTokens } from "../db/schema"

import { createUser, findUserByEmail } from "../services/auth.service"
import { registerSchema, loginSchema } from "../validators/auth.validator"


//Register

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body)

    // Check if user already exists
    const existingUser = await findUserByEmail(data.email)

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      })
    }

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

    // ACCESS TOKEN 

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    )

    // REFRESH TOKEN 

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    )

    // Storing my refresh token in the db

    await db.insert(refreshTokens).values({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    })

    //Cookie

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000

    })

    res.json({
      message: "Login successful",
      accessToken
    })

  } catch (error) {
    res.status(400).json({
      message: "Login failed",
      error
    })
  }
}


// Refresh Token

export const refresh = async (req: Request, res: Response) => {

  const token = req.cookies.refreshToken

  if (!token) {
    return res.status(401).json({
      message: "Refresh token missing"
    })
  }

  try {

    const payload: any = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    )

    const storedToken = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token))

    if (!storedToken.length) {
      return res.status(403).json({
        message: "Invalid refresh token"
      })
    }

    const newAccessToken = jwt.sign(
      { userId: payload.userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    )

    res.json({
      accessToken: newAccessToken
    })

  } catch (error) {
    res.status(403).json({
      message: "Refresh token invalid"
    })
  }
}


// Logout

export const logout = async (req: Request, res: Response) => {

  const token = req.cookies.refreshToken

  if (token) {
    await db
      .delete(refreshTokens)
      .where(eq(refreshTokens.token, token))
  }

  res.clearCookie("refreshToken")

  res.json({
    message: "Logged out successfully"
  })
}