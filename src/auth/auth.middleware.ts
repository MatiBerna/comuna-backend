import { NextFunction, Request, Response } from 'express'
import Admin from '../admin/admin.model'
import Person, { IPerson } from '../person/person.model'
import { verifyToken } from '../helpers/generateToken'
import { JwtPayload } from 'jsonwebtoken'
import { IAdmin } from '../admin/admin.model'

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
    } else {
      if (req.params.id) {
        const personToModify = (await Person.findById(req.params.id)) || undefined

        if (personToModify) {
          if (personData._id.toString() !== personToModify._id.toString()) {
            return res.status(401).send({ message: 'No tienes permiso' })
          } else if (personData._id.toString() === personToModify._id.toString()) {
            return next()
          }
        }
      }
      next()
    }
  } catch (err) {
    console.log(err)
    res.status(400).send({ message: 'token incorrecto o inexistente' })
  }
}
