import { Repository } from '../shared/repository.js'
import { readJSON } from '../utils.js'
import { CompetitionType } from './competition-type.entity'

const competitionTypes = readJSON('../src/competition-type/competition-type.json')

export class CompetitionTypeRepository implements Repository<CompetitionType> {
  public async findAll(): Promise<CompetitionType[] | undefined> {
    return competitionTypes
  }
  public async findOne(item: { id: number }): Promise<CompetitionType | undefined> {
    return competitionTypes.find((competitionTypes: CompetitionType) => competitionTypes.id === item.id)
  }

  public async add(item: CompetitionType): Promise<CompetitionType | undefined> {
    competitionTypes.push(item)
    return item
  }

  public update(item: CompetitionType, oldId: number): Promise<CompetitionType | undefined> {
    const competitionTypeIndex = competitionTypes.findIndex((competitionType: CompetitionType) => competitionType.id === oldId)

    if (competitionTypeIndex !== -1) {
      competitionTypes[competitionTypeIndex] = { ...competitionTypes[competitionTypeIndex], ...item }
    }
    return competitionTypes[competitionTypeIndex]
  }

  public delete(item: { id: number }): Promise<CompetitionType> | undefined {
    const competitionTypeIndex = competitionTypes.findIndex((competitionType: CompetitionType) => competitionType.id === item.id)

    if (competitionTypeIndex !== -1) {
      const deletedCompetitionType = competitionTypes[competitionTypeIndex]
      competitionTypes.splice(competitionTypeIndex, 1)
      return deletedCompetitionType
    }
  }
}
