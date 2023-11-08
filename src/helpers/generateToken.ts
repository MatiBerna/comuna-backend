import jwt from 'jsonwebtoken'
//import { Person } from '../person/person.model'
const { sign, verify, decode } = jwt
import * as dotenv from 'dotenv'
import { Admin } from '../admin/admin.entity'
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

export async function adminTokenSign(user: Admin) {
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

const decodeSign = (token: string) => {
  //TODO: Verificar que el token sea valido y correcto
  return decode(token)
}
