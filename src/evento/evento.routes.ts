import { Router } from 'express'
import { add, findAll, findOne, remove, update } from './evento.controller.js'

export const eventoRouter = Router()

/**
 * @openapi
 * /api/evento:
 *   get:
 *     tags:
 *       - Evento
 *     description: Devuelve todos los evento o aquellas que cumplan con el filtro (prox boolean, indica si devuelve todos o solos los eventos proximos)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Id del evento
 *                       description:
 *                         type: string
 *                         description: Descripcion del evento (nombre o movito del evento)
 *                       fechaHoraIni:
 *                         type: string
 *                         format: date
 *                         description: Fecha y hora de inicio del evento.
 *                       fechaHoraFin:
 *                         type: string
 *                         format: date
 *                         description: Fecha y hora de fin del evento.
 *     parameters:
 *       - in: query
 *         name: prox
 *         schema:
 *           type: string
 *         description: Filtro booleano que determina si se devuelven todos o solamente los próximos
 */
eventoRouter.get('/', findAll)

/**
 * @openapi
 * /api/evento/{id}:
 *   get:
 *     tags:
 *       - Evento
 *     description: Devuelve todos los evento o aquellas que cumplan con el filtro (prox boolean, indica si devuelve todos o solos los eventos proximos)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Id del evento a devolver.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Id del evento
 *                       description:
 *                         type: string
 *                         description: Descripcion del evento (nombre o movito del evento)
 *                       fechaHoraIni:
 *                         type: string
 *                         format: date
 *                         description: Fecha y hora de inicio del evento.
 *                       fechaHoraFin:
 *                         type: string
 *                         format: date
 *                         description: Fecha y hora de fin del evento.
 */
eventoRouter.get('/:id', findOne)

/**
 * @openapi
 * /api/evento:
 *  post:
 *    tags:
 *      - Evento
 *    description: Guarda un nuevo evento en la base de datos
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              description:
 *                type: string
 *                description: Descripcion del evento (nombre o motivo del mismo)
 *              fechaHoraIni:
 *                type: string
 *                format: date
 *                description: Fecha y hora inicio del evento
 *              fechaHoraFin:
 *                type: string
 *                format: date
 *                description: Fecha y hora fin del evento
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
 *                  example: Evento creado
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: Id unico del evento
 *                    description:
 *                      type: string
 *                      description: Descripcion del evento (nombre o motivo del mismo)
 *                    fechaHoraIni:
 *                      type: string
 *                      format: date
 *                      description: Fecha y hora inicio del evento
 *                    fechaHoraFin:
 *                      type: string
 *                      format: date
 *                      description: Fecha y hora fin del evento
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: La fecha de inicio debe ser una fecha valida
 *      409:
 *        description: Confict
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Los horarios del evento se solapan con uno cargado anteriormente
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Error interno del servidor de Datos
 */
eventoRouter.post('/', add)

/**
 * @openapi
 * /api/evento/{id}:
 *  put:
 *    tags:
 *      - Evento
 *    description: modifica los atributos de un evento cuyo id es pasado como parametro en el path
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del evento a modificar
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              description:
 *                type: string
 *                description: Descripcion del evento (nombre o motivo del mismo)
 *              fechaHoraIni:
 *                type: string
 *                format: date
 *                description: Fecha y hora inicio del evento
 *              fechaHoraFin:
 *                type: string
 *                format: date
 *                description: Fecha y hora fin del evento
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                  description: Id del evento
 *                description:
 *                  type: string
 *                  description: Descripcion del evento (nombre o movito del evento)
 *                fechaHoraIni:
 *                  type: string
 *                  format: date
 *                  description: Fecha y hora de inicio del evento.
 *                fechaHoraFin:
 *                  type: string
 *                  format: date
 *                  description: Fecha y hora de fin del evento.
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: La fecha de fin no puede ser anterior a la fecha de inicio
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Evento no encontrado
 *      409:
 *        description: Confict
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Los horarios del evento se solapan con uno cargado anteriormente
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Error interno del servidor de Datos
 */
eventoRouter.put('/:id', update)

/**
 * @openapi
 * /api/evento/{id}:
 *  patch:
 *    tags:
 *      - Evento
 *    description: modifica los atributos de un evento cuyo id es pasado como parametro en el path
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del evento a modificar
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              description:
 *                type: string
 *                description: Descripcion del evento (nombre o motivo del mismo)
 *              fechaHoraIni:
 *                type: string
 *                format: date
 *                description: Fecha y hora inicio del evento
 *              fechaHoraFin:
 *                type: string
 *                format: date
 *                description: Fecha y hora fin del evento
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                  description: Id del evento
 *                description:
 *                  type: string
 *                  description: Descripcion del evento (nombre o movito del evento)
 *                fechaHoraIni:
 *                  type: string
 *                  format: date
 *                  description: Fecha y hora de inicio del evento.
 *                fechaHoraFin:
 *                  type: string
 *                  format: date
 *                  description: Fecha y hora de fin del evento.
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: La fecha de fin no puede ser anterior a la fecha de inicio
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Evento no encontrado
 *      409:
 *        description: Confict
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Los horarios del evento se solapan con uno cargado anteriormente
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Error interno del servidor de Datos
 */
eventoRouter.patch('/:id', update)

/**
 * @openapi
 * /api/evento/{id}:
 *  delete:
 *    tags:
 *      - Evento
 *    description: Elimina un evento cuyo id es pasado como parametro en el path
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del evento a eliminar
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
 *                  example: Evento eliminado
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: Id unico del evento
 *                    description:
 *                      type: string
 *                      description: Descripcion del evento (nombre o motivo del mismo)
 *                    fechaHoraIni:
 *                      type: string
 *                      format: date
 *                      description: Fecha y hora inicio del evento
 *                    fechaHoraFin:
 *                      type: string
 *                      format: date
 *                      description: Fecha y hora fin del evento
 *      404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Evento no encontrado
 *      409:
 *        description: Confict
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: El evento tiene competencias cargadas
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Error interno del servidor de Datos
 */
eventoRouter.delete('/:id', remove)
