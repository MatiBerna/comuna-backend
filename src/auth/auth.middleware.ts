import { NextFunction, Request, Response } from 'express'
import { Admin } from '../admin/admin.entity.js'
import Person, { IPerson } from '../person/person.model.js'
import { verifyToken } from '../helpers/generateToken.js'
//import { PersonRepository } from '../person/person.repository.js'
import { AdminRepository } from '../admin/admin.repository.js'
import { JwtPayload } from 'jsonwebtoken'

//const personRepository = new PersonRepository()
const adminRepository = new AdminRepository()

export async function checkAdminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = String(req.headers.authorization?.split(' ').pop())
    const tokenData = (await verifyToken(token)) as JwtPayload
    var adminData: Admin | undefined = undefined

    if (tokenData) {
      adminData = await adminRepository.findOne({ id: tokenData.user._id })
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
      //personData = await personRepository.findOne({ id: tokenData.user._id })
      personData = (await Person.findById(tokenData.user._id)) || undefined
    }

    if (!personData) {
      return res.status(401).send({ message: 'No tienes permiso' })
    } else {
      next()
    }
  } catch (err) {
    console.log(err)
    res.status(400).send({ message: 'token incorrecto o inexistente' })
  }
}
