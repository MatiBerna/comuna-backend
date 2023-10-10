import { Response, Request, NextFunction } from 'express'
import { PersonRepository } from './person.repository.js'
import { Person } from './person.entity.js'

const repository = new PersonRepository()

export function sanitizePersonInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    dni: req.body.dni,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    birthdate: req.body.birthdate,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

export async function findAll(req: Request, res: Response) {
  const persons = await repository.findAll()
  res.json({ data: persons })
}

export async function findOne(req: Request, res: Response) {
  const id = req.params.id
  const person = await repository.findOne({ id })

  if (!person) {
    return res.status(404).send({ message: 'Person not found' })
  }
  res.json({ data: person })
}

export async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const personInput = new Person(input.dni, input.firstName, input.lastName, input.phone, input.email, input.birthdate)

  //valido si el dni no esta repetido
  const repeatedPerson = await repository.findByDni({ dni: personInput.dni })

  if (repeatedPerson !== undefined) {
    return res.status(400).send({ message: 'DNI repeated' })
  }

  const person = await repository.add(personInput)
  return res.status(201).json({ message: 'Person created', data: person })
}

export async function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id

  const repeatedPerson = await repository.findByDni({ dni: req.body.sanitizedInput.dni })

  if (repeatedPerson !== undefined) {
    //PROBABLEMENTE NO FUNCIONE Y DEBA IMPORTAR OBJECTID PARA TRANSFORMARLO A STRING O USAR UN TOSTRING
    if (repeatedPerson._id?.toString() !== req.body.sanitizedInput.id) {
      return res.status(400).send({ message: 'DNI repeated' })
    }
  }

  const person = await repository.update(req.body.sanitizedInput, req.params.id)

  if (person === undefined) {
    return res.status(404).send({ message: 'Person not found' })
  }

  return res.status(200).send({ message: 'Person updated', data: person })
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id

  const person = await repository.delete({ id })

  if (!person) {
    return res.status(404).send({ message: 'Person not found' })
  }
  return res.status(200).send({ message: 'Person deleted', data: person })
}
