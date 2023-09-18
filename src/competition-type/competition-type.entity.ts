export class CompetitionType {
  public static lastId = 4
  public id: number

  constructor(public description: string, public rules: string) {
    CompetitionType.lastId++
    this.id = CompetitionType.lastId
  }
}
