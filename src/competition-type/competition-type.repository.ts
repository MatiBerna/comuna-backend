import { Repository } from '../shared/repository.js'
import { readJSON } from '../utils.js'
import { CompetitionType } from './competition-type.entity'
import { db } from '../shared/db/conn.js'
import { ObjectId } from 'mongodb'

const competitionTypes = db.collection<CompetitionType>('competition_types')

export class CompetitionTypeRepository implements Repository<CompetitionType> {
  public async findAll(): Promise<CompetitionType[] | undefined> {
    return await competitionTypes.find().toArray()
  }
  public async findOne(item: { id: string }): Promise<CompetitionType | undefined> {
    try {
      const _id = new ObjectId(item.id)
      return (await competitionTypes.findOne({ _id })) || undefined
    } catch (err) {
      return undefined
    }
  }

  public async add(item: CompetitionType): Promise<CompetitionType | undefined> {
    item._id = (await competitionTypes.insertOne(item)).insertedId
    return item
  }

  public async update(item: CompetitionType, oldId: string): Promise<CompetitionType | undefined> {
    try {
      const _id = new ObjectId(oldId)
      return (await competitionTypes.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined
    } catch (err) {
      return undefined
    }
  }

  public async delete(item: { id: string }): Promise<CompetitionType | undefined> {
    try {
      const _id = new ObjectId(item.id)
      return (await competitionTypes.findOneAndDelete({ _id })) || undefined
    } catch (err) {
      return undefined
    }
  }
}
