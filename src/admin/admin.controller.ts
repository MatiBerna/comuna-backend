import { Request, Response } from 'express'
import { hash } from 'bcrypt-ts'
import Admin, { IAdmin } from './admin.model'
import { MongoServerError } from 'mongodb'
import { decodeSign } from '../helpers/generateToken'
import { JwtPayload } from 'jsonwebtoken'
import { Result, validationResult } from 'express-validator'

export async function add(req: Request, res: Response) {
  const adminInput = new Admin(req.body)

  const token = String(req.headers.authorization?.split(' ').pop())

  const rta = await checkSARole(token)

  if (rta === false) {
    return res.status(401).send({ message: 'No tienes permiso de super admin' })
  }

  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  const hashedPassword = await hash(adminInput.password!, 10)
  adminInput.password = hashedPassword

  //para que ningun admin se pase de vivo
  if (adminInput.role) {
    adminInput.role = 'NSA'
  }

  try {
    const admin = await adminInput.save()
    const adminObject = admin.toObject()
    const { password, ...adminWP } = adminObject
    return res.status(201).json({ message: 'Admin creado', data: adminWP })
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError
    if (mongoErr.code === 11000) {
      return res.status(409).send({ message: 'El Nombre de Usuario ya está en uso' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}

export async function findAll(req: Request, res: Response) {
  try {
    const adminList = await Admin.find().select('-password')
    res.json(adminList)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Error interno del servidor de Datos' })
  }
}

export async function findOne(req: Request, res: Response) {
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }
  try {
    const admin = await Admin.findById(req.params.id).select('-password')

    if (!admin) {
      return res.status(404).send({ message: 'Admin no encontrado' })
    }
    res.json(admin)
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(404).send({ message: 'Admin no encontrado' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}

export async function update(req: Request, res: Response) {
  const token = String(req.headers.authorization?.split(' ').pop())
  const userData = decodeSign(token) as JwtPayload
  const rta = await checkSARole(token)

  if (!rta && userData.user._id !== req.params.id) {
    return res.status(401).send({ message: 'No tienes permiso para actualizar administradores' })
  }

  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  if (req.body.password) {
    const hashedPassword = await hash(req.body.password, 10)
    req.body.password = hashedPassword
  }

  //para que ningun admin se pase de vivo
  if (req.body.role) {
    req.body.role = 'NSA'
  }

  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password')

    if (!admin) {
      return res.status(404).send({ message: 'Admin no encontrado' })
    }

    res.json({ message: 'Admin modificado', data: admin })
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError
    if (mongoErr.code === 11000) {
      return res.status(409).send({ message: 'En Nombre de Usuario ya está en uso' })
    } else {
      if (err instanceof Error && err.name === 'CastError') {
        return res.status(404).send({ message: 'Admin no encontrado' })
      } else {
        console.log(err)
        return res.status(500).send({ message: 'Error interno del servidor de Datos' })
      }
    }
  }
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id

  const token = String(req.headers.authorization?.split(' ').pop())
  const rta = await checkSARole(token)

  if (!rta) {
    return res.status(401).send({ message: 'No tienes permiso para borrar administradores' })
  }

  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  try {
    const adminToDelete = await Admin.findById(id)
    if (adminToDelete && adminToDelete.role === 'SA') {
      return res.status(401).send({ message: 'No es posible borrar a este administrador' })
    }

    const admin = await Admin.findByIdAndDelete(id).select('-password')
    if (!admin) {
      return res.status(404).send({ message: 'Admin no encontrado' })
    }
    return res.status(200).send({ message: 'Admin eliminado', data: admin })
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(404).send({ message: 'Admin no encontrado' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}

async function checkSARole(token: string) {
  const userData = decodeSign(token) as JwtPayload

  const admin: IAdmin | undefined = (await Admin.findById(userData.user._id)) || undefined

  if (admin && admin.role === 'SA') {
    return true
  } else {
    return false
  }
}
