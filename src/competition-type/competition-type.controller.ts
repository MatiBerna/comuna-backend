import { Response, Request } from 'express'
import CompetitionType from './competition-type.model.js'
import { MongoServerError } from 'mongodb'
import mongoose from 'mongoose'
import Competition from '../competition/competition.model.js'
import { Result, validationResult } from 'express-validator'

export async function findAll(req: Request, res: Response) {
  const competitionTypes = await CompetitionType.find()
  res.json(competitionTypes)
}

export async function findOne(req: Request, res: Response) {
  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }
  try {
    const competitionType = await CompetitionType.findById(req.params.id)

    if (!competitionType) {
      return res.status(404).send({ message: 'Tipo de competencia no encontrado' })
    }
    res.json(competitionType)
  } catch (err) {
    console.log(err)
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(404).send({ message: 'Tipo de competencia no encontrado' })
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

  const competitionTypeInput = new CompetitionType(req.body)

  try {
    const competitionType = await competitionTypeInput.save()
    return res.status(201).json({ message: 'Tipo de Competencia creado', data: competitionType })
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError
    if (mongoErr.name === 'ValidationError') {
      return res.status(400).send({ message: 'Falta un atributo requerido' })
    } else {
      return res.status(500).send({ message: 'Error interno del servidor' })
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
    const competitionType = await CompetitionType.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!competitionType) {
      return res.status(404).send({ message: 'Tipo de competencia no encontrado' })
    }

    return res.status(200).send({ message: 'Tipo de Competencia actualizado', data: competitionType })
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(404).send({ message: 'Tipo de competencia no encontrado' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}

export async function remove(req: Request, res: Response) {
  const id = req.params.id

  const result: Result = validationResult(req)
  const errors = result.array()

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: errors })
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send({ message: 'Tipo de competencia no encontrado' })
    }

    const competitionsOfType = await Competition.find({ competitionType: id })

    if (competitionsOfType.length !== 0) {
      return res.status(409).send({ message: 'Hay competencias del tipo seleccionado' })
    }
    const competitionType = await CompetitionType.findByIdAndDelete(req.params.id)

    if (!competitionType) {
      return res.status(404).send({ message: 'Tipo de competencia no encontrado' })
    }
    return res.status(200).send({ message: 'Tipo de Competencia eliminado', data: competitionType })
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(404).send({ message: 'Tipo de competencia no encontrado' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}
