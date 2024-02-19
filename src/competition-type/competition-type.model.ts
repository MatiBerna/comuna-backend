import { PaginateModel, Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

export interface ICompetitionType {
  _id: string
  description: string
  image: string
  rules: string
}

const competitionTypeSchema = new Schema<ICompetitionType>(
  {
    description: { type: String, required: true },
    image: { type: String, required: true },
    rules: { type: String, required: true },
  },
  { collection: 'competition_types', versionKey: false, timestamps: true }
)

competitionTypeSchema.plugin(paginate)

export default model<ICompetitionType>('CompetitionType', competitionTypeSchema) as PaginateModel<ICompetitionType>
