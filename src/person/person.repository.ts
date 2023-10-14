import { ObjectId } from 'mongodb'
import { db } from '../shared/db/conn.js'
import { Repository } from '../shared/repository.js'
import { Person } from './person.entity.js'

const persons = db.collection<Person>('persons')

export class PersonRepository implements Repository<Person> {
  public async findAll(): Promise<Person[] | undefined> {
    return await persons.find().toArray()
  }
  public async findOne(item: { id: string }): Promise<Person | undefined> {
    try {
      const _id = new ObjectId(item.id)
      return (await persons.findOne({ _id })) || undefined
    } catch (err) {
      return undefined
    }
  }

  public async add(item: Person): Promise<Person | undefined> {
    item._id = (await persons.insertOne(item)).insertedId
    return item
  }

  public async update(item: Person, oldId: string): Promise<Person | undefined> {
    try {
      const _id = new ObjectId(oldId)
      return (await persons.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined
    } catch (err) {
      return undefined
    }
  }

  public async delete(item: { id: string }): Promise<Person | undefined> {
    try {
      const _id = new ObjectId(item.id)
      return (await persons.findOneAndDelete({ _id })) || undefined
    } catch (err) {
      return undefined
    }
  }

  public async findByDni(item: { dni: string }): Promise<Person | undefined> {
    return (await persons.findOne(item)) || undefined
  }

  public async findByEmail(item: { email: string }): Promise<Person | undefined> {
    return (await persons.findOne(item)) || undefined
  }
}
