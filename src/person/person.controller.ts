import { Response, Request, NextFunction } from 'express'
//import { PersonRepository } from './person.repository.js'
//import { Person } from './person.model.js'
import { hash } from 'bcrypt-ts'
import Person, { IPerson } from './person.model.js'
import mongoose, { CastError } from 'mongoose'
import { MongoServerError } from 'mongodb'

//const repository = new PersonRepository()

export function sanitizePersonInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    dni: req.body.dni,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    birthdate: req.body.birthdate,
    password: req.body.password,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

export async function findAll(req: Request, res: Response) {
  const persons = await Person.find().select('-password')
  res.json(persons)
}

export async function findOne(req: Request, res: Response) {
  try {
    const person = await Person.findById(req.params.id).select('-password')

    if (!person) {
      return res.status(404).send({ message: 'Person not found' })
    }

    res.json(person)
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(400).send({ message: 'Id invalido' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}

export async function add(req: Request, res: Response) {
  const personInput = new Person(req.body)

  if (personInput.password) {
    const hashedPassword = await hash(personInput.password, 10)
    personInput.password = hashedPassword
  }

  try {
    const person = await personInput.save()
    const personObject = person.toObject()
    const { password, ...personWPassword } = personObject
    return res.status(201).json({ message: 'Person created', data: personWPassword })
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError
    if (mongoErr.code === 11000) {
      if (mongoErr.keyPattern && mongoErr.keyPattern.email === 1) {
        return res.status(400).send({ message: 'Email Repetido' })
      } else {
        return res.status(400).send({ message: 'DNI Repetido' })
      }
    } else if (mongoErr.name === 'ValidationError') {
      return res.status(400).send({ message: 'Falta un atributo requerido' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}

export async function update(req: Request, res: Response) {
  const id = req.params.id
  try {
    const person = await Person.findByIdAndUpdate(id, req.body, { new: true }).select('-password')

    if (!person) {
      return res.status(404).send({ message: 'Person not found' })
    }

    return res.status(200).json(person)
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError
    if (mongoErr.code === 11000) {
      if (mongoErr.keyPattern && mongoErr.keyPattern.email === 1) {
        return res.status(400).send({ message: 'Email Repetido' })
      } else {
        return res.status(400).send({ message: 'DNI Repetido' })
      }
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

  //const person = await repository.delete({ id })
  try {
    const person = await Person.findByIdAndDelete(id)

    if (!person) {
      return res.status(404).send({ message: 'Person not found' })
    }
    return res.status(200).send({ message: 'Person deleted', data: person })
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(400).send({ message: 'Id invalido' })
    }
  }
}

// export async function validateDni(req: Request, res: Response) {
//   req.body.sanitizedInput.id = req.params.id

//   const repeatedPerson = await repository.findByDni({ dni: req.body.sanitizedInput.dni })

//   if (repeatedPerson !== undefined) {
//     if (repeatedPerson._id?.toString() !== req.body.sanitizedInput.id) {
//       return res.status(400).send({ message: 'DNI repeated', data: false })
//     }
//   }
//   return res.status(200).send({ data: true })
// }
