import { Response, Request, NextFunction } from 'express'
import { PersonRepository } from './person.repository.js'
import { Person } from './person.entity.js'
import { hash } from 'bcrypt-ts'

const repository = new PersonRepository()

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
  const persons = await repository.findAll()
  res.json(persons)
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

  const personInput = new Person(
    input.dni,
    input.firstName,
    input.lastName,
    input.phone,
    input.email,
    input.birthdate,
    input.password
  )

  //valido si el dni no esta repetido
  var repeatedPerson = await repository.findByDni({ dni: personInput.dni })

  if (repeatedPerson !== undefined) {
    return res.status(400).send({ message: 'DNI repetido' })
  }

  //valido si el mail no esta repetido
  repeatedPerson = await repository.findByEmail({ email: personInput.email })
  if (repeatedPerson !== undefined) {
    return res.status(400).send({ message: 'El mail ya esta en uso' })
  }

  if (personInput.password) {
    const hashedPassword = await hash(personInput.password, 10)
    personInput.password = hashedPassword
  }

  const person = await repository.add(personInput)
  return res.status(201).json({ message: 'Person created', data: person })
}

export async function update(req: Request, res: Response) {
  const id = req.params.id

  const repeatedPerson = await repository.findByDni({ dni: req.body.sanitizedInput.dni })

  if (repeatedPerson !== undefined) {
    if (repeatedPerson._id?.toString() !== id) {
      return res.status(400).send({ message: 'DNI repeated' })
    }
  }

  const person = await repository.update(req.body.sanitizedInput, req.params.id)

  if (person === undefined) {
    return res.status(404).send({ message: 'Person not found' })
  }

  return res.status(200).json(person)
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id

  const person = await repository.delete({ id })

  if (!person) {
    return res.status(404).send({ message: 'Person not found' })
  }
  return res.status(200).send({ message: 'Person deleted', data: person })
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
