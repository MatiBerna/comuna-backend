import { Response, Request } from 'express'
import Evento from './evento.model.js'
import { MongoServerError } from 'mongodb'

export async function findAll(req: Request, res: Response) {
  const eventos = await Evento.find()
  res.json(eventos)
}

export async function findOne(req: Request, res: Response) {
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
  if (req.body.fechaHoraIni && new Date(req.body.fechaHoraIni).toString() === 'Invalid Date') {
    return res.status(400).send({ message: 'La fecha de inicio debe ser una fecha valida' })
  }
  if (req.body.fechaHoraFin && new Date(req.body.fechaHoraFin).toString() === 'Invalid Date') {
    return res.status(400).send({ message: 'La fecha de fin estimada debe ser una fecha valida' })
  }
  const eventoInput = new Evento(req.body)

  try {
    if (eventoInput.fechaHoraIni && eventoInput.fechaHoraFin) {
      if (eventoInput.fechaHoraIni > eventoInput.fechaHoraFin) {
        return res.status(400).send({ message: 'La fecha de fin no puede ser anterior a la fecha de inicio' })
      }
      if (eventoInput.fechaHoraIni.getTime() < Date.now()) {
        return res.status(400).send({ message: 'Las fechas y horas no pueden ser anteriores a la fecha actual' })
      }

      const solapados = await Evento.find({
        $nor: [{ fechaHoraIni: { $gte: eventoInput.fechaHoraFin } }, { fechaHoraFin: { $lte: eventoInput.fechaHoraIni } }],
      })

      if (solapados.length !== 0) {
        return res.status(409).send({ message: 'Los horarios del evento se solapan con uno cargado anteriormente' })
      }
    } else {
      if (eventoInput.fechaHoraIni) {
        return res.status(400).send({ message: 'La fecha de fin es un atributo requerido' })
      } else {
        return res.status(400).send({ message: 'La fecha de inicio es un atributo requerido' })
      }
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
  try {
    //verifico que se pasen como parametros fecha hora ini y fin
    if (req.body.fechaHoraIni && req.body.fechaHoraFin) {
      if (new Date(req.body.fechaHoraIni).toString() === 'Invalid Date') {
        return res.status(400).send({ message: 'La fecha de inicio debe ser una fecha valida' })
      }
      if (new Date(req.body.fechaHoraFin).toString() === 'Invalid Date') {
        return res.status(400).send({ message: 'La fecha de fin debe ser una fecha valida' })
      }
      //hora inicio mayor a hora fin, imposible
      if (req.body.fechaHoraIni > req.body.fechaHoraFin) {
        return res.status(400).send({ message: 'La fecha de fin no puede ser anterior a la fecha de inicio' })
      }
      //creo nueva fecha con la obtenida
      const fechaHoraIni: Date = new Date(req.body.fechaHoraIni)

      const timestamp: number = fechaHoraIni.getTime()
      if (timestamp < Date.now()) {
        return res.status(400).send({ message: 'Las fechas no pueden ser anteriores a la fecha actual' })
      }
      //busco solapados
      const solapados = await findSolapados(req.body.fechaHoraIni, req.body.fechaHoraFin, req.params.id)

      if (solapados.length !== 0) {
        return res.status(409).send({ message: 'Los horarios del evento se solapan con uno cargado anteriormente' })
      }
    } else if (req.body.fechaHoraIni) {
      if (new Date(req.body.fechaHoraIni).toString() === 'Invalid Date') {
        return res.status(400).send({ message: 'La fecha de inicio debe ser una fecha valida' })
      }
      const evento = await Evento.findById(req.params.id)

      if (evento) {
        if (evento.fechaHoraFin < req.body.fechaHoraIni) {
          return res.status(400).send({ message: 'La fecha de fin no puede ser anterior a la fecha de inicio' })
        }

        const solapados = await findSolapados(req.body.fechaHoraIni, evento.fechaHoraFin, req.params.id)

        if (solapados.length !== 0) {
          return res.status(409).send({ message: 'Los horarios del evento se solapan con uno cargado anteriormente' })
        }
      }
    } else if (req.body.fechaHoraFin) {
      if (new Date(req.body.fechaHoraFin).toString() === 'Invalid Date') {
        return res.status(400).send({ message: 'La fecha de fin debe ser una fecha valida' })
      }
      const evento = await Evento.findById(req.params.id)

      if (evento) {
        if (evento.fechaHoraFin < req.body.fechaHoraIni) {
          return res.status(400).send({ message: 'La fecha de fin no puede ser anterior a la fecha de inicio' })
        }

        const solapados = await findSolapados(evento.fechaHoraIni, req.body.fechaHoraFin, req.params.id)

        if (solapados.length !== 0) {
          return res.status(409).send({ message: 'Los horarios del evento se solapan con uno cargado anteriormente' })
        }
      }
    }

    const mEvento = await Evento.findByIdAndUpdate(req.params.id, req.body, { new: true })
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
  try {
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
