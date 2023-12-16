import { Router } from 'express'
import { add, findAll, findOne, remove, update } from './competition.controller.js'

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
competetitionRouter.get('/:id', findOne)

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
 *        description: Bad Request
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
competetitionRouter.post('/', add)

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
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Competencia en el evento duplicada
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
competetitionRouter.put('/:id', update)

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
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Competencia en el evento duplicada
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
competetitionRouter.patch('/:id', update)

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
competetitionRouter.delete('/:id', remove)
