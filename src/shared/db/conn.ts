import mongoose from 'mongoose'

export function dbConect() {
  mongoose
    .connect('mongodb://127.0.0.1:27017/comunadb')
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err))
}
