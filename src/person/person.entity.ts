import { randomUUID } from 'crypto'

export class Person {
  constructor(
    public dni: string,
    public firstName: string,
    public lastName: string,
    public phone: string | undefined,
    public email: string,
    public birthdate: Date,
    public id = randomUUID()
  ) {}
}
