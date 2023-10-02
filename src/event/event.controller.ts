import { Response, Request, NextFunction } from "express";
import { EventRepository } from "./event.repository.js";
import { Event } from "./event.entity.js";

const repository = new EventRepository()

export function sanitizePersonInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nro : req.body.nro,
    descripcion: req.body.descripcion,
    fecha_hora_ini: req.body.fecha_hora_ini,
    fecha_hora_fin: req.body.fecha_hora_fin,
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
  }

export async function findAll(req: Request, res: Response) {
  const events = await repository.findAll()
  res.json({ data: events })
}

export async function findOne(req: Request, res: Response) {
  const id = req.params.id
  const event = await repository.findOne({ id })

  if (!event) {
    return res.status(404).send({ message: 'Event not found' })
  }
  res.json({ data: event })
}
export async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const eventInput = new Event(input.nro, input.descripcion, input.fecha_hora_ini, input.fecha_hora_fin)

  const event = await repository.add(eventInput)
  return res.status(201).json({ message: 'Event created', data: event })
}

export async function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id

  const event = await repository.update(req.body.sanitizedInput)

  if (event === undefined) {
    return res.status(404).send({ message: 'Event not found' })
  }

  return res.status(200).send({ message: 'Event updated', data: event })
}

  export async function remove(req: Request, res: Response) {
  const id = req.params.id

  const event = await repository.delete({ id })

  if (!event) {
    return res.status(404).send({ message: 'Event not found' })
  }
  return res.status(200).send({ message: 'Event deleted', data: event })
}
