import express from 'express'
import { personRouter } from './person/person.routes.js'
import { competitionTypeRouter } from './competition-type/competition-type.routes.js'
import { eventRouter } from './event/event.routes.js'

const app = express()
app.use(express.json())

app.use('/api/person', personRouter)
app.use('/api/competition-type', competitionTypeRouter)
app.use('/api/event', eventRouter)

app.use((_, res) => {
  return res.status(404).send({ mesage: 'Resourse not found' })
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/')
})
