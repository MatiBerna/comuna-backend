export interface Repository<T> {
  findAll(): Promise<T[] | undefined>
  findOne(item: { id: string } | { id: number }): Promise<T | undefined>
  add(item: T): Promise<T | undefined>
  update(item: T, oldId: string | number): Promise<T | undefined>
  delete(item: { id: string } | { id: number }): Promise<T> | undefined
}
