import { Router } from 'express'
import { add, findAll, findOne, remove, update } from './competitor.controller'
import { checkSchema, param } from 'express-validator'
import { checkPersonAuth } from '../auth/auth.middleware'

export const competitorRouter = Router()

/**
 * @openapi
 * /api/competitor:
 *  get:
 *    tags:
 *      - Competitor
 *    description: |
 *       Devuelve todas las inscripciones. O aquellas cuya competencia o persona coincidan con el parámetro seleccionado.
 *       Al utilizar el filtro evento, se devolverá una lista de objetos con las propiedades _id y competition (sin populación, solo el ID de la competencia).
 *       Opciones de populación:
 *       - Si el usuario es admin, se realizará la populación por persona.
 *       - Si el usuario es person, se realizará la populación por competencia, y en la misma se incluirá la populación por evento y tipo de competencia.
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        description: Token de autorización.
 *      - in: query
 *        name: page
 *        schema:
 *          type: number
 *        description: Número de página
 *        required: true
 *      - in: query
 *        name: competition
 *        schema:
 *          type: string
 *        description: Id de competencia
 *      - in: query
 *        name: person
 *        schema:
 *          type: string
 *        description: Id de persona
 *      - in: query
 *        name: prox
 *        schema:
 *          type: string
 *        description: Filtro de inscripciones a eventos próximos (true)
 *      - in: query
 *        name: evento
 *        schema:
 *          type: string
 *        description: Filtro para competencias de un mismo evento
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                docs:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: ID único de inscripción
 *                      person:
 *                        type: string
 *                        description: ID único de persona ó objeto persona
 *                      competition:
 *                        type: string
 *                        description: ID único de competencia ó objeto competencia
 *                totalDocs:
 *                  type: number
 *                  description: numero total de documentos
 *                limit:
 *                  type: number
 *                  description: limite de documuentos por página
 *                totalPages:
 *                  type: number
 *                  description: Numero total de páginas
 *                page:
 *                  type: number
 *                  description: Numero actual de página
 *                pagingCounter:
 *                  type: number
 *                  description: Numero del primer documento de la página
 *                hasPrevPage:
 *                  type: boolean
 *                  description: Indica si hay una pagina anterior
 *                hasNextPage:
 *                  type: boolean
 *                  description: Indica si hay una pagina posterior
 *                prevPage:
 *                  type: number
 *                  description: Si hay página previa, indica el número de la misma, si no, es null
 *                nextPage:
 *                  type: number
 *                  description: Si hay página posterior, indica el número de la misma, si no, es null
 *      400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                    type: object
 *                    properties:
 *                      type:
 *                        type: string
 *                        example: field
 *                      value:
 *                        type: string
 *                        example: abcd123
 *                      msg:
 *                        type: string
 *                        example: Número de página inválido
 *                      path:
 *                        type: string
 *                        example: page
 *                      location:
 *                        type: string
 *                        example: query
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: No tienes permiso
 */
competitorRouter.get(
  '/',
  checkPersonAuth,
  checkSchema(
    {
      page: {
        trim: true,
        notEmpty: { errorMessage: 'El número de página es requrido en query', bail: true },
        isNumeric: { errorMessage: 'Número de página inválido' },
      },
      competition: {
        optional: true,
        trim: true,
        isMongoId: { errorMessage: 'Id de competencia inválido' },
      },
      person: {
        optional: true,
        trim: true,
        isMongoId: { errorMessage: 'Id de persona inválido' },
      },
      evento: {
        optional: true,
        trim: true,
        isMongoId: { errorMessage: 'Id de evento inválido' },
      },
    },
    ['query']
  ),
  findAll
)

/**
 * @openapi
 * /api/competitor/{id}:
 *  get:
 *    tags:
 *      - Competitor
 *    description: Devuelve todas las inscripciones. O aquellas cuya competencia o persona coincidan con el parametro seleccionado
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        description: Token de autorización.
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: ID de inscripción
 *        required: true
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                    description: ID único de inscripción
 *                  person:
 *                    type: string
 *                    description: ID único de persona ó objeto persona
 *                  competition:
 *                    type: string
 *                    description: ID único de competencia ó objeto competencia
 *      400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                    type: object
 *                    properties:
 *                      type:
 *                        type: string
 *                        example: field
 *                      value:
 *                        type: string
 *                        example: abcd123
 *                      msg:
 *                        type: string
 *                        example: ID de inscripción inválido
 *                      path:
 *                        type: string
 *                        example: id
 *                      location:
 *                        type: string
 *                        example: param
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: No tienes permiso
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Inscripción no encontrada
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Error interno en el servidor de datos
 */
competitorRouter.get(
  '/:id',
  checkPersonAuth,
  param('id')
    .notEmpty()
    .withMessage('El id de inscripción es requerido')
    .bail()
    .isMongoId()
    .withMessage('ID de inscripción inválido'),
  findOne
)

/**
 * @openapi
 * /api/competitor:
 *  post:
 *    tags:
 *      - Competitor
 *    description: Guarda una inscripción en la base de datos
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        description: Token de autorización.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              person:
 *                type: string
 *                description: Id único de persona
 *              competition:
 *                type: string
 *                description: Id único de competencia
 *    responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Inscripción creada
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: ID único de inscripción
 *                    person:
 *                      type: string
 *                      description: ID único de persona ó objeto persona
 *                    competition:
 *                      type: string
 *                      description: ID único de competencia ó objeto competencia
 *      400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                    type: object
 *                    properties:
 *                      type:
 *                        type: string
 *                        example: field
 *                      value:
 *                        type: string
 *                        example: ""
 *                      msg:
 *                        type: string
 *                        example: El id de Socio es requerido
 *                      path:
 *                        type: string
 *                        example: person
 *                      location:
 *                        type: string
 *                        example: body
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: No tienes permiso
 *      409:
 *        description: Conflict
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: La inscripción se encuentra cerrada
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Error interno en el servidor de datos
 */
