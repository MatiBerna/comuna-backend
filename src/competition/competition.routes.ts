import { Router } from 'express'
import { add, findAll, findOne, remove, update } from './competition.controller.js'
import { body, checkSchema, param } from 'express-validator'

export const competetitionRouter = Router()

/**
 * @openapi
 * /api/competition:
 *  get:
 *    tags:
 *      - Competition
 *    description: Devuelve todas las competencias, las competencias próximas, o aquellas cuya inscripcion esté habilitada (2 dias antes).
 *    parameters:
 *      - in: query
 *        name: prox
 *        schema:
 *          type: string
 *        description: Filtro booleano que determina si se devuelven los próximos o todos
 *      - in: query
 *        name: disp
 *        schema:
 *          type: string
 *        description: Filtro booleano que determina si se devuelven todos o los que tienen inscripcion abierta
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
 *                    description: ID único de la competencia
 *                  descripcion:
 *                    type: string
 *                    description: Descripcion de la competencia (motivo u otro texto).
 *                  evento:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: Id del evento
 *                      description:
 *                        type: string
 *                        description: Descripcion del evento (nombre o movito del evento)
 *                      fechaHoraIni:
 *                        type: string
 *                        format: date
 *                        description: Fecha y hora de inicio del evento.
 *                      fechaHoraFin:
 *                        type: string
 *                        format: date
 *                        description: Fecha y hora de fin del evento.
 *                  competitionType:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: ID unico del tipo de competencia
 *                      description:
 *                        type: string
 *                        description: Descripcion del tipo de competencia (nombre)
 *                      rules:
 *                        type: string
 *                        description: Descripcion de las reglas del tipo de competencia
 *                  fechaHoraIni:
 *                    type: string
 *                    format: date
 *                    description: Fecha y hora de inicio del evento.
 *                  fechaHoraFinEstimada:
 *                    type: string
 *                    format: date
 *                    description: Fecha y hora de fin del evento.
 *                  premios:
 *                    type: string
 *                    description: Descripcion de los premios a repartir a los ganadores
 *                  costoInscripcion:
 *                    type: number
 *                    description: Costo de inscripcion (real, mayor o igual a 0)
 */
competetitionRouter.get('/', findAll)

