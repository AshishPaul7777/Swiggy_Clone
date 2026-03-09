import { db } from "../db"
import { users } from "../db/schema"
import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"

export async function createUser(name: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await db.insert(users).values({
    name,
    email,
    password: hashedPassword
  }).returning()

  return user[0]
}
export async function findUserByEmail(email: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
  
    return result[0]
  }