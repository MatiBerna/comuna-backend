import { Request, Response, NextFunction } from 'express'
import { hash } from 'bcrypt-ts'
import Admin from './admin.model.js'
import { MongoServerError } from 'mongodb'
import { IAdmin } from './admin.model.js'

export async function add(req: Request, res: Response) {
  const adminInput = new Admin(req.body)

  if (adminInput.password) {
    const hashedPassword = await hash(adminInput.password, 10)
    adminInput.password = hashedPassword
  } else {
    return res.status(400).send({ message: 'Datos incompletos' })
  }

  if (!adminInput.username) {
    return res.status(400).send({ message: 'Datos incompletos' })
  }

  try {
    const admin = await adminInput.save()
    return res.status(201).json({ message: 'Admin creado', data: admin })
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError
    if (mongoErr.code === 11000) {
      return res.status(400).send({ message: 'Nombre de Usuario Repetido' })
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
  const id = req.params.id

  if (req.body.password) {
    const hashedPassword = await hash(req.body.password, 10)
    req.body.password = hashedPassword
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
      return res.status(400).send({ message: 'Nombre de Usuario Repetido' })
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

  try {
    const admin = await Admin.findByIdAndDelete(id)
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
