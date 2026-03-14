import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"

import { db } from "../db"
import { refreshTokens, users } from "../db/schema"

import { createUser, findUserByEmail } from "../services/auth.service"
import { registerSchema, loginSchema } from "../validators/auth.validator"

const buildAuthResponse = async (user: {
  id: string
  name: string
  email: string
}) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in backend environment")
  }

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  )

  let refreshToken: string | null = null

  if (process.env.JWT_REFRESH_SECRET) {
    refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    )

    try {
      await db.insert(refreshTokens).values({
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      })
    } catch (error) {
      console.error("Refresh token persistence failed:", error)
      refreshToken = null
    }
  } else {
    console.warn("JWT_REFRESH_SECRET is missing. Session refresh is disabled.")
  }

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}

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

    const auth = await buildAuthResponse(user)

    if (auth.refreshToken) {
      res.cookie("refreshToken", auth.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
    }

    res.status(201).json({
      message: "User created successfully",
      accessToken: auth.accessToken,
      user: auth.user
    })

  } catch (error) {
    console.error("Register failed:", error)

    res.status(400).json({
      message: error instanceof Error ? error.message : "Registration failed"
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

    const auth = await buildAuthResponse(user)

    if (auth.refreshToken) {
      res.cookie("refreshToken", auth.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
    }

    res.json({
      message: "Login successful",
      accessToken: auth.accessToken,
      user: auth.user
    })

  } catch (error) {
    console.error("Login failed:", error)

    res.status(400).json({
      message: error instanceof Error ? error.message : "Login failed"
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

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email
      })
      .from(users)
      .where(eq(users.id, payload.userId))

    res.json({
      accessToken: newAccessToken,
      user: user[0]
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
