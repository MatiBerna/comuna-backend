import { Response, Request } from 'express'
import { hash } from 'bcrypt-ts'
import Person from './person.model.js'
import { MongoServerError } from 'mongodb'
import { Result, validationResult } from 'express-validator'
import { PaginateOptions } from 'mongoose'

export async function findAll(req: Request, res: Response) {
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  var filter = req.query.filter
  var page = Number(req.query.page)
  const options: PaginateOptions = {
    page: page,
    limit: 10,
    select: '-password',
    sort: { updatedAt: -1 },
  }

  if (filter) {
    filter = filter.toString()
    const persons = await Person.paginate(
      {
        $or: [
          { dni: { $regex: new RegExp(filter, 'i') } },
          { firstName: { $regex: new RegExp(filter, 'i') } },
          { lastName: { $regex: new RegExp(filter, 'i') } },
        ],
      },
      options
    )
    return res.json(persons)
  }

  const persons = await Person.paginate({}, options)

  res.json(persons)
}

export async function findOne(req: Request, res: Response) {
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  try {
    const person = await Person.findById(req.params.id).select('-password')

    if (!person) {
      return res.status(404).send({ message: 'Persona no encontrada' })
    }

    res.json(person)
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(404).send({ message: 'Persona no encontrada' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}

export async function add(req: Request, res: Response) {
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  const personInput = new Person(req.body)

  const hashedPassword = await hash(personInput.password, 10)
  personInput.password = hashedPassword

  try {
    const person = await personInput.save()
    const personObject = person.toObject()
    const { password, ...personWPassword } = personObject

    return res.status(201).json({ message: 'Persona creada', data: personWPassword })
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError
    if (mongoErr.code === 11000) {
      if (mongoErr.keyPattern && mongoErr.keyPattern.email === 1) {
        return res.status(409).send({ message: 'Email Repetido' })
      } else {
        return res.status(409).send({ message: 'DNI Repetido' })
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
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  try {
    if (req.body.password) {
      const hashedPassword = await hash(req.body.password, 10)
      req.body.password = hashedPassword
    }

    const person = await Person.findByIdAndUpdate(id, req.body, { new: true }).select('-password')

    if (!person) {
      return res.status(404).send({ message: 'Persona no encontrada' })
    }

    return res.status(200).json(person)
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError
    if (mongoErr.code === 11000) {
      if (mongoErr.keyPattern && mongoErr.keyPattern.email === 1) {
        return res.status(409).send({ message: 'Email Repetido' })
      } else {
        return res.status(409).send({ message: 'DNI Repetido' })
      }
    } else {
      if (err instanceof Error && err.name === 'CastError') {
        return res.status(404).send({ message: 'Persona no encontrada' })
      } else {
        console.log(err)
        return res.status(500).send({ message: 'Error interno del servidor de Datos' })
      }
    }
  }
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id

  //errores Bad Request
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  try {
    const person = await Person.findByIdAndDelete(id)

    if (!person) {
      return res.status(404).send({ message: 'Persona no encontrada' })
    }
    console.log('asdjfkasjdkfjaskdjf')
    return res.status(200).send({ message: 'Persona eliminada', data: person })
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      console.log(err)
      return res.status(404).send({ message: 'Persona no encontrada' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}
