import { Router } from 'express'
import { login, loginAdmin } from './auth.controller'

export const authRouter = Router()

/**
 * @openapi
 * /api/user/login:
 *  post:
 *    tags:
 *      - Auth
 *    description: Inicia la sesion de un usuario de tipo persona
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            propreties:
 *              username:
 *                type: string
 *                description: Nombre de usuario del user (email)
 *              password:
 *                type: string
 *                description: contraseña del usuario
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: Id unico de la persona
 *                    dni:
 *                      type: string
 *                      description: DNI de la persona (único).
 *                    firstName:
 *                      type: string
 *                      description: Nombre/s de la persona.
 *                    lastName:
 *                      type: string
 *                      description: Apellido/s de la persona.
 *                    phone:
 *                      type: string
 *                      description: Numero de telefono de la persona (no required).
 *                    email:
 *                      type: string
 *                      description: Email de la persona (único).
 *                    birthdate:
 *                      type: string
 *                      format: date
 *                      description: Fecha de nacimiento de la persona.
 *                tokenSession:
 *                  type: string
 *                  description: Token de autorizacion para el admin
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Nombre de usuario o contraseña incorrectos
 */
authRouter.post('/user/login', login)

/**
 * @openapi
 * /api/admin/login:
 *  post:
 *    tags:
 *      - Auth
 *    description: Inicia la sesion de un usuario de tipo admin
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            propreties:
 *              username:
 *                type: string
 *                description: Nombre de usuario del usuario admin
 *              password:
 *                type: string
 *                description: contraseña del usuario
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    _id:
 *                      type: string
 *                      description: Id unico del administrador
 *                    username:
 *                      type: string
 *                      description: Nombre de usuario del administrador
 *                tokenSession:
 *                  type: string
 *                  description: Token de autorizacion para el admin
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Nombre de usuario o contraseña incorrectos
 */
authRouter.post('/admin/login', loginAdmin)
