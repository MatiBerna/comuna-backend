import { Schema, model } from 'mongoose'

export interface IEvento {
  description: string
  fechaHoraIni: Date
  fechaHoraFin: Date
}

const eventoSchema = new Schema<IEvento>(
  {
    description: { type: String, required: true },
    fechaHoraIni: { type: Date, required: true },
    fechaHoraFin: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false }
)

export default model('Evento', eventoSchema)
