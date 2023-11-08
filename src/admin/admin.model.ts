import { ObjectId } from 'mongodb'
import { Schema, model } from 'mongoose'

// export class Admin {
//   constructor(public username: string, public password?: string, public _id?: ObjectId) {}
// }

export interface IAdmin {
  username: string
  password?: string
}

const adminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: 'admins', versionKey: false, timestamps: true }
)

export default model('Admin', adminSchema)
