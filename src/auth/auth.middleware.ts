import { NextFunction, Request, Response } from 'express'
import { Admin } from '../admin/admin.entity.js'
import { Person } from '../person/person.entity.js'
import { verifyToken } from '../helpers/generateToken.js'
import { PersonRepository } from '../person/person.repository.js'
import { AdminRepository } from '../admin/admin.repository.js'
import { JwtPayload } from 'jsonwebtoken'

const personRepository = new PersonRepository()
const adminRepository = new AdminRepository()

export async function checkAdminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = String(req.headers.authorization?.split(' ').pop())
    const tokenData = (await verifyToken(token)) as JwtPayload
    var adminData: Admin | undefined = undefined

    if (tokenData) {
      adminData = await adminRepository.findOne({ id: tokenData._id })
    }

    if (!adminData) {
      return res.status(409).send({ message: 'No tienes permiso' })
    } else {
      next()
    }
  } catch (err) {
    console.log(err)
    res.status(409).send({ message: 'Por acá no pasas mi rey' })
  }
}

export async function checkPersonAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = String(req.headers.authorization?.split(' ').pop())
    const tokenData = (await verifyToken(token)) as JwtPayload
    var personData: Person | undefined = undefined

    if (tokenData) {
      personData = await personRepository.findOne({ id: tokenData._id })
    }

    if (!personData) {
      return res.status(409).send({ message: 'No tienes permiso' })
    } else {
      next()
    }
  } catch (err) {
    console.log(err)
    res.status(409).send({ message: 'Por acá no pasas mi rey' })
  }
}
