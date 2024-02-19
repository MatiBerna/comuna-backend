import { PaginateModel, Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

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

eventoSchema.plugin(paginate)

export default model<IEvento>('Evento', eventoSchema) as PaginateModel<IEvento>
