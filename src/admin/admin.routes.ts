import { Router } from 'express'
import { add, findAll, findOne, remove, update } from './admin.controller.js'
import { checkAdminAuth } from '../auth/auth.middleware.js'

export const adminRouter = Router()

/**
 * @openapi
 * /api/admin:
 *  get:
 *    tags:
 *      - Admin
 *    description: Devuelve todos los administradores, solo accesible para administradores
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        required: true
 *        description: Token de autorización de tipo admin.
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
 *                    description: ID único del administrador
 *                  username:
 *                    type: string
 *                    description: Nombre de usuario del adiminstrador
 *      400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: token incorrecto o inexistente
 *      401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permiso
 *      500:
 *        description: Internal Server Error
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor de Datos
 */
adminRouter.get('/', checkAdminAuth, findAll)

/**
 * @openapi
 * /api/admin/{id}:
 *  get:
 *    tags:
 *      - Admin
 *    description: Devuelve un administrador, solo accesible para administradores
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        required: true
 *        description: Token de autorización de tipo admin.
 *      - id: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del admin a devolver
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                    description: ID único del administrador
 *                  username:
 *                    type: string
 *                    description: Nombre de usuario del adiminstrador
 *      400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: token incorrecto o inexistente
 *      401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permiso
 *      404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin no encontrado
 *      500:
 *        description: Internal Server Error
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor de Datos
 */
adminRouter.get('/:id', checkAdminAuth, findOne)

/**
 * @openapi
 * /api/admin:
 *  post:
 *    tags:
 *      - Admin
 *    description: Añade un nuevo admin en la base de datos, solo accesible para administradores
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        required: true
 *        description: Token de autorización de tipo admin.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *            schema:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                    description: Nombre de usuario del nuevo administrador
 *                  password:
 *                    type: string
 *                    description: Contraseña del nuevo adiminstrador
 *    responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *            schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Admin creado
 *                  data:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: ID único del administrador
 *                      username:
 *                        type: string
 *                        description: Nombre de usuario del adiminstrador
 *      400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Datos incompletos
 *      401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permiso
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
adminRouter.post('/', checkAdminAuth, add)

/**
 * @openapi
 * /api/admin/{id}:
 *  put:
 *    tags:
 *      - Admin
 *    description: Actualiza un administrador, solo accesible para administradores
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        required: true
 *        description: Token de autorización de tipo admin.
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del admin a actualizar.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *            schema:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                    description: Nombre de usuario del nuevo administrador
 *                  password:
 *                    type: string
 *                    description: Contraseña del nuevo adiminstrador
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Admin modificado
 *                  data:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: ID único del administrador
 *                      username:
 *                        type: string
 *                        description: Nombre de usuario del adiminstrador
 *      400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Datos incompletos
 *      401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permiso
 *      404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin no encontrado
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
adminRouter.put('/:id', checkAdminAuth, update)

/**
 * @openapi
 * /api/admin/{id}:
 *  patch:
 *    tags:
 *      - Admin
 *    description: Actualiza un administrador, solo accesible para administradores
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        required: true
 *        description: Token de autorización de tipo admin.
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del admin a actualizar.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *            schema:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                    description: Nombre de usuario del nuevo administrador
 *                  password:
 *                    type: string
 *                    description: Contraseña del nuevo adiminstrador
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Admin modificado
 *                  data:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: ID único del administrador
 *                      username:
 *                        type: string
 *                        description: Nombre de usuario del adiminstrador
 *      400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Datos incompletos
 *      401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permiso
 *      404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin no encontrado
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
adminRouter.patch('/:id', checkAdminAuth, update)

/**
 * @openapi
 * /api/admin/{id}:
 *  delete:
 *    tags:
 *      - Admin
 *    description: Elimina un administrador, solo accesible para administradores
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        required: true
 *        description: Token de autorización de tipo admin.
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del admin a actualizar.
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Admin eliminado
 *                  data:
 *                    type: object
 *                    properties:
 *                      _id:
 *                        type: string
 *                        description: ID único del administrador
 *                      username:
 *                        type: string
 *                        description: Nombre de usuario del adiminstrador
 *      401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permiso
 *      404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin no encontrado
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
adminRouter.delete('/:id', checkAdminAuth, remove)
