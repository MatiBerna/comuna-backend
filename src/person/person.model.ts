import { Schema, model } from 'mongoose'

export interface IPerson {
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

export default model('Person', personSchema)
