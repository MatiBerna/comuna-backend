import { compare, hash } from 'bcrypt-ts'

export async function encryptPassword(textplain: string) {
  const hashPassword = await hash(textplain, 10)
  return hashPassword
}

export async function comparePassword(passwordPlain: string, hashPassword: string) {
  return await compare(passwordPlain, hashPassword)
}
