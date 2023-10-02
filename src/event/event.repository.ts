
import { Repository } from "../shared/repository.js";
import { readJSON } from "../utils.js";
import { Event } from "./event.entity.js";

const events = readJSON('../src/event/event.json')

export class EventRepository implements Repository<Event>{
  public async findAll(): Promise<Event[] | undefined> {
    return events
  }
  public async findOne(item: { id: string }): Promise<Event | undefined> {
    return events.find((event: Event) => event.id === item.id)
  }

  public async add(item: Event): Promise<Event | undefined> {
    events.push(item)
    return item
  }

  public update(item: Event): Promise<Event | undefined> {
    const eventIndex = events.findIndex((event: Event) => event.id === item.id)

    if (eventIndex !== -1) {
      events[eventIndex] = { ...events[eventIndex], ...item }
    }
    return events[eventIndex]
  }

  public delete(item: { id: string }): Promise< Event> | undefined {
    const eventIndex = events.findIndex((event: Event) => event.id === item.id)

    if (eventIndex !== -1) {
      const deletedEvent = events[eventIndex]
      events.splice(eventIndex, 1)
      return deletedEvent
    }
  }
}