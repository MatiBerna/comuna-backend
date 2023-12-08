import { Response, Request } from 'express'
import { hash } from 'bcrypt-ts'
import Person, { IPerson } from './person.model.js'
import { MongoServerError } from 'mongodb'

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
    })
    return res.json(persons)
  }

  const persons = await Person.find().select('-password')
  res.json(persons)
}

export async function findOne(req: Request, res: Response) {
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
  const personInput = new Person(req.body)

  if (personInput.password) {
    const hashedPassword = await hash(personInput.password, 10)
    personInput.password = hashedPassword
  }

  //CORREGIR, NO VALIDA CORRACTAMENTE
  if (req.body.birthdate && new Date(req.body.birthdate).toString() === 'Invalid Date') {
    return res.status(400).send({ message: 'La fecha de nacimineto ingresada no es valida' })
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
    if (req.body.birthdate && new Date(req.body.birthdate).toString() === 'Invalid Date') {
      return res.status(400).send({ message: 'La fecha de nacimiento ingresada no es valida' })
    }

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
        return res.status(400).send({ message: 'Email Repetido' })
      } else {
        return res.status(400).send({ message: 'DNI Repetido' })
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

  try {
    const person = await Person.findByIdAndDelete(id)

    if (!person) {
      return res.status(404).send({ message: 'Persona no encontrada' })
    }
    return res.status(200).send({ message: 'Person deleted', data: person })
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