/**
 * @openapi
 * /api/competition/{id}:
 *  get:
 *    tags:
 *      - Competition
 *    description: Devuelve un evento cuyo ID es pasado como parametro en el path
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  _id:
 *                    type: string
 *                    description: ID único de la competencia
 *                  descripcion:
 *                    type: string
 *                    description: Descripcion de la competencia (motivo u otro texto).
 *                  evento:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: Id del evento
 *                      description:
 *                        type: string
 *                        description: Descripcion del evento (nombre o movito del evento)
 *                      fechaHoraIni:
 *                        type: string
 *                        format: date
 *                        description: Fecha y hora de inicio del evento.
 *                      fechaHoraFin:
 *                        type: string
 *                        format: date
 *                        description: Fecha y hora de fin del evento.
 *                  competitionType:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: ID unico del tipo de competencia
 *                      description:
 *                        type: string
 *                        description: Descripcion del tipo de competencia (nombre)
 *                      rules:
 *                        type: string
 *                        description: Descripcion de las reglas del tipo de competencia
 *                  fechaHoraIni:
 *                    type: string
 *                    format: date
 *                    description: Fecha y hora de inicio del evento.
 *                  fechaHoraFinEstimada:
 *                    type: string
 *                    format: date
 *                    description: Fecha y hora de fin del evento.
 *                  premios:
 *                    type: string
 *                    description: Descripcion de los premios a repartir a los ganadores
 *                  costoInscripcion:
 *                    type: number
 *                    description: Costo de inscripcion (real, mayor o igual a 0)
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
 *                        example: ID de admin inválido
 *                      path:
 *                        type: string
 *                        example: id
 *                      location:
 *                        type: string
 *                        example: params
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Competencia no encontrada
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
competetitionRouter.get(
  '/:id',
  param('id').notEmpty().withMessage('El id de competencia es requerido').isMongoId().withMessage('ID de competencia inválido'),
  findOne
)

/**
 * @openapi
 * /api/competition:
 *  post:
 *    tags:
 *      - Competition
 *    description: Guarda una competencia en la base de datos
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              descripcion:
 *                type: string
 *                description: Descripcion de la competencia (movito u otro texto)
 *              _idCompetitionType:
 *                type: string
 *                description: ID único de un tipo de competencia
 *              _idEvento:
 *                type: string
 *                description: ID único de un evento
 *              fechaHoraIni:
 *                type: string
 *                format: date
 *                description: Fecha y hora de inicio del evento.
 *              fechaHoraFinEstimada:
 *                type: string
 *                format: date
 *                description: Fecha y hora de fin del evento.
 *              premios:
 *                type: string
 *                description: Descripcion de los premios a repartir a los ganadores
 *              costoInscripcion:
 *                type: number
 *                description: Costo de inscripcion (real, mayor o igual a 0)
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
 *                  example: Competencia creada
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: ID único de competencia
 *                    descripcion:
 *                      type: string
 *                      description: Descripcion de la competencia (movito u otro texto)
 *                    _idCompetitionType:
 *                      type: string
 *                      description: ID único de un tipo de competencia
 *                    _idEvento:
 *                      type: string
 *                      description: ID único de un evento
 *                    fechaHoraIni:
 *                      type: string
 *                      format: date
 *                      description: Fecha y hora de inicio del evento.
 *                    fechaHoraFinEstimada:
 *                      type: string
 *                      format: date
 *                      description: Fecha y hora de fin del evento.
 *                    premios:
 *                      type: string
 *                      description: Descripcion de los premios a repartir a los ganadores
 *                    costoInscripcion:
 *                      type: number
 *                      description: Costo de inscripcion (real, mayor o igual a 0)
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
 *                        example: La decripción es requerida
 *                      path:
 *                        type: string
 *                        example: descripcion
 *                      location:
 *                        type: string
 *                        example: body
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
competetitionRouter.post(
  '/',
  checkSchema({
    competitionType: {
      notEmpty: { errorMessage: 'El Id de Tipo de Competencia es requerido', bail: true },
      isMongoId: { errorMessage: 'ID de tipo de competencia inválido' },
    },
    evento: {
      notEmpty: { errorMessage: 'El Id de Evento es requerido', bail: true },
      isMongoId: { errorMessage: 'ID de evento inválido' },
    },
    descripcion: { trim: true, notEmpty: { errorMessage: 'La descripción de la competencia es requerida' } },
    fechaHoraIni: {
      trim: true,
      notEmpty: { errorMessage: 'La fecha y hora de inicio es requerida', bail: true },
      isISO8601: { errorMessage: 'La fecha y hora de inicio no es válida' },
    },
    fechaHoraFinEstimada: {
      trim: true,
      notEmpty: { errorMessage: 'La fecha y hora de fin estimada es requerida', bail: true },
      isISO8601: { errorMessage: 'La fecha y hora de fin estimada no es válida', bail: true },
      custom: {
        options: (value, { req }) => {
          if (new Date(value) < new Date(req.body.fechaHoraIni)) {
            throw new Error('La fecha y hora de fin debe ser posterior a la fecha y hora de inicio')
          }
          return true
        },
      },
    },
    premios: { trim: true, notEmpty: { errorMessage: 'El campo premios es requerido' } },
    costoInscripcion: {
      trim: true,
      notEmpty: { errorMessage: 'El costo de inscripción es requerido', bail: true },
      isNumeric: { errorMessage: 'El costo de inscripcion debe ser un número real' },
    },
  }),
  add
)

/**
 * @openapi
 * /api/competition/{id}:
 *  put:
 *    tags:
 *      - Competition
 *    description: modifica una competencia cuyo id es pasado como parametro ne el path
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID de la competencia a modificar
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              descripcion:
 *                type: string
 *                description: Descripcion de la competencia (movito u otro texto)
 *              _idCompetitionType:
 *                type: string
 *                description: ID único de un tipo de competencia
 *              _idEvento:
 *                type: string
 *                description: ID único de un evento
 *              fechaHoraIni:
 *                type: string
 *                format: date
 *                description: Fecha y hora de inicio del evento.
 *              fechaHoraFinEstimada:
 *                type: string
 *                format: date
 *                description: Fecha y hora de fin del evento.
 *              premios:
 *                type: string
 *                description: Descripcion de los premios a repartir a los ganadores
 *              costoInscripcion:
 *                type: number
 *                description: Costo de inscripcion (real, mayor o igual a 0)
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
 *                  example: Competencia modificada
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: ID único de competencia
 *                    descripcion:
 *                      type: string
 *                      description: Descripcion de la competencia (movito u otro texto)
 *                    _idCompetitionType:
 *                      type: string
 *                      description: ID único de un tipo de competencia
 *                    _idEvento:
 *                      type: string
 *                      description: ID único de un evento
 *                    fechaHoraIni:
 *                      type: string
 *                      format: date
 *                      description: Fecha y hora de inicio del evento.
 *                    fechaHoraFinEstimada:
 *                      type: string
 *                      format: date
 *                      description: Fecha y hora de fin del evento.
 *                    premios:
 *                      type: string
 *                      description: Descripcion de los premios a repartir a los ganadores
 *                    costoInscripcion:
 *                      type: number
 *                      description: Costo de inscripcion (real, mayor o igual a 0)
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
 *                        example: 2023-12-24:0030:00.000Z
 *                      msg:
 *                        type: string
 *                        example: La fecha y hora de inicio no es válida
 *                      path:
 *                        type: string
 *                        example: fechaHoraIni
 *                      location:
 *                        type: string
 *                        example: body
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Competencia no encontrada
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
competetitionRouter.put(
  '/:id',
  param('id').notEmpty().withMessage('El id de competencia es requerido').isMongoId().withMessage('ID de competencia inválido'),
  checkSchema({
    competitionType: {
      optional: true,
      isMongoId: { errorMessage: 'ID de tipo de competencia inválido' },
    },
    evento: {
      optional: true,
      isMongoId: { errorMessage: 'ID de evento inválido' },
    },
    descripcion: { optional: true, trim: true },
    fechaHoraIni: {
      optional: true,
      trim: true,
      isISO8601: { errorMessage: 'La fecha y hora de inicio no es válida' },
    },
    fechaHoraFinEstimada: {
      optional: true,
      trim: true,
      isISO8601: { errorMessage: 'La fecha y hora de fin estimada no es válida' },
    },
    premios: { optional: true, trim: true },
    costoInscripcion: {
      optional: true,
      trim: true,
      isNumeric: { errorMessage: 'El costo de inscripcion debe ser un número real' },
    },
  }),
  update
)

/**
 * @openapi
 * /api/competition/{id}:
 *  patch:
 *    tags:
 *      - Competition
 *    description: modifica una competencia cuyo id es pasado como parametro ne el path
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID de la competencia a modificar
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              descripcion:
 *                type: string
 *                description: Descripcion de la competencia (movito u otro texto)
 *              _idCompetitionType:
 *                type: string
 *                description: ID único de un tipo de competencia
 *              _idEvento:
 *                type: string
 *                description: ID único de un evento
 *              fechaHoraIni:
 *                type: string
 *                format: date
 *                description: Fecha y hora de inicio del evento.
 *              fechaHoraFinEstimada:
 *                type: string
 *                format: date
 *                description: Fecha y hora de fin del evento.
 *              premios:
 *                type: string
 *                description: Descripcion de los premios a repartir a los ganadores
 *              costoInscripcion:
 *                type: number
 *                description: Costo de inscripcion (real, mayor o igual a 0)
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
 *                  example: Competencia modificada
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: ID único de competencia
 *                    descripcion:
 *                      type: string
 *                      description: Descripcion de la competencia (movito u otro texto)
 *                    _idCompetitionType:
 *                      type: string
 *                      description: ID único de un tipo de competencia
 *                    _idEvento:
 *                      type: string
 *                      description: ID único de un evento
 *                    fechaHoraIni:
 *                      type: string
 *                      format: date
 *                      description: Fecha y hora de inicio del evento.
 *                    fechaHoraFinEstimada:
 *                      type: string
 *                      format: date
 *                      description: Fecha y hora de fin del evento.
 *                    premios:
 *                      type: string
 *                      description: Descripcion de los premios a repartir a los ganadores
 *                    costoInscripcion:
 *                      type: number
 *                      description: Costo de inscripcion (real, mayor o igual a 0)
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
 *                        example: 2023-12-24:0030:00.000Z
 *                      msg:
 *                        type: string
 *                        example: La fecha y hora de inicio no es válida
 *                      path:
 *                        type: string
 *                        example: fechaHoraIni
 *                      location:
 *                        type: string
 *                        example: body
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Competencia no encontrada
 *      409:
 *        description: Conflict
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Competencia en el evento duplicada
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
competetitionRouter.patch(
  '/:id',
  param('id').notEmpty().withMessage('El id de competencia es requerido').isMongoId().withMessage('ID de competencia inválido'),
  checkSchema({
    competitionType: {
      optional: true,
      isMongoId: { errorMessage: 'No existe Tipo de Competencia con el id ingresado' },
    },
    evento: {
      optional: true,
      isMongoId: { errorMessage: 'No existe Evento con el id ingresado' },
    },
    descripcion: { optional: true, trim: true },
    fechaHoraIni: {
      optional: true,
      trim: true,
      isISO8601: { errorMessage: 'La fecha y hora de inicio no es válida' },
    },
    fechaHoraFinEstimada: {
      optional: true,
      trim: true,
      isISO8601: { errorMessage: 'La fecha y hora de fin estimada no es válida', bail: true },
    },
    premios: { optional: true, trim: true },
    costoInscripcion: {
      optional: true,
      trim: true,
      isNumeric: { errorMessage: 'El costo de inscripcion debe ser un número real' },
    },
  }),
  update
)

/**
 * @openapi
 * /api/competition/{id}:
 *  delete:
 *    tags:
 *      - Competition
 *    description: Elimina una competencia cuyo id es pasado como parámetro en el path
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID de la competencia a eliminar
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
 *                  example: Competencia eliminada
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: ID único de competencia
 *                    descripcion:
 *                      type: string
 *                      description: Descripcion de la competencia (movito u otro texto)
 *                    _idCompetitionType:
 *                      type: string
 *                      description: ID único de un tipo de competencia
 *                    _idEvento:
 *                      type: string
 *                      description: ID único de un evento
 *                    fechaHoraIni:
 *                      type: string
 *                      format: date
 *                      description: Fecha y hora de inicio del evento.
 *                    fechaHoraFinEstimada:
 *                      type: string
 *                      format: date
 *                      description: Fecha y hora de fin del evento.
 *                    premios:
 *                      type: string
 *                      description: Descripcion de los premios a repartir a los ganadores
 *                    costoInscripcion:
 *                      type: number
 *                      description: Costo de inscripcion (real, mayor o igual a 0)
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
 *                        example: ID de admin inválido
 *                      path:
 *                        type: string
 *                        example: id
 *                      location:
 *                        type: string
 *                        example: params
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Competencia no encontrada
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
competetitionRouter.delete(
  '/:id',
  param('id').notEmpty().withMessage('El id de competencia es requerido').isMongoId().withMessage('ID de competencia inválido'),
  remove
)
