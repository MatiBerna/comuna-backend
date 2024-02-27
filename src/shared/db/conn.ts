import mongoose from 'mongoose'

export function dbConect() {
  const url = process.env.dbURL
  mongoose
    .connect(url || 'mongodb://127.0.0.1:27017/comunadb')
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err))
}
