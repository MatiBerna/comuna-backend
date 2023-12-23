import { Schema, model } from 'mongoose'

export interface ICompetitionType {
  _id: string
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
