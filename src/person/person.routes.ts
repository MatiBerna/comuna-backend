import { Router } from 'express'
import { add, findAll, findOne, update, remove } from './person.controller.js'
import { checkAdminAuth, checkPersonAuth } from '../auth/auth.middleware.js'

export const personRouter = Router()

/**
 * @openapi
 * /api/person:
 *   get:
 *     tags:
 *       - Person
 *     description: Devuelve todas las personas o aquellas que cumplan con el filtro (nombre o apellido o dni parecidos al mismo). Solo accesible para el/los administradores
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
 *                         description: Id unico de la persona.
 *                       dni:
 *                         type: string
 *                         description: DNI de la persona (único).
 *                       firstName:
 *                         type: string
 *                         description: Nombre/s de la persona.
 *                       lastName:
 *                         type: string
 *                         description: Apellido/s de la persona.
 *                       phone:
 *                         type: string
 *                         description: Numero de telefono de la persona (no required).
 *                       email:
 *                         type: string
 *                         description: Email de la persona (único).
 *                       birthdate:
 *                         type: string
 *                         format: date
 *                         description: Fecha de nacimiento de la persona.
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permiso
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: token incorrecto o inexistente
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filtro de budsqueda de personas por nombre, apellido o DNI.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         description: Token de autorización.
 */
personRouter.get('/', checkAdminAuth, findAll)

/**
 * @openapi
 * /api/person/{id}:
 *   get:
 *     tags:
 *       - Person
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la persona a devolver.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                  type: string
 *                  description: Id unico de la persona
 *                 dni:
 *                  type: string
 *                  description: DNI de la persona (único).
 *                 firstName:
 *                  type: string
 *                  description: Nombre/s de la persona.
 *                 lastName:
 *                  type: string
 *                  description: Apellido/s de la persona.
 *                 phone:
 *                  type: string
 *                  description: Numero de telefono de la persona (no required).
 *                 email:
 *                  type: string
 *                  description: Email de la persona (único).
 *                 birthdate:
 *                  type: string
 *                  format: date
 *                  description: Fecha de nacimiento de la persona.
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Persona no encontrada
 *       500:
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
personRouter.get('/:id', findOne)

/**
 * @openapi
 * /api/person:
 *   post:
 *     tags:
 *       - Person
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                type: string
 *                description: DNI de la persona (único).
 *               firstName:
 *                type: string
 *                description: Nombre/s de la persona.
 *               lastName:
 *                type: string
 *                description: Apellido/s de la persona.
 *               phone:
 *                type: string
 *                description: Numero de telefono de la persona (no required).
 *               email:
 *                type: string
 *                description: Email de la persona (único).
 *               birthdate:
 *                type: string
 *                format: date
 *                description: Fecha de nacimiento de la persona.
 *               password:
 *                type: string
 *                description: Contraseña de la persona.
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Person created
 *                 data:
 *                   type: object
 *                   properties:
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
 *                     type: string
 *                     format: date
 *                     description: Fecha de nacimiento de la persona.
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La fecha de nacimineto ingresada no es valida
 *       500:
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
personRouter.post('/', add)

/**
 * @openapi
 * /person/{id}:
 *   put:
 *     tags:
 *       - Person
 *     description: Actualiza una persona, si esta tiene el permiso (es admin o es una persona) viendo el header authorization
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la persona a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *                 description: DNI de la persona (único).
 *               firstName:
 *                 type: string
 *                 description: Nombre/s de la persona.
 *               lastName:
 *                 type: string
 *                 description: Apellido/s de la persona.
 *               phone:
 *                 type: string
 *                 description: Numero de telefono de la persona (no required).
 *               email:
 *                 type: string
 *                 description: Email de la persona (único).
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de nacimiento de la persona.
 *               password:
 *                 type: string
 *                 description: Contraseña de la persona.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Id unico de la persona
 *                 dni:
 *                   type: string
 *                   description: DNI de la persona (único).
 *                 firstName:
 *                   type: string
 *                   description: Nombre/s de la persona.
 *                 lastName:
 *                   type: string
 *                   description: Apellido/s de la persona.
 *                 phone:
 *                   type: string
 *                   description: Numero de telefono de la persona (no required).
 *                 email:
 *                   type: string
 *                   description: Email de la persona (único).
 *                 birthdate:
 *                   type: string
 *                   format: date
 *                   description: Fecha de nacimiento de la persona.
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La fecha de nacimiento ingresada no es valida
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permiso
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Persona no encontrada
 *       500:
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

personRouter.put('/:id', checkPersonAuth, update)

/**
 * @openapi
 * /person/{id}:
 *   patch:
 *     tags:
 *       - Person
 *     description: Actualiza una persona, si esta tiene el permiso (es admin o es una persona) viendo el header authorization
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the person to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *                 description: DNI de la persona (único).
 *               firstName:
 *                 type: string
 *                 description: Nombre/s de la persona.
 *               lastName:
 *                 type: string
 *                 description: Apellido/s de la persona.
 *               phone:
 *                 type: string
 *                 description: Numero de telefono de la persona (no required).
 *               email:
 *                 type: string
 *                 description: Email de la persona (único).
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de nacimiento de la persona.
 *               password:
 *                 type: string
 *                 description: Contraseña de la persona.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Id unico de la persona
 *                 dni:
 *                   type: string
 *                   description: DNI de la persona (único).
 *                 firstName:
 *                   type: string
 *                   description: Nombre/s de la persona.
 *                 lastName:
 *                   type: string
 *                   description: Apellido/s de la persona.
 *                 phone:
 *                   type: string
 *                   description: Numero de telefono de la persona (no required).
 *                 email:
 *                   type: string
 *                   description: Email de la persona (único).
 *                 birthdate:
 *                   type: string
 *                   format: date
 *                   description: Fecha de nacimiento de la persona.
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La fecha de nacimiento ingresada no es valida
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No tienes permiso
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Persona no encontrada
 *       500:
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
personRouter.patch('/:id', update)

/**
 * @openapi
 * /api/person/{id}:
 *   delete:
 *     tags:
 *       - Person
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la persona a eliminar.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Person deleted
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                      type: string
 *                      description: Id unico de la persona
 *                     dni:
 *                      type: string
 *                      description: DNI de la persona (único).
 *                     firstName:
 *                      type: string
 *                      description: Nombre/s de la persona.
 *                     lastName:
 *                      type: string
 *                      description: Apellido/s de la persona.
 *                     phone:
 *                      type: string
 *                      description: Numero de telefono de la persona (no required).
 *                     email:
 *                      type: string
 *                      description: Email de la persona (único).
 *                     birthdate:
 *                      type: string
 *                      format: date
 *                      description: Fecha de nacimiento de la persona.
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Persona no encontrada
 *       500:
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
personRouter.delete('/:id', remove)
