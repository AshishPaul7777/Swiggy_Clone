import { db } from "../db"
import { users } from "../db/schema"
import bcrypt from "bcrypt"
import { eq, sql } from "drizzle-orm"

export async function createUser(name: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await db.execute(sql`
    insert into "users" ("name", "email", "password")
    values (${name}, ${email}, ${hashedPassword})
    returning "id", "name", "email"
  `)

  return user.rows[0] as {
    id: string
    name: string
    email: string
  }
}

export async function findUserByEmail(email: string) {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      password: users.password
    })
    .from(users)
    .where(eq(users.email, email))

  return result[0]
}
