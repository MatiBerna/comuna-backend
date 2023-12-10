import express from 'express'
import { personRouter } from './person/person.routes.js'
import { competitionTypeRouter } from './competition-type/competition-type.routes.js'
import cors from 'cors'
import { authRouter } from './auth/auth.routes.js'
import { adminRouter } from './admin/admin.routes.js'
import { dbConect } from './shared/db/conn.js'
import { eventoRouter } from './evento/evento.routes.js'
import { competetitionRouter } from './competition/competition.routes.js'
import { swaggerDocs } from './shared/swagger/swagger.js'
import { Application } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const app = express()
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

swaggerDocs(app, 3000)

app.use((_, res) => {
  return res.status(404).send({ mesage: 'Resourse not found' })
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/')
})
