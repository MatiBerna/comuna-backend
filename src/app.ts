import express from 'express'
import { personRouter } from './person/person.routes'
import { competitionTypeRouter } from './competition-type/competition-type.routes'
import cors from 'cors'
import { authRouter } from './auth/auth.routes'
import { adminRouter } from './admin/admin.routes'
import { dbConect } from './shared/db/conn'
import { eventoRouter } from './evento/evento.routes'
import { competetitionRouter } from './competition/competition.routes'
import { swaggerDocs } from './shared/swagger/swagger'
import { competitorRouter } from './competitor/competitor.routes'

export const app = express()
dbConect()

app.use(express.json())
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
)

app.use('/api/person', personRouter)
app.use('/api/competition-type', competitionTypeRouter)
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/evento', eventoRouter)
app.use('/api/competition', competetitionRouter)
app.use('/api/competitor', competitorRouter)

swaggerDocs(app, 3000)

app.use((_, res) => {
  return res.status(404).send({ mesage: 'Resourse not found' })
})

export const server = app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/')
})
