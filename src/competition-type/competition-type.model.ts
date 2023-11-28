import { ObjectId } from 'mongodb'
import { Schema, model } from 'mongoose'

// export class CompetitionType {
//   constructor(public description: string, public rules: string, public _id?: ObjectId) {}
// }

export interface ICompetitionType {
  description: string
  rules: string
}

const competitionTypeSchema = new Schema<ICompetitionType>(
  {
    description: { type: String, required: true },
    rules: { type: String, required: true },
  },
  { collection: 'competition_types', versionKey: false, timestamps: true }
)

export default model('CompetitionType', competitionTypeSchema)
