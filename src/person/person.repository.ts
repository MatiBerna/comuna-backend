import { ObjectId } from 'mongodb'
import { db } from '../shared/db/conn.js'
import { Repository } from '../shared/repository.js'
import { readJSON } from '../utils.js'
import { Person } from './person.entity.js'

const persons = db.collection<Person>('persons')

export class PersonRepository implements Repository<Person> {
  public async findAll(): Promise<Person[] | undefined> {
    return await persons.find().toArray()
  }
  public async findOne(item: { id: string }): Promise<Person | undefined> {
    const _id = new ObjectId(item.id)
    return (await persons.findOne({ _id })) || undefined
  }

  public async add(item: Person): Promise<Person | undefined> {
    item._id = (await persons.insertOne(item)).insertedId
    return item
  }

  public async update(item: Person, oldId: string): Promise<Person | undefined> {
    const _id = new ObjectId(oldId)
    return (await persons.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined
  }

  public async delete(item: { id: string }): Promise<Person | undefined> {
    const _id = new ObjectId(item.id)
    return (await persons.findOneAndDelete({ _id })) || undefined
  }

  public async findByDni(item: { dni: string }): Promise<Person | undefined> {
    return (await persons.findOne(item)) || undefined
  }
}
