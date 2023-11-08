import { ObjectId } from 'mongodb'

export class Admin {
  constructor(public username: string, public password?: string, public _id?: ObjectId) {}
}
