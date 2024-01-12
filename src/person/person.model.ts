import { ObjectId } from 'mongodb'
import { PaginateModel, Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

export interface IPerson {
  _id: ObjectId
  dni: string
  firstName: string
  lastName: string
  phone?: string
  email: string
  birthdate: Date
  password: string
}

const personSchema = new Schema<IPerson>(
  {
    dni: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    birthdate: { type: Date, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false, collection: 'persons' }
)

personSchema.plugin(paginate)

export default model<IPerson>('Person', personSchema) as PaginateModel<IPerson>
