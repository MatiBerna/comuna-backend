import { Router } from 'express'
import { add, findAll, findOne, remove, update } from './evento.controller'
import { checkSchema, param } from 'express-validator'
import { checkAdminAuth } from '../auth/auth.middleware'

export const eventoRouter = Router()

/**
 * @openapi
 * /api/evento:
 *   get:
 *     tags:
 *       - Evento
 *     description: Devuelve todos los evento o aquellas que cumplan con el filtro (prox boolean, indica si devuelve todos o solos los eventos proximos, paginación opcional)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
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
 *                       image:
 *                         type: string
 *                         description: URL de la imagen del evento
 *                       fechaHoraIni:
 *                         type: string
 *                         format: date
 *                         description: Fecha y hora de inicio del evento.
 *                       fechaHoraFin:
 *                         type: string
 *                         format: date
 *                         description: Fecha y hora de fin del evento.
 *                 totalDocs:
 *                   type: number
 *                   description: numero total de documentos
 *                 limit:
 *                   type: number
 *                   description: limite de documuentos por página
 *                 totalPages:
 *                   type: number
 *                   description: Numero total de páginas
 *                 page:
 *                   type: number
 *                   description: Numero actual de página
 *                 pagingCounter:
 *                   type: number
 *                   description: Numero del primer documento de la página
 *                 hasPrevPage:
 *                   type: boolean
 *                   description: Indica si hay una pagina anterior
 *                 hasNextPage:
 *                   type: boolean
 *                   description: Indica si hay una pagina posterior
 *                 prevPage:
 *                   type: number
 *                   description: Si hay página previa, indica el número de la misma, si no, es null
 *                 nextPage:
 *                   type: number
 *                   description: Si hay página posterior, indica el número de la misma, si no, es null
 *       400:
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
 *     parameters:
 *       - in: query
 *         name: prox
 *         schema:
 *           type: string
 *         description: Filtro booleano que determina si se devuelven todos o solamente los próximos
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filtro por descripción
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Número de página
 */
eventoRouter.get(
  '/',
  checkSchema(
    {
      page: {
        trim: true,
        optional: true,
        isNumeric: { errorMessage: 'Número de página inválido' },
      },
    },
    ['query']
  ),
  findAll
)

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
 *                       image:
 *                         type: string
 *                         description: URL de la imagen del evento
 *                       fechaHoraIni:
 *                         type: string
 *                         format: date
 *                         description: Fecha y hora de inicio del evento.
 *                       fechaHoraFin:
 *                         type: string
 *                         format: date
 *                         description: Fecha y hora de fin del evento.
 *       400:
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
 *                        example: ID de evento inválido
 *                      path:
 *                        type: string
 *                        example: id
 *                      location:
 *                        type: string
 *                        example: params
 *       404:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Evento no encontrado
 *       500:
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
eventoRouter.get(
  '/:id',
  param('id').notEmpty().withMessage('El id de evento es requerido').isMongoId().withMessage('ID de evento inválido'),
  findOne
)

/**
 * @openapi
 * /api/evento:
 *  post:
 *    tags:
 *      - Evento
 *    description: Guarda un nuevo evento en la base de datos
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
 *              description:
 *                type: string
 *                description: Descripcion del evento (nombre o motivo del mismo)
 *              image:
 *                type: string
 *                description: URL de la imagen del evento
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
 *                        example: description
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
eventoRouter.post(
  '/',
  checkAdminAuth,
  checkSchema({
    description: { trim: true, notEmpty: { errorMessage: 'La descripción es requerida' } },
    fechaHoraIni: {
      trim: true,
      notEmpty: { errorMessage: 'La fecha y hora de inicio es requerida', bail: true },
      isISO8601: { errorMessage: 'La fecha y hora de inicio no es válida' },
    },
    fechaHoraFin: {
      trim: true,
      notEmpty: { errorMessage: 'La fecha y hora de inicio es requerida', bail: true },
      isISO8601: { errorMessage: 'La fecha y hora de inicio no es válida' },
    },
    image: {
      trim: true,
      notEmpty: { errorMessage: 'La URL de la imagen es requerida', bail: true },
      isURL: { errorMessage: 'El campo imagen debe ser una URL válida' },
    },
  }),
  add
)

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
 *              description:
 *                type: string
 *                description: Descripcion del evento (nombre o motivo del mismo)
 *              image:
 *                type: string
 *                description: URL de la imagen del evento
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
 *                        example: 2023-12-24:00:3000.000Z
 *                      msg:
 *                        type: string
 *                        example: La fecha y hora de inicio no es válida
 *                      path:
 *                        type: string
 *                        example: fechaHoraIni
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
eventoRouter.put(
  '/:id',
  checkAdminAuth,
  param('id').notEmpty().withMessage('El id de evento es requerido').isMongoId().withMessage('ID de evento inválido'),
  checkSchema({
    description: { trim: true, optional: true },
    fechaHoraIni: {
      trim: true,
      optional: true,
      isISO8601: { errorMessage: 'La fecha y hora de inicio no es válida' },
    },
    fechaHoraFin: {
      trim: true,
      optional: true,
      isISO8601: { errorMessage: 'La fecha y hora de inicio no es válida' },
    },
    image: {
      trim: true,
      optional: true,
      isURL: { errorMessage: 'El campo imagen debe ser una URL válida' },
    },
  }),
  update
)

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
 *              description:
 *                type: string
 *                description: Descripcion del evento (nombre o motivo del mismo)
 *              image:
 *                type: string
 *                description: URL de la imagen del evento
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
 *                        example: 2023-12-24:00:3000.000Z
 *                      msg:
 *                        type: string
 *                        example: La fecha y hora de inicio no es válida
 *                      path:
 *                        type: string
 *                        example: fechaHoraIni
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
eventoRouter.patch(
  '/:id',
  checkAdminAuth,
  param('id').notEmpty().withMessage('El id de evento es requerido').isMongoId().withMessage('ID de evento inválido'),
  checkSchema({
    description: { trim: true, optional: true },
    fechaHoraIni: {
      trim: true,
      optional: true,
      isISO8601: { errorMessage: 'La fecha y hora de inicio no es válida' },
    },
    fechaHoraFin: {
      trim: true,
      optional: true,
      isISO8601: { errorMessage: 'La fecha y hora de inicio no es válida' },
    },
    image: {
      trim: true,
      optional: true,
      isURL: { errorMessage: 'El campo imagen debe ser una URL válida' },
    },
  }),
  update
)

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
 *                    image:
 *                      type: string
 *                      description: URL de la imagen del evento
 *                    fechaHoraIni:
 *                      type: string
 *                      format: date
 *                      description: Fecha y hora inicio del evento
 *                    fechaHoraFin:
 *                      type: string
 *                      format: date
 *                      description: Fecha y hora fin del evento
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
 *                        example: ID de evento inválido
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
eventoRouter.delete(
  '/:id',
  checkAdminAuth,
  param('id').notEmpty().withMessage('El id de evento es requerido').isMongoId().withMessage('ID de evento inválido'),
  remove
)
