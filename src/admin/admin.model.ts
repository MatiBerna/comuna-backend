import { Schema, model } from 'mongoose'

export interface IAdmin {
  username: string
  role: string
  password?: string
}

const adminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'NSA' },
  },
  { collection: 'admins', versionKey: false, timestamps: true }
)

export default model('Admin', adminSchema)
