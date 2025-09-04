import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function signToken(payload: any): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export function verifyToken(token: string): any {
  return jwt.verify(token, process.env.JWT_SECRET!)
}