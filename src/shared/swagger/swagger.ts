import { Application } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Comuna Villa Fuscia API',
      description: 'API que se encarga de manejar datos de la comuna villa fucsia',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
    tags: [
      { name: 'Person', description: 'Endpoint que maneja CRUD de personas' },
      { name: 'Competition Type', description: 'Endpoint que maneja CRUD de tipos de competencia' },
      { name: 'Evento', description: 'Endpoint que maneja CRUD de Eventos' },
      { name: 'Competition', description: 'Endpoint que maneja CRUD de Competencias' },
      { name: 'Auth', description: 'Endpoint que maneja logins y registers de dos tipos de usuario (Admin y user person)' },
      { name: 'Admin', description: 'Endpoint que maneja CRUD de Administradores' },
    ],
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
