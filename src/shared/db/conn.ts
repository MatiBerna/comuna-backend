import { MongoClient, Db } from 'mongodb'

const connectionStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/'

const cli = new MongoClient(connectionStr)

await cli.connect()

export let db: Db = cli.db('comunadb')

import mongoose from 'mongoose'

mongoose
  .connect('mongodb://127.0.0.1:27017/comunadb')
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err))
