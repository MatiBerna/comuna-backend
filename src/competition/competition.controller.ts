import { Request, Response } from 'express'
import Competition, { ICompetition } from './competition.model.js'
import { MongoServerError } from 'mongodb'
import Evento, { IEvento } from '../evento/evento.model.js'
import CompetitionType, { ICompetitionType } from '../competition-type/competition-type.model.js'
import { Result, validationResult } from 'express-validator'

export async function findAll(req: Request, res: Response) {
  let competitions: ICompetition[]

  if (req.query.prox === 'true') {
    competitions = await Competition.find({ fechaHoraIni: { $gte: Date.now() } })
      .sort({ fechaHoraIni: 1 })
      .populate('competitionType')
      .populate('evento')
  } else if (req.query.disp === 'true') {
    const now = Date.now()
    const twoDaysLater = now + 2 * 24 * 60 * 60 * 1000
    competitions = await Competition.find({ fechaHoraIni: { $gte: now, $lte: twoDaysLater } })
      .sort({ fechaHoraIni: 1 })
      .populate('competitionType')
      .populate('evento')
  } else {
    console.log('hola')
    competitions = await Competition.find().sort({ fechaHoraIni: 1 }).populate('competitionType').populate('evento')
  }

  res.json(competitions)
}

export async function findOne(req: Request, res: Response) {
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }
  try {
    let competition: any = await Competition.findById(req.params.id).populate('competitionType').populate('evento')

    if (!competition) {
      return res.status(404).send({ message: 'Competencia no encontrada' })
    }

    res.json(competition)
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(404).send({ message: 'Competencia no encontrada' })
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

  const competenciaInput = new Competition(req.body)

  try {
    const evento = await Evento.findById(competenciaInput.evento)

    if (evento) {
      if (evento.fechaHoraIni > competenciaInput.fechaHoraIni) {
        const fechaError = {
          type: 'field',
          value: competenciaInput.fechaHoraIni,
          msg: 'La fecha de inicio esta fuera del rango del evento',
          path: 'fechaHoraIni',
          location: 'body',
        }
        errors.push(fechaError)
      }
      if (evento.fechaHoraFin < competenciaInput.fechaHoraFinEstimada) {
        const fechaError = {
          type: 'field',
          value: competenciaInput.fechaHoraFinEstimada,
          msg: 'La fecha de fin estimada esta fuera del rango del evento',
          path: 'fechaHoraFinEstimada',
          location: 'body',
        }
        errors.push(fechaError)
      }
    } else {
      return res.status(404).send({ message: 'Evento no encontrado' })
    }

    const competitionType = await CompetitionType.findById(competenciaInput.competitionType)

    if (!competitionType) {
      return res.status(404).send({ message: 'Tipo de Competencia no encontrada' })
    }

    if (errors.length !== 0) {
      return res.status(400).json({ errors: errors })
    }

    const competencia = await competenciaInput.save()
    res.status(201).send({ message: 'Competencia creada', data: competencia })
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError

    if (mongoErr.name === 'ValidationError') {
      console.log(mongoErr)
      return res.status(400).send({ message: 'Falta atributo/s requerido/s' })
    } else if (mongoErr.name === 'MongoServerError' && mongoErr.code === 11000) {
      return res.status(409).send({ message: 'Competencia en el evento duplicada' })
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

  try {
    const competencia = await Competition.findById(req.params.id)
    if (competencia) {
      if (req.body.fechaHoraIni || req.body.fechaHoraFinEstimada) {
        var fechaHoraIni: Date | undefined = undefined
        var fechaHoraFinEstimada: Date | undefined = undefined

        if (req.body.fechaHoraIni) fechaHoraIni = new Date(req.body.fechaHoraIni)
        if (req.body.fechaHoraFinEstimada) fechaHoraFinEstimada = new Date(req.body.fechaHoraFinEstimada)

        if ((fechaHoraIni || competencia.fechaHoraIni) > (fechaHoraFinEstimada || competencia.fechaHoraFinEstimada)) {
          const fechaError = {
            type: 'field',
            value: fechaHoraIni || competencia?.fechaHoraIni,
            msg: 'La fecha y hora de fin debe ser posterior a la fecha y hora de inicio',
            path: 'fechaHoraIni',
            location: 'body',
          }
          errors.push(fechaError)
        }

        const evento = await Evento.findById(req.body.evento || competencia.evento)

        if (evento) {
          if (
            evento.fechaHoraIni > (fechaHoraIni || competencia.fechaHoraIni) ||
            evento.fechaHoraFin < (fechaHoraFinEstimada || competencia.fechaHoraFinEstimada)
          ) {
            const fechaError = {
              type: 'field',
              value: fechaHoraIni || competencia?.fechaHoraIni,
              msg: 'Las fechas ingresadas estan fuera del rango del evento',
              path: 'fechaHoraIni',
              location: 'body',
            }
            errors.push(fechaError)
          }
        } else {
          return res.status(404).send({ message: 'Evento no encontrado' })
        }
      } else {
        const evento = await Evento.findById(req.body.evento || competencia.evento)
        if (!evento) {
          return res.status(404).send({ message: 'Evento no encontrado' })
        }
      }

      const tipoCompetencia = await CompetitionType.findById(req.body.competitionType || competencia.competitionType)
      if (!tipoCompetencia) {
        return res.status(404).send({ message: 'Tipo de Competencia no encontrada' })
      }

      if (errors.length !== 0) {
        return res.status(400).json({ errors: errors })
      }

      const mCompetencia = await Competition.findByIdAndUpdate(req.params.id, req.body, { new: true })
      res.json(mCompetencia)
    } else {
      return res.status(404).send({ message: 'Competencia no encontrada' })
    }
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError

    if (mongoErr.name === 'MongoServerError' && mongoErr.code === 11000) {
      return res.status(409).send({ message: 'Competencia en el evento duplicada' })
    } else {
      console.log(err)
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
    const competencia = await Competition.findByIdAndDelete(req.params.id)

    if (!competencia) {
      return res.status(404).send({ message: 'Competencia no encontrada' })
    }
    return res.status(200).send({ message: 'Competencia eliminada', data: competencia })
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(404).send({ message: 'Competencia no encontrada' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}
