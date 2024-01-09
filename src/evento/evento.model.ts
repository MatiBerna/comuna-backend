import { Schema, model } from 'mongoose'

export interface IEvento {
  _id: string
  description: string
  fechaHoraIni: Date
  fechaHoraFin: Date
  image: string
}

const eventoSchema = new Schema<IEvento>(
  {
    description: { type: String, required: true },
    fechaHoraIni: { type: Date, required: true },
    fechaHoraFin: { type: Date, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
)

export default model('Evento', eventoSchema)
