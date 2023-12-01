import { Request, Response } from 'express'
import Competition from './competition.model.js'
import { MongoServerError } from 'mongodb'
import Evento from '../evento/evento.model.js'
import CompetitionType from '../competition-type/competition-type.model.js'
import mongoose from 'mongoose'

export async function findAll(req: Request, res: Response) {
  const competitions = await Competition.find()
  res.json(competitions)
}

export async function findOne(req: Request, res: Response) {
  try {
    const competition = await Competition.findById(req.params.id)

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
  if (req.body.costoInscripcion && isNaN(req.body.costoInscripcion)) {
    return res.status(400).send({ message: 'El costo de inscripcion debe ser un numero real' })
  }
  if (req.body.fechaHoraIni && new Date(req.body.fechaHoraIni).toString() === 'Invalid Date') {
    return res.status(400).send({ message: 'La fecha de inicio debe ser una fecha valida' })
  }
  if (req.body.fechaHoraFinEstimada && new Date(req.body.fechaHoraFinEstimada).toString() === 'Invalid Date') {
    return res.status(400).send({ message: 'La fecha de fin estimada debe ser una fecha valida' })
  }

  const competenciaInput = new Competition(req.body)

  try {
    if (competenciaInput.fechaHoraFinEstimada < competenciaInput.fechaHoraIni) {
      return res.status(400).send({ message: 'La fecha de fin no puede ser anterior a la fecha de inicio' })
    }

    if (!mongoose.Types.ObjectId.isValid(competenciaInput._idEvento)) {
      return res.status(400).send({ message: 'No existe Evento con el id ingresado' })
    }
    const evento = await Evento.findById(competenciaInput._idEvento)

    if (evento) {
      if (evento.fechaHoraIni > competenciaInput.fechaHoraIni || evento.fechaHoraFin < competenciaInput.fechaHoraFinEstimada) {
        return res.status(400).send({ message: 'La fechas ingresadas estan fuera del rango del evento' })
      }
    } else {
      return res.status(400).send({ message: 'No existe Evento con el id ingresado' })
    }

    if (!mongoose.Types.ObjectId.isValid(competenciaInput._idCompetitionType)) {
      return res.status(400).send({ message: 'No existe Tipo de Competencia con el id ingresado' })
    }
    const competitionType = await CompetitionType.findById(competenciaInput._idCompetitionType)

    if (!competitionType) {
      return res.status(400).send({ message: 'No existe Tipo de Competencia con el id ingresado' })
    }

    const competencia = await competenciaInput.save()
    res.status(201).send({ message: 'Competencia creada', data: competencia })
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError

    if (mongoErr.name === 'ValidationError') {
      return res.status(400).send({ message: 'Falta atributo/s requerido/s' })
    } else if (mongoErr.name === 'MongoServerError' && mongoErr.code === 11000) {
      return res.status(400).send({ message: 'Competencia en el evento duplicada' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}

export async function update(req: Request, res: Response) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ message: 'No existe Competencia con el id ingresado' })
    }
    const competencia = await Competition.findById(req.params.id)
    if (competencia) {
      if (req.body.fechaHoraIni || req.body.fechaHoraFinEstimada) {
        var fechaHoraIni: Date | undefined = undefined
        var fechaHoraFinEstimada: Date | undefined = undefined

        if (req.body.fechaHoraIni) {
          fechaHoraIni = new Date(req.body.fechaHoraIni)
          if (fechaHoraIni.toString() === 'Invalid Date') {
            return res.status(400).send({ message: 'Fecha de inicio ingresada invalida' })
          }
        }
        if (req.body.fechaHoraFinEstimada) {
          fechaHoraFinEstimada = new Date(req.body.fechaHoraFinEstimada)
          if (fechaHoraFinEstimada.toString() === 'Invalid Date') {
            return res.status(400).send({ message: 'Fecha de fin estimada ingresada invalida' })
          }
        }

        if ((fechaHoraIni || competencia.fechaHoraIni) > (fechaHoraFinEstimada || competencia.fechaHoraFinEstimada)) {
          return res.status(400).send({ message: 'La fecha de fin no puede ser anterior a la fecha de inicio' })
        }

        if (req.body._idEvento && !mongoose.Types.ObjectId.isValid(req.body._idEvento)) {
          return res.status(400).send({ message: 'No existe Evento con el id ingresado' })
        }
        const evento = await Evento.findById(req.body._idEvento || competencia._idEvento)

        if (evento) {
          // validar que las fechas no se vayan del rango del evento
          if (
            evento.fechaHoraIni > (fechaHoraIni || competencia.fechaHoraIni) ||
            evento.fechaHoraFin < (fechaHoraFinEstimada || competencia.fechaHoraFinEstimada)
          ) {
            return res.status(400).send({ message: 'Las fechas ingresadas estan fuera del rango del evento' })
          }
        } else {
          return res.status(400).send({ message: 'No existe ningun evento con el id ingresado' })
        }
      }
      if (req.body._idCompetitionType && !mongoose.Types.ObjectId.isValid(req.body._idCompetitionType)) {
        return res.status(400).send({ message: 'No existe Tipo de Competencia con el id ingresado' })
      }
      const tipoCompetencia = await CompetitionType.findById(req.body._idCompetitionType || competencia._idCompetitionType)
      if (!tipoCompetencia) {
        return res.status(400).send({ message: 'No existe tipo de competencia con el id ingresado' })
      }

      if (req.body.costoInscripcion && isNaN(req.body.costoInscripcion)) {
        return res.status(400).send({ message: 'El costo de inscripcion debe ser un numero real' })
      }

      const mCompetencia = await Competition.findByIdAndUpdate(req.params.id, req.body, { new: true })
      res.json(mCompetencia)
    } else {
      return res.status(400).send({ message: 'No existe una competencia con el id ingresado' })
    }
  } catch (err) {
    const mongoErr: MongoServerError = err as MongoServerError

    if (mongoErr.name === 'MongoServerError' && mongoErr.code === 11000) {
      return res.status(400).send({ message: 'Competencia en el evento duplicada' })
    } else {
      console.log(err)
      return res.status(500).send({ message: 'Error interno del servidor de Datos' })
    }
  }
}

export async function remove(req: Request, res: Response) {
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
