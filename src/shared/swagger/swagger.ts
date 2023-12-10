import { Application } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Comuna Villa Fuscia API', version: '1.0.0' },
  },
  apis: [
    'src/person/person.routes.ts',
    'src/evento/evento.routes.ts',
    'src/competition-type/competition-type.routes.ts',
    'src/competition/competition.routes.ts',
    'src/auth/auth.routes.ts',
    'src/admin/admin.routes.ts',
  ],
}

const swaggerSpec = swaggerJSDoc(options)

export const swaggerDocs = (app: Application, port: number) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  console.log('Docs are avalaible at http://localhost:3000/api/docs')
}
