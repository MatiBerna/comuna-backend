import { Response, Request, NextFunction } from 'express'
import { hash } from 'bcrypt-ts'
import Person, { IPerson } from './person.model.js'
import { MongoServerError } from 'mongodb'
import { Result, validationResult } from 'express-validator'
import mongoose from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'
import { decodeSign } from '../helpers/generateToken.js'
import Admin, { IAdmin } from '../admin/admin.model.js'

export async function findAll(req: Request, res: Response) {
  var filter = req.query.filter

  if (filter) {
    filter = filter.toString()
    const persons = await Person.find({
      $or: [
        { dni: { $regex: new RegExp(filter, 'i') } },
        { firstName: { $regex: new RegExp(filter, 'i') } },
        { lastName: { $regex: new RegExp(filter, 'i') } },
      ],
    }).select('-password')
    return res.json(persons)
  }

  const persons = await Person.find().select('-password')
  res.json(persons)
}

export async function findOne(req: Request, res: Response) {
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  const rta: boolean = await checkRoles(req)

  if (!rta) {
    return res.status(401).send({ message: 'No tienes permiso' })
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

  const rta: boolean = await checkRoles(req)

  if (!rta) {
    return res.status(401).send({ message: 'No tienes permiso para modificar personas' })
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

  //valida rol o si es misma persona
  const rta: boolean = await checkRoles(req)

  if (!rta) {
    return res.status(401).send({ message: 'No tienes permiso para eliminar personas' })
  }

  try {
    const person = await Person.findByIdAndDelete(id)

    if (!person) {
      return res.status(404).send({ message: 'Persona no encontrada' })
    }
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

//devueve false si no tiene permiso, true si tiene permiso
async function checkRoles(req: Request): Promise<boolean> {
  const token = String(req.headers.authorization?.split(' ').pop())
  const userData = (decodeSign(token) as JwtPayload).user

  const personToRemove = await Person.findById(req.params.id)

  if (personToRemove) {
    if ('dni' in userData && userData._id !== personToRemove._id.toString()) {
      return false
    } else if ('dni' in userData && userData._id === personToRemove._id.toString()) {
      return true
    } else if ('username' in userData) {
      return true
    }
  }
  return false
}
