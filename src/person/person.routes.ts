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
 *                       dni:
 *                         type: string
 *                         description: The unique identifier of the person.
 *                       firstName:
 *                         type: string
 *                         description: The first name of the person.
 *                       lastName:
 *                         type: string
 *                         description: The last name of the person.
 *                       phone:
 *                         type: string
 *                         description: The phone number of the person.
 *                       email:
 *                         type: string
 *                         description: The email of the person.
 *                       birthdate:
 *                         type: string
 *                         format: date
 *                         description: The birthdate of the person.
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
 *         description: The filter to apply on the person data.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         description: The authorization token.
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
 *         description: The ID of the person to retrieve.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dni:
 *                   type: string
 *                   description: The unique identifier of the person.
 *                 firstName:
 *                   type: string
 *                   description: The first name of the person.
 *                 lastName:
 *                   type: string
 *                   description: The last name of the person.
 *                 phone:
 *                   type: string
 *                   description: The phone number of the person.
 *                 email:
 *                   type: string
 *                   description: The email of the person.
 *                 birthdate:
 *                   type: string
 *                   format: date
 *                   description: The birthdate of the person.
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
 *                 type: string
 *                 description: The unique identifier of the person.
 *               firstName:
 *                 type: string
 *                 description: The first name of the person.
 *               lastName:
 *                 type: string
 *                 description: The last name of the person.
 *               phone:
 *                 type: string
 *                 description: The phone number of the person.
 *               email:
 *                 type: string
 *                 description: The email of the person.
 *               birthdate:
 *                 type: date
 *                 description: The birthdate of the person.
 *               password:
 *                 type: string
 *                 description: The password of the person.
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
 *                     dni:
 *                       type: string
 *                       description: The unique identifier of the person.
 *                     firstName:
 *                       type: string
 *                       description: The first name of the person.
 *                     lastName:
 *                       type: string
 *                       description: The last name of the person.
 *                     phone:
 *                       type: string
 *                       description: The phone number of the person.
 *                     email:
 *                       type: string
 *                       description: The email of the person.
 *                     birthdate:
 *                       type: date
 *                       description: The birthdate of the person.
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
 * /api/person/{id}:
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
 *                 description: The unique identifier of the person.
 *               firstName:
 *                 type: string
 *                 description: The first name of the person.
 *               lastName:
 *                 type: string
 *                 description: The last name of the person.
 *               phone:
 *                 type: string
 *                 description: The phone number of the person.
 *               email:
 *                 type: string
 *                 description: The email of the person.
 *               birthdate:
 *                 type: date
 *                 description: The birthdate of the person.
 *               password:
 *                 type: string
 *                 description: The password of the person.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dni:
 *                   type: string
 *                   description: The unique identifier of the person.
 *                 firstName:
 *                   type: string
 *                   description: The first name of the person.
 *                 lastName:
 *                   type: string
 *                   description: The last name of the person.
 *                 phone:
 *                   type: string
 *                   description: The phone number of the person.
 *                 email:
 *                   type: string
 *                   description: The email of the person.
 *                 birthdate:
 *                   type: date
 *                   description: The birthdate of the person.
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
 * /api/person/{id}:
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
 *                 description: The unique identifier of the person.
 *               firstName:
 *                 type: string
 *                 description: The first name of the person.
 *               lastName:
 *                 type: string
 *                 description: The last name of the person.
 *               phone:
 *                 type: string
 *                 description: The phone number of the person.
 *               email:
 *                 type: string
 *                 description: The email of the person.
 *               birthdate:
 *                 type: date
 *                 description: The birthdate of the person.
 *               password:
 *                 type: string
 *                 description: The password of the person.
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dni:
 *                   type: string
 *                   description: The unique identifier of the person.
 *                 firstName:
 *                   type: string
 *                   description: The first name of the person.
 *                 lastName:
 *                   type: string
 *                   description: The last name of the person.
 *                 phone:
 *                   type: string
 *                   description: The phone number of the person.
 *                 email:
 *                   type: string
 *                   description: The email of the person.
 *                 birthdate:
 *                   type: date
 *                   description: The birthdate of the person.
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
 *         description: The ID of the person to delete.
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
 *                     dni:
 *                       type: string
 *                       description: The unique identifier of the person.
 *                     firstName:
 *                       type: string
 *                       description: The first name of the person.
 *                     lastName:
 *                       type: string
 *                       description: The last name of the person.
 *                     phone:
 *                       type: string
 *                       description: The phone number of the person.
 *                     email:
 *                       type: string
 *                       description: The email of the person.
 *                     birthdate:
 *                       type: date
 *                       description: The birthdate of the person.
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
