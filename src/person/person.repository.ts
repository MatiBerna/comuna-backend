import { Repository } from '../shared/repository.js'
import { readJSON } from '../utils.js'
import { Person } from './person.entity.js'

const persons = readJSON('../src/person/persons.json')

export class PersonRepository implements Repository<Person> {
  public async findAll(): Promise<Person[] | undefined> {
    return persons
  }
  public async findOne(item: { id: string }): Promise<Person | undefined> {
    return persons.find((person: Person) => person.id === item.id)
  }

  public async add(item: Person): Promise<Person | undefined> {
    persons.push(item)
    return item
  }

  public update(item: Person): Promise<Person | undefined> {
    const personIndex = persons.findIndex((person: Person) => person.id === item.id)

    if (personIndex !== -1) {
      persons[personIndex] = { ...persons[personIndex], ...item }
    }
    return persons[personIndex]
  }

  public delete(item: { id: string }): Promise<Person> | undefined {
    const personIndex = persons.findIndex((person: Person) => person.id === item.id)

    if (personIndex !== -1) {
      const deletedPerson = persons[personIndex]
      persons.splice(personIndex, 1)
      return deletedPerson
    }
  }

  public findByDni(item: { dni: string }): Promise<Person | undefined> {
    return persons.find((person: Person) => person.dni === item.dni)
  }
}