competitorRouter.post(
  '/',
  checkPersonAuth,
  checkSchema({
    person: {
      trim: true,
      notEmpty: { errorMessage: 'El Id de Socio es requerido', bail: true },
      isMongoId: { errorMessage: 'ID de socio inválido' },
    },
    competition: {
      trim: true,
      notEmpty: { errorMessage: 'El Id de Competencia es requerido', bail: true },
      isMongoId: { errorMessage: 'ID de competencia inválido' },
    },
  }),
  add
)

/**
 * @openapi
 * /api/competitor/{id}:
 *  put:
 *    tags:
 *      - Competitor
 *    description: Modifica una inscripción
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Id de inscripción a modificar
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        description: Token de autorización.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              person:
 *                type: string
 *                description: Id único de persona
 *              competition:
 *                type: string
 *                description: Id único de competencia
 *    responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Inscripción creada
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: ID único de inscripción
 *                    person:
 *                      type: string
 *                      description: ID único de persona ó objeto persona
 *                    competition:
 *                      type: string
 *                      description: ID único de competencia ó objeto competencia
 *      400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                    type: object
 *                    properties:
 *                      type:
 *                        type: string
 *                        example: field
 *                      value:
 *                        type: string
 *                        example: ""
 *                      msg:
 *                        type: string
 *                        example: El id de Socio es requerido
 *                      path:
 *                        type: string
 *                        example: person
 *                      location:
 *                        type: string
 *                        example: body
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: No tienes permiso
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Inscripción no encontrada
 *      409:
 *        description: Conflict
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: La inscripción se encuentra cerrada
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Error interno en el servidor de datos
 */
competitorRouter.put(
  '/:id',
  checkPersonAuth,
  param('id')
    .notEmpty()
    .withMessage('El id de inscripción es requerido')
    .bail()
    .isMongoId()
    .withMessage('ID de inscripción inválido'),
  checkSchema({
    person: {
      optional: true,
      trim: true,
      isMongoId: { errorMessage: 'ID de socio inválido' },
    },
    competition: {
      optional: true,
      trim: true,
      isMongoId: { errorMessage: 'ID de competencia inválido' },
    },
  }),
  update
)

/**
 * @openapi
 * /api/competitor/{id}:
 *  patch:
 *    tags:
 *      - Competitor
 *    description: Modifica una inscripción
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Id de inscripción a modificar
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        description: Token de autorización.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              person:
 *                type: string
 *                description: Id único de persona
 *              competition:
 *                type: string
 *                description: Id único de competencia
 *    responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Inscripción creada
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: ID único de inscripción
 *                    person:
 *                      type: string
 *                      description: ID único de persona ó objeto persona
 *                    competition:
 *                      type: string
 *                      description: ID único de competencia ó objeto competencia
 *      400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                    type: object
 *                    properties:
 *                      type:
 *                        type: string
 *                        example: field
 *                      value:
 *                        type: string
 *                        example: ""
 *                      msg:
 *                        type: string
 *                        example: El id de Socio es requerido
 *                      path:
 *                        type: string
 *                        example: person
 *                      location:
 *                        type: string
 *                        example: body
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: No tienes permiso
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Inscripción no encontrada
 *      409:
 *        description: Conflict
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: La inscripción se encuentra cerrada
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Error interno en el servidor de datos
 */
competitorRouter.patch(
  '/:id',
  checkPersonAuth,
  param('id')
    .notEmpty()
    .withMessage('El id de inscripción es requerido')
    .bail()
    .isMongoId()
    .withMessage('ID de inscripción inválido'),
  checkSchema({
    person: {
      optional: true,
      trim: true,
      isMongoId: { errorMessage: 'ID de socio inválido' },
    },
    competition: {
      optional: true,
      trim: true,
      isMongoId: { errorMessage: 'ID de competencia inválido' },
    },
  }),
  update
)

/**
 * @openapi
 * /api/competitor/{id}:
 *  delete:
 *    tags:
 *      - Competitor
 *    description: Elimina una inscripción
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Id de la inscripción a eliminar
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        description: Token de autorización.
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Inscripción eliminada
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: ID único de inscripción
 *                    person:
 *                      type: string
 *                      description: ID único de persona ó objeto persona
 *                    competition:
 *                      type: string
 *                      description: ID único de competencia ó objeto competencia
 *      400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                    type: object
 *                    properties:
 *                      type:
 *                        type: string
 *                        example: field
 *                      value:
 *                        type: string
 *                        example: abcd123
 *                      msg:
 *                        type: string
 *                        example: ID de inscripción inválido
 *                      path:
 *                        type: string
 *                        example: id
 *                      location:
 *                        type: string
 *                        example: params
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: No tienes permiso
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Inscripción no encontrada
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Error interno en el servidor de datos
 */
competitorRouter.delete(
  '/:id',
  checkPersonAuth,
  param('id')
    .notEmpty()
    .withMessage('El id de inscripción es requerido')
    .bail()
    .isMongoId()
    .withMessage('ID de inscripción inválido'),
  remove
)
