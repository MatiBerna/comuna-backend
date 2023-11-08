// import { ObjectId } from 'mongodb'
// import { db } from '../shared/db/conn.js'
// import { Repository } from '../shared/repository.js'
// import { Admin } from './admin.model.js'

// const admins = db.collection<Admin>('admins')

// export class AdminRepository implements Repository<Admin> {
//   public async findAll(): Promise<Admin[] | undefined> {
//     return await admins.find().toArray()
//   }

//   public async findOne(item: { id: string }): Promise<Admin | undefined> {
//     try {
//       const _id = new ObjectId(item.id)
//       return (await admins.findOne({ _id })) || undefined
//     } catch (err) {
//       return undefined
//     }
//   }

//   public async add(item: Admin): Promise<Admin | undefined> {
//     item._id = (await admins.insertOne(item)).insertedId
//     return item
//   }

//   public async update(item: Admin, oldId: string | number): Promise<Admin | undefined> {
//     try {
//       const _id = new ObjectId(oldId)
//       return (await admins.findOneAndUpdate({ _id }, { $set: item }, { returnDocument: 'after' })) || undefined
//     } catch (err) {
//       return undefined
//     }
//   }

//   public async delete(item: { id: string } | { id: number }): Promise<Admin | undefined> {
//     try {
//       const _id = new ObjectId(item.id)
//       return (await admins.findOneAndDelete({ _id })) || undefined
//     } catch (err) {
//       return undefined
//     }
//   }

//   public async findByUsername(item: { username: string }): Promise<Admin | undefined> {
//     return (await admins.findOne(item)) || undefined
//   }
// }
