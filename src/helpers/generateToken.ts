import jwt from 'jsonwebtoken'
const { sign, verify, decode } = jwt
import * as dotenv from 'dotenv'
import { IAdmin } from '../admin/admin.model'
import { IPerson } from '../person/person.model'

dotenv.config()

export async function tokenSign(user: IPerson) {
  const secret_key: jwt.Secret = String(process.env.JWT_SECRET)

  return sign(
    {
      user: user,
    },
    secret_key,
    {
      expiresIn: '2h',
    }
  )
}

export async function adminTokenSign(user: IAdmin) {
  const secret_key: jwt.Secret = String(process.env.JWT_SECRET)

  return sign(
    {
      user: user,
    },
    secret_key,
    {
      expiresIn: '2h',
    }
  )
}

export async function verifyToken(token: string) {
  const secret_key: jwt.Secret = String(process.env.JWT_SECRET)
  try {
    return verify(token, secret_key)
  } catch (e) {
    return undefined
  }
}

export const decodeSign = (token: string) => {
  //TODO: Verificar que el token sea valido y correcto
  return decode(token)
}
