import { Request, Response } from 'express'
import { Result, validationResult } from 'express-validator'
import { PaginateOptions, PaginateResult } from 'mongoose'
import Competitor, { ICompetitor } from './competitor.model.js'
import Person from '../person/person.model.js'
import Competition from '../competition/competition.model.js'
import { MongoServerError } from 'mongodb'
export async function findAll(req: Request, res: Response) {
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  const page = Number(req.query.page)

  const options: PaginateOptions = {
    page: page,
    limit: 10,
    populate: ['person'],
  }

  let competitors: PaginateResult<ICompetitor>

  if (req.query.person) competitors = await Competitor.paginate({ person: req.query.person }, options)
  else if (req.query.competition) competitors = await Competitor.paginate({ competition: req.query.competition }, options)
  else competitors = await Competitor.paginate({}, options)

  res.json(competitors)
}
export async function findOne(req: Request, res: Response) {
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  try {
    const competitor: ICompetitor | null = await Competitor.findById(req.params.id)

    if (!competitor) {
      return res.status(404).send({ message: 'Competidor no encontrado' })
    }
    return res.json(competitor)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ message: 'Error interno del servidor de Datos' })
  }
}
export async function add(req: Request, res: Response) {
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  const competitorInput = new Competitor(req.body)

  try {
    const person = await Person.findById(competitorInput.person)

    if (!person) {
      return res.status(404).send({ message: 'Persona no encontrada' })
    }

    const competition = await Competition.findById(competitorInput.competition)

    if (!competition) {
      return res.status(404).send({ message: 'Competencia no encontrada' })
    }

    let inscriptionDeadLine = new Date(competition.fechaHoraIni)
    inscriptionDeadLine.setMonth(inscriptionDeadLine.getMonth() - 1)
    const now = new Date()

    if (now >= inscriptionDeadLine && now <= competition.fechaHoraIni) {
      competitorInput.fechaHoraInscripcion = now
    } else {
      return res.status(409).send({ message: 'La inscripción se encuentra cerrada' })
    }

    const competitor = await competitorInput.save()
    res.status(201).send({ message: 'Inscripción creada', data: competitor })
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError

    if (mongoErr.name === 'ValidationError') {
      console.log(mongoErr)
      return res.status(400).send({ message: 'Falta atributo/s requerido/s' })
    } else if (mongoErr.name === 'MongoServerError' && mongoErr.code === 11000) {
      return res.status(409).send({ message: 'Inscripción duplicada' })
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
    const competitor = await Competitor.findById(req.params.id)
    if (!competitor) {
      return res.status(404).send({ message: 'Inscripción no encontrada' })
    }
    if (req.body.person) {
      const person = await Person.findById(req.body.person)

      if (!person) {
        return res.status(404).send({ message: 'Persona no encontrada' })
      }
    }

    if (req.body.competition) {
      const competition = await Competition.findById(req.body.competition)

      if (!competition) {
        return res.status(404).send({ message: 'Competencia no encontrada' })
      }
    }

    const competition = await Competition.findById(req.body.competition || competitor.competition)

    let inscriptionDeadLine = new Date(competition!.fechaHoraIni)
    inscriptionDeadLine.setMonth(inscriptionDeadLine.getMonth() - 1)
    const now = new Date()

    if (now >= inscriptionDeadLine && now <= competition!.fechaHoraIni) {
      req.body.fechaHoraInscripcion = now
    } else {
      return res.status(409).send({ message: 'La inscripción se encuentra cerrada' })
    }
    const mCompetitor = await Competitor.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(mCompetitor)
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError

    if (mongoErr.name === 'MongoServerError' && mongoErr.code === 11000) {
      return res.status(409).send({ message: 'Inscripción duplicada' })
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
    const competencia = await Competitor.findByIdAndDelete(req.params.id)

    if (!competencia) {
      return res.status(404).send({ message: 'Inscripción no encontrada' })
    }
    return res.status(200).send({ message: 'Inscripción eliminada', data: competencia })
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(404).send({ message: 'Inscripción no encontrada' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}
