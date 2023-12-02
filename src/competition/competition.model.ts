import { Schema, model } from 'mongoose'
import { IEvento } from '../evento/evento.model'
import { ICompetitionType } from '../competition-type/competition-type.model'
import { ObjectId } from 'mongodb'

export interface ICompetition {
  _id: ObjectId
  _idCompetitionType?: string
  _idEvento?: string
  evento?: IEvento
  competitionType?: ICompetitionType
  descripcion: string
  fechaHoraIni: Date
  fechaHoraFinEstimada: Date
  premios: string
  costoInscripcion: number
}

const competitionSchema = new Schema(
  {
    _idCompetitionType: { type: String, required: true },
    _idEvento: { type: String, required: true },
    descripcion: { type: String, required: true },
    fechaHoraIni: { type: Date, required: true },
    fechaHoraFinEstimada: { type: Date, required: true },
    premios: { type: String, required: true },
    costoInscripcion: { type: Number, required: true },
  },
  { versionKey: false, timestamps: true }
)
competitionSchema.index({ _idCompetitionType: 1, _idEvento: 1 }, { unique: true })

export default model('Competition', competitionSchema)
