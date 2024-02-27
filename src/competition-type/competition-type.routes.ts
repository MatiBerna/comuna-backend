import { Router } from 'express'
import { add, findAll, findOne, remove, update } from './competition-type.controller'
import { checkAdminAuth } from '../auth/auth.middleware'
import { checkSchema, param } from 'express-validator'

export const competitionTypeRouter = Router()

/**
 * @openapi
 * /api/competition-type:
 *  get:
 *    tags:
 *      - Competition Type
 *    description: Devuelve todos los tipos competencias (paginación opcional)
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: number
 *        description: Numero de página
 *      - in: query
 *        name: filter
 *        schema:
 *          type: string
 *        description: Filtro por description
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
 *                        description: ID unico del tipo de competencia
 *                      description:
 *                        type: string
 *                        description: Descripcion del tipo de competencia (nombre)
 *                      image:
 *                        type: string
 *                        description: URL de la imagen del tipo de competencia
 *                      rules:
 *                        type: string
 *                        description: Descripcion de las reglas del tipo de competencia
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
 *                        example: El número de página inválido
 *                      path:
 *                        type: string
 *                        example: id
 *                      location:
 *                        type: string
 *                        example: query
 */
competitionTypeRouter.get(
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
 * /api/competition-type/{id}:
 *  get:
 *    tags:
 *      - Competition Type
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del tipo de competencia a devolver.
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
 *                  description: ID único del tipo de competencia.
 *                decription:
 *                  type: string
 *                  description: Descripcion del tipo competencia (nombre).
 *                image:
 *                  type: string
 *                  description: URL de la imagen del tipo de competencia
 *                rules:
 *                  type: string
 *                  description: Descripcion de las reglas del tipo de competencia.
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
 *                        example: ID de tipo competencia inválido
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
 *                  example: Tipo de competencia no encontrado
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
competitionTypeRouter.get(
  '/:id',
  param('id')
    .notEmpty()
    .withMessage('El id de tipo competencia es requerido')
    .isMongoId()
    .withMessage('ID de tipo competencia inválido'),
  findOne
)

/**
 * @openapi
 * /api/competition-type:
 *  post:
 *    tags:
 *      - Competition Type
 *    description: Guarda un nuevo tipo de competencia en la base de datos. Solo disponible para admins.
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        description: Token de autorización
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              description:
 *                type: string
 *                description: Descripcion del tipo de competencia (nombre).
 *              rules:
 *                type: string
 *                description: Descripcion de las reglas del tipo de competencia.
 *    responses:
 *      201:
 *        description: Created
 *        content:
 *          applcation/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Tipo de Competencia creado
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: ID único del tipo de competencia.
 *                    description:
 *                      type: string
 *                      description: Descripcion del tipo de competencia (nombre).
 *                    image:
 *                      type: string
 *                      description: URL de la imagen del tipo de competencia
 *                    rules:
 *                      type: string
 *                      description: Descripcion de las regla del tipo de competencia.
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
 *      500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor de Datos
 */
competitionTypeRouter.post(
  '/',
  checkAdminAuth,
  checkSchema({
    description: { trim: true, notEmpty: { errorMessage: 'La descripción es requerida' } },
    image: {
      trim: true,
      notEmpty: { errorMessage: 'La URL de la imagen es requerida', bail: true },
      isURL: { errorMessage: 'El campo imagen debe ser una URL válida' },
    },
    rules: { trim: true, notEmpty: { errorMessage: 'El campo reglas es requerido' } },
  }),
  add
)

/**
 * @openapi
 * /api/competition-type/{id}:
 *  put:
 *    tags:
 *      - Competition Type
 *    description: Guarda un nuevo tipo de competencia en la base de datos. Solo disponible para admins.
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        description: Token de autorización
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del tipo de competencia a actualizar.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              description:
 *                type: string
 *                description: Descripcion del tipo de competencia (nombre).
 *              image:
 *                type: string
 *                description: URL de la imagen del tipo de competencia
 *              rules:
 *                type: string
 *                description: Descripcion de las reglas del tipo de competencia.
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          applcation/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Tipo de Competencia actualizado
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: ID único del tipo de competencia.
 *                    description:
 *                      type: string
 *                      description: Descripcion del tipo de competencia (nombre).
 *                    image:
 *                      type: string
 *                      description: URL de la imagen del tipo de competencia
 *                    rules:
 *                      type: string
 *                      description: Descripcion de las regla del tipo de competencia.
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
 *                        example: ID de tipo competencia inválido
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
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tipo de competencia no encontrado
 *      500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor de Datos
 */
competitionTypeRouter.put(
  '/:id',
  checkAdminAuth,
  param('id')
    .notEmpty()
    .withMessage('El id de tipo competencia es requerido')
    .isMongoId()
    .withMessage('ID de tipo competencia inválido'),
  checkSchema({
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
 * /api/competition-type/{id}:
 *  patch:
 *    tags:
 *      - Competition Type
 *    description: Guarda un nuevo tipo de competencia en la base de datos. Solo disponible para admins.
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        description: Token de autorización
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del tipo de competencia a actualizar.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              description:
 *                type: string
 *                description: Descripcion del tipo de competencia (nombre).
 *              rules:
 *                type: string
 *                description: Descripcion de las reglas del tipo de competencia.
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          applcation/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Tipo de Competencia actualizado
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: ID único del tipo de competencia.
 *                    description:
 *                      type: string
 *                      description: Descripcion del tipo de competencia (nombre).
 *                    image:
 *                      type: string
 *                      description: URL de la imagen del tipo de competencia
 *                    rules:
 *                      type: string
 *                      description: Descripcion de las regla del tipo de competencia.
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
 *                        example: ID de tipo competencia inválido
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
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tipo de competencia no encontrado
 *      500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor de Datos
 */
competitionTypeRouter.patch(
  '/:id',
  checkAdminAuth,
  param('id')
    .notEmpty()
    .withMessage('El id de tipo competencia es requerido')
    .isMongoId()
    .withMessage('ID de tipo competencia inválido'),
  checkSchema({
    image: {
      trim: true,
      optional: true,
      isURL: { errorMessage: 'El campo imagen debe ser una URL válida' },
    },
    _id: {
      trim: true,
    },
  }),
  update
)

/**
 * @openapi
 * /api/competition-type/{id}:
 *  delete:
 *    tags:
 *      - Competition Type
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del tipo de competencia a eliminar.
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
 *                  example: Tipo de Competencia eliminado
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: ID único del Tipo de Competencia
 *                    description:
 *                      type: string
 *                      description: Descripcion del tipo de competencia (nombre).
 *                    image:
 *                      type: string
 *                      description: URL de la imagen del tipo de competencia
 *                    rules:
 *                      type: string
 *                      description: Descripcion de las reglas del tipo de competencia.
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
 *                        example: ID de tipo competencia inválido
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
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tipo de competencia no encontrado
 *      409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hay competencias del tipo seleccionado
 *      500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor de Datos
 */
competitionTypeRouter.delete(
  '/:id',
  checkAdminAuth,
  param('id')
    .notEmpty()
    .withMessage('El id de tipo competencia es requerido')
    .isMongoId()
    .withMessage('ID de tipo competencia inválido'),
  remove
)
