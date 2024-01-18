import { ObjectId } from 'mongodb'
import { IPerson } from '../person/person.model'
import { ICompetition } from '../competition/competition.model'
import { PaginateModel, Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

export interface ICompetitor {
  _id: ObjectId
  person: ObjectId | IPerson
  competition: ObjectId | ICompetition
  fechaHoraInscripcion: Date
}

const competitorSchema = new Schema<ICompetitor>(
  {
    person: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
    competition: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
    fechaHoraInscripcion: { type: Date, required: true },
  },
  { versionKey: false, timestamps: true }
)

competitorSchema.index({ competition: 1, person: 1 }, { unique: true })

competitorSchema.plugin(paginate)

export default model<ICompetitor>('Competitor', competitorSchema) as PaginateModel<ICompetitor>
