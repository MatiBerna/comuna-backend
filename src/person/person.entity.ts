import { ObjectId } from 'mongodb'

//TODO: agregar password a todas las partes que se use persona
export class Person {
  constructor(
    public dni: string,
    public firstName: string,
    public lastName: string,
    public phone: string | undefined,
    public email: string,
    public birthdate: Date,
    public password: string,
    public _id?: ObjectId
  ) {}
}
