import { Router } from 'express'
import { add, findAll, findOne, remove, update } from './competition-type.controller.js'
import { checkAdminAuth } from '../auth/auth.middleware.js'

export const competitionTypeRouter = Router()

/**
 * @openapi
 * /api/competition-type:
 *  get:
 *    tags:
 *      - Competition Type
 *    description: Devuelve todas los tipos competencias
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
 *                    description: ID unico del tipo de competencia
 *                  description:
 *                    type: string
 *                    description: Descripcion del tipo de competencia (nombre)
 *                  rules:
 *                    type: string
 *                    description: Descripcion de las reglas del tipo de competencia
 */
competitionTypeRouter.get('/', findAll)

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
 *                rules:
 *                  type: string
 *                  description: Descripcion de las reglas del tipo de competencia.
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
competitionTypeRouter.get('/:id', findOne)

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
 *                 message:
 *                   type: string
 *                   example: Falta un atributo requerido
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
competitionTypeRouter.post('/', checkAdminAuth, add)

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
 *                    rules:
 *                      type: string
 *                      description: Descripcion de las regla del tipo de competencia.
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
competitionTypeRouter.put('/:id', checkAdminAuth, update)

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
 *                    rules:
 *                      type: string
 *                      description: Descripcion de las regla del tipo de competencia.
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
competitionTypeRouter.patch('/:id', checkAdminAuth, update)

/**
 * @openapi
 * /api/person/{id}:
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
 *                    rules:
 *                      type: string
 *                      description: Descripcion de las reglas del tipo de competencia.
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
competitionTypeRouter.delete('/:id', checkAdminAuth, remove)
