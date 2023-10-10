import { ObjectId } from 'mongodb'

export class CompetitionType {
  constructor(public description: string, public rules: string, public _id?: ObjectId) {}
}
