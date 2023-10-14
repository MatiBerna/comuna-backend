import { ObjectId } from 'mongodb'

export class User {
  constructor(public email: string, public password: string, public rol: 'admin' | 'user', public id?: ObjectId) {}
}
