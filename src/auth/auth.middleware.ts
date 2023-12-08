import { NextFunction, Request, Response } from 'express'
import Admin from '../admin/admin.model.js'
import Person, { IPerson } from '../person/person.model.js'
import { verifyToken } from '../helpers/generateToken.js'
import { JwtPayload } from 'jsonwebtoken'
import { IAdmin } from '../admin/admin.model.js'

export async function checkAdminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = String(req.headers.authorization?.split(' ').pop())
    const tokenData = (await verifyToken(token)) as JwtPayload
    var adminData: IAdmin | undefined = undefined

    if (tokenData) {
      adminData = (await Admin.findById(tokenData.user._id)) || undefined
    }

    if (!adminData) {
      return res.status(401).send({ message: 'No tienes permiso' })
    } else {
      next()
    }
  } catch (err) {
    console.log(err)
    res.status(400).send({ message: 'token incorrecto o inexistente' })
  }
}

export async function checkPersonAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = String(req.headers.authorization?.split(' ').pop())
    const tokenData = (await verifyToken(token)) as JwtPayload
    var personData: IPerson | undefined = undefined

    if (tokenData) {
      personData = (await Person.findById(tokenData.user._id)) || undefined
    }

    if (!personData) {
      checkAdminAuth(req, res, next)
      //return res.status(401).send({ message: 'No tienes permiso' })
    } else {
      next()
    }
  } catch (err) {
    console.log(err)
    res.status(400).send({ message: 'token incorrecto o inexistente' })
  }
}
