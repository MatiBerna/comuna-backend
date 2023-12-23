import { Schema, model } from 'mongoose'
import { IEvento } from '../evento/evento.model'
import { ICompetitionType } from '../competition-type/competition-type.model'
import { ObjectId } from 'mongodb'

export interface ICompetition {
  _id: ObjectId
  competitionType: ObjectId | ICompetitionType
  evento: ObjectId | IEvento
  descripcion: string
  fechaHoraIni: Date
  fechaHoraFinEstimada: Date
  premios: string
  costoInscripcion: number
}

const competitionSchema = new Schema(
  {
    competitionType: { type: Schema.Types.ObjectId, ref: 'CompetitionType', required: true },
    evento: { type: Schema.Types.ObjectId, ref: 'Evento', required: true },
    descripcion: { type: String, required: true },
    fechaHoraIni: { type: Date, required: true },
    fechaHoraFinEstimada: { type: Date, required: true },
    premios: { type: String, required: true },
    costoInscripcion: { type: Number, required: true },
  },
  { versionKey: false, timestamps: true }
)
competitionSchema.index({ competitionType: 1, evento: 1 }, { unique: true })

export default model('Competition', competitionSchema)
