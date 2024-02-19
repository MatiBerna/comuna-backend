import { Response, Request } from 'express'
import Evento from './evento.model'
import { MongoServerError } from 'mongodb'
import mongoose, { PaginateOptions } from 'mongoose'
import Competition from '../competition/competition.model'
import { Result, validationResult } from 'express-validator'

export async function findAll(req: Request, res: Response) {
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  const prox = req.query.prox
  var filter = req.query.filter?.toString() || ''
  if (req.query.page) {
    const page = Number(req.query.page)

    const options: PaginateOptions = {
      page: page,
      limit: 10,
      sort: { fechaHoraIni: 1 },
    }
    if (prox === 'true') {
      const eventos = await Evento.paginate(
        { $and: [{ description: { $regex: new RegExp(filter, 'i') } }, { fechaHoraIni: { $gte: Date.now() } }] },
        options
      )
      return res.json(eventos)
    } else {
      const eventos = await Evento.paginate({ description: { $regex: new RegExp(filter, 'i') } }, options)
      return res.json(eventos)
    }
  } else {
    if (prox === 'true') {
      const eventos = await Evento.find({ fechaHoraIni: { $gte: Date.now() } }).sort({ fechaHoraIni: 1 })
      return res.json({ docs: eventos })
    }
  }
  const eventos = await Evento.find().sort({ fechaHoraIni: 1 })
  res.json({ docs: eventos })
}

export async function findOne(req: Request, res: Response) {
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }
  try {
    const evento = await Evento.findById(req.params.id)

    if (!evento) {
      return res.status(404).send({ message: 'Evento no encontrado' })
    }

    res.json(evento)
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(404).send({ message: 'Evento no encontrado' })
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

  const eventoInput = new Evento(req.body)

  try {
    if (eventoInput.fechaHoraIni > eventoInput.fechaHoraFin) {
      const fechaError = {
        type: 'field',
        value: eventoInput.fechaHoraIni,
        msg: 'La fecha y hora de iinicio debe ser anterior a la fecha y hora de finw',
        path: 'fechaHoraIni',
        location: 'body',
      }
      errors.push(fechaError)
    }
    if (eventoInput.fechaHoraIni.getTime() < Date.now()) {
      const fechaError = {
        type: 'field',
        value: eventoInput.fechaHoraIni,
        msg: 'Las fechas y horas no pueden ser anteriores a la fecha actual',
        path: 'fechaHoraIni',
        location: 'body',
      }
      errors.push(fechaError)
    }

    if (errors.length !== 0) {
      return res.status(400).json({ errors: errors })
    }

    const solapados = await Evento.find({
      $nor: [{ fechaHoraIni: { $gte: eventoInput.fechaHoraFin } }, { fechaHoraFin: { $lte: eventoInput.fechaHoraIni } }],
    })

    if (solapados.length !== 0) {
      return res.status(409).send({ message: 'Los horarios del evento se solapan con uno cargado anteriormente' })
    }

    const evento = await eventoInput.save()
    return res.status(201).json({ message: 'Evento creado', data: evento })
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError
    if (mongoErr.name === 'ValidationError') {
      return res.status(400).send({ message: 'La descripcion del evento es requerida' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}

export async function update(req: Request, res: Response) {
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).send({ message: 'Evento no encontrado' })
  }

  try {
    const evento = await Evento.findById(req.params.id)

    if (evento) {
      if ((req.body.fechaHoraFin || evento.fechaHoraFin) < (req.body.fechaHoraIni || evento.fechaHoraIni)) {
        const fechaError = {
          type: 'field',
          value: req.body.fechaHoraIni,
          msg: 'La fecha y hora de fin debe ser posterior a la fecha y hora de inicio',
          path: 'fechaHoraIni',
          location: 'body',
        }
        errors.push(fechaError)
      }

      const fechaHoraIni: Date = new Date(req.body.fechaHoraIni || evento.fechaHoraIni)
      const timestamp: number = fechaHoraIni.getTime()
      if (timestamp < Date.now()) {
        const fechaError = {
          type: 'field',
          value: fechaHoraIni,
          msg: 'Las fechas y horas no pueden ser anteriores a la fecha actual',
          path: 'fechaHoraIni',
          location: 'body',
        }
        errors.push(fechaError)
      }
      const solapados = await findSolapados(
        req.body.fechaHoraIni || evento.fechaHoraIni,
        req.body.fechaHoraFin || evento.fechaHoraFin,
        req.params.id
      )

      if (solapados.length !== 0) {
        return res.status(409).send({ message: 'Los horarios del evento se solapan con uno cargado anteriormente' })
      }
    } else {
      return res.status(404).send({ message: 'Evento no encontrado' })
    }

    if (errors.length !== 0) {
      return res.status(400).send({ errors: errors })
    }

    const mEvento = await Evento.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!mEvento) {
      return res.status(404).send({ message: 'Evento no encontrado' })
    }
    res.json(mEvento)
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      console.log(err.message)
      return res.status(404).send({ message: 'Evento no encontrado' })
    } else {
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}

export async function remove(req: Request, res: Response) {
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).send({ message: 'Evento no encontrado' })
    }
    const competenciasEvento = await Competition.find({ evento: req.params.id })

    if (competenciasEvento.length !== 0) {
      return res.status(409).send({ message: 'El evento tiene competencias cargadas' })
    }
    const evento = await Evento.findByIdAndDelete(req.params.id)

    if (!evento) {
      return res.status(404).send({ message: 'Evento no encontrado' })
    }
    return res.status(200).send({ message: 'Evento eliminado', data: evento })
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(404).send({ message: 'Evento no encontrado' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}

async function findSolapados(fechaHoraIni: Date, fechaHoraFin: Date, id: string) {
  const solapados = await Evento.find({
    $and: [{ $nor: [{ fechaHoraIni: { $gte: fechaHoraFin } }, { fechaHoraFin: { $lte: fechaHoraIni } }] }, { _id: { $ne: id } }],
  })

  return solapados
}
