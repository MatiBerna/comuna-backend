import { Request, Response, NextFunction } from 'express'
import { Admin } from './admin.entity.js'
import { AdminRepository } from './admin.repository.js'
import { hash } from 'bcrypt-ts'

const repository = new AdminRepository()

export function sanitizeAdminInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    username: req.body.username,
    password: req.body.password,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

export async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const adminInput = new Admin(input.username, input.password)

  //TODO: terminar
  const repeatedAdmin = await repository.findByUsername({ username: input.username })

  if (repeatedAdmin !== undefined) {
    return res.status(404).send({ message: 'Nombre de usuario en uso' })
  }

  const hashedPassword = await hash(adminInput.password!, 10)
  adminInput.password = hashedPassword

  const admin = await repository.add(adminInput)
  return res.status(201).json({ message: 'Admin creado', data: admin })
}

export async function findAll(req: Request, res: Response) {
  const adminList = await repository.findAll()
  res.json({ data: adminList })
}

export async function findOne(req: Request, res: Response) {
  const id = req.params.id
  const admin = await repository.findOne({ id })

  if (!admin) {
    return res.status(404).send({ message: 'Admin not found' })
  }
  res.json({ data: admin })
}

export async function update(req: Request, res: Response) {
  const id = req.params.id

  const repeatedAdmin = await repository.findByUsername({ username: req.body.sanitizedInput.username })

  if (repeatedAdmin !== undefined) {
    if (repeatedAdmin._id?.toString() !== id) {
      return res.status(400).send({ message: 'Nombre de usuario repetido' })
    }
  }

  const hashedPassword = await hash(req.body.sanitizedInput.password, 10)
  req.body.sanitizedInput.password = hashedPassword

  const admin = await repository.update(req.body.sanitizedInput, req.params.id)

  if (!admin) {
    return res.status(404).send({ message: 'Admin not found' })
  }

  const { password, ...adminWPass } = admin
  res.json({ message: 'Admin modificado', data: adminWPass })
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id

  const admin = await repository.delete({ id })

  if (!admin) {
    return res.status(404).send({ message: 'Person not found' })
  }
  return res.status(200).send({ message: 'Person deleted', data: admin })
}
