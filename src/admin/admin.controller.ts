import { Request, Response, NextFunction } from 'express'
//import { Admin } from './admin.model.js'
//import { AdminRepository } from './admin.repository.js'
import { hash } from 'bcrypt-ts'
import Admin from './admin.model.js'
import { MongoServerError } from 'mongodb'
import { IAdmin } from './admin.model.js'

//const repository = new AdminRepository()

// export function sanitizeAdminInput(req: Request, res: Response, next: NextFunction) {
//   req.body.sanitizedInput = {
//     username: req.body.username,
//     password: req.body.password,
//   }

//   Object.keys(req.body.sanitizedInput).forEach((key) => {
//     if (req.body.sanitizedInput[key] === undefined) {
//       delete req.body.sanitizedInput[key]
//     }
//   })

//   next()
// }

export async function add(req: Request, res: Response) {
  //const input = req.body.sanitizedInput

  const adminInput = new Admin(req.body)

  // const repeatedAdmin = await repository.findByUsername({ username: input.username })

  // if (repeatedAdmin !== undefined) {
  //   return res.status(404).send({ message: 'Nombre de usuario en uso' })
  // }
  if (adminInput.password) {
    const hashedPassword = await hash(adminInput.password, 10)
    adminInput.password = hashedPassword
  } else {
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
    return res.status(500).send({ message: 'Internal server error' })
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const admin = await Admin.findById(req.params.id).select('-password')

    if (!admin) {
      return res.status(404).send({ message: 'Admin not found' })
    }
    res.json(admin)
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(400).send({ message: 'Id invalido' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}

export async function update(req: Request, res: Response) {
  const id = req.params.id

  // const repeatedAdmin = await repository.findByUsername({ username: req.body.sanitizedInput.username })

  // if (repeatedAdmin !== undefined) {
  //   if (repeatedAdmin._id?.toString() !== id) {
  //     return res.status(400).send({ message: 'Nombre de usuario repetido' })
  //   }
  // }
  if (req.body.password) {
    const hashedPassword = await hash(req.body.password, 10)
    req.body.password = hashedPassword
  }

  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password')

    if (!admin) {
      return res.status(404).send({ message: 'Admin not found' })
    }

    res.json({ message: 'Admin modificado', data: admin })
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError
    if (mongoErr.code === 11000) {
      return res.status(400).send({ message: 'Nombre de Usuario Repetido' })
    } else {
      if (err instanceof Error && err.name === 'CastError') {
        return res.status(400).send({ message: 'Id invalido' })
      } else {
        console.log(err)
        return res.status(500).send({ message: 'Error interno del servidor de Datos' })
      }
    }
  }
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id

  // const admin = await repository.delete({ id })
  try {
    const admin = await Admin.findByIdAndDelete(id)
    if (!admin) {
      return res.status(404).send({ message: 'Admin not found' })
    }
    return res.status(200).send({ message: 'Admin deleted', data: admin })
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(400).send({ message: 'Id invalido' })
    }
  }
}
