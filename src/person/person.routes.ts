import { Router } from 'express'
import { add, findAll, findOne, update, remove } from './person.controller.js'
import { checkAdminAuth, checkPersonAuth } from '../auth/auth.middleware.js'
import { checkSchema, param, query } from 'express-validator'

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
personRouter.get(
  '/',
  checkAdminAuth,
  checkSchema(
    {
      page: {
        trim: true,
        notEmpty: { errorMessage: 'El número de página es requrido en query', bail: true },
        isNumeric: { errorMessage: 'Número de página inválido' },
      },
    },
    ['query']
  ),
  findAll
)
//query('page').notEmpty().withMessage('El número de pagina es requerido').isNumeric().withMessage('número de página inválido')
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
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         description: Token de autorización.
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
 *                        example: ID de persona inválido
 *                      path:
 *                        type: string
 *                        example: id
 *                      location:
 *                        type: string
 *                        example: params
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
personRouter.get(
  '/:id',
  checkPersonAuth,
  param('id').notEmpty().withMessage('El id de persona es requerido').isMongoId().withMessage('ID de persona inválido'),
  findOne
)

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
 *                        example: matias.bernardi.1gmail.com
 *                      msg:
 *                        type: string
 *                        example: El E-Mail ingresado es inválido
 *                      path:
 *                        type: string
 *                        example: email
 *                      location:
 *                        type: string
 *                        example: body
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
personRouter.post(
  '/',
  checkSchema({
    dni: {
      trim: true,
      notEmpty: { errorMessage: 'El DNI es requerido', bail: true },
      isNumeric: { errorMessage: 'El DNI debe ser numérico', bail: true },
      isLength: { options: { min: 7 }, errorMessage: 'El DNI debe tener al menos 7 dígitos' },
    },
    firstName: {
      trim: true,
      notEmpty: { errorMessage: 'El campo nombre es requerido', bail: true },
      matches: { options: /^[A-Za-z\s]*$/, errorMessage: 'El campo nombre solo debe letras y espacios' },
    },
    lastName: {
      trim: true,
      notEmpty: { errorMessage: 'El campo apellido es requerido', bail: true },
      matches: { options: /^[A-Za-z\s]*$/, errorMessage: 'El campo apellido solo debe letras y espacios' },
    },
    phone: {
      trim: true,
      optional: true,
      custom: {
        options: (value) => {
          return value === '' || !isNaN(Number(value))
        },
        errorMessage: 'El campo teléfono solo debe contener números',
      },
    },
    email: {
      trim: true,
      notEmpty: { errorMessage: 'El E-Mail es requerido', bail: true },
      isEmail: { errorMessage: 'El E-Mail ingresado es inválido' },
    },
    birthdate: {
      trim: true,
      notEmpty: { errorMessage: 'La fecha de nacimiento es requerida', bail: true },
      isISO8601: { errorMessage: 'La fecha de nacimiento no es válida' },
    },
    password: {
      notEmpty: { errorMessage: 'La contraseña es requerida' },
      isLength: { options: { min: 6 }, errorMessage: 'La contraseña debe tener minimo 6 caracteres' },
    },
  }),
  add
)

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
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         description: Token de autorización.
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
 *                        example: matias.bernardi.1gmail.com
 *                      msg:
 *                        type: string
 *                        example: El E-Mail ingresado es inválido
 *                      path:
 *                        type: string
 *                        example: email
 *                      location:
 *                        type: string
 *                        example: body
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

personRouter.put(
  '/:id',
  checkPersonAuth,
  param('id').notEmpty().withMessage('El id de persona es requerido').isMongoId().withMessage('ID de persona inválido'),
  checkSchema({
    dni: {
      trim: true,
      optional: true,
      isNumeric: { errorMessage: 'El DNI debe ser numérico', bail: true },
      isLength: { options: { min: 7 }, errorMessage: 'El DNI debe tener al menos 7 dígitos' },
    },
    firstName: {
      trim: true,
      optional: true,
      matches: { options: /^[A-Za-z\s]*$/, errorMessage: 'El campo nombre solo debe letras y espacios' },
    },
    lastName: {
      trim: true,
      optional: true,
      matches: { options: /^[A-Za-z\s]*$/, errorMessage: 'El campo apellido solo debe letras y espacios' },
    },
    phone: {
      trim: true,
      optional: true,
      isNumeric: { errorMessage: 'El campo teléfono solo debe contener números' },
    },
    email: {
      trim: true,
      optional: true,
      isEmail: { errorMessage: 'El E-Mail ingresado es inválido' },
    },
    birthdate: {
      trim: true,
      optional: true,
      isISO8601: { errorMessage: 'La fecha de nacimiento no es válida' },
    },
    password: {
      optional: true,
      isLength: { options: { min: 6 }, errorMessage: 'La contraseña debe tener minimo 6 caracteres' },
    },
  }),
  update
)

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
 *         description: ID de la persona a actualizar.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         description: Token de autorización.
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
 *                        example: matias.bernardi.1gmail.com
 *                      msg:
 *                        type: string
 *                        example: El E-Mail ingresado es inválido
 *                      path:
 *                        type: string
 *                        example: email
 *                      location:
 *                        type: string
 *                        example: body
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
personRouter.patch(
  '/:id',
  checkPersonAuth,
  param('id').notEmpty().withMessage('El id de persona es requerido').isMongoId().withMessage('ID de persona inválido'),
  checkSchema({
    dni: {
      trim: true,
      optional: true,
      isNumeric: { errorMessage: 'El DNI debe ser numérico', bail: true },
      isLength: { options: { min: 7 }, errorMessage: 'El DNI debe tener al menos 7 dígitos' },
    },
    firstName: {
      trim: true,
      optional: true,
      matches: { options: /^[A-Za-z\s]*$/, errorMessage: 'El campo nombre solo debe letras y espacios' },
    },
    lastName: {
      trim: true,
      optional: true,
      matches: { options: /^[A-Za-z\s]*$/, errorMessage: 'El campo apellido solo debe letras y espacios' },
    },
    phone: {
      trim: true,
      optional: true,
      isNumeric: { errorMessage: 'El campo teléfono solo debe contener números' },
    },
    email: {
      trim: true,
      optional: true,
      isEmail: { errorMessage: 'El E-Mail ingresado es inválido' },
    },
    birthdate: {
      trim: true,
      optional: true,
      isISO8601: { errorMessage: 'La fecha de nacimiento no es válida' },
    },
    password: {
      optional: true,
      isLength: { options: { min: 6 }, errorMessage: 'La contraseña debe tener minimo 6 caracteres' },
    },
  }),
  update
)

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
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         description: Token de autorización.
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
 *                        example: ID de persona inválido
 *                      path:
 *                        type: string
 *                        example: id
 *                      location:
 *                        type: string
 *                        example: params
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
personRouter.delete(
  '/:id',
  checkPersonAuth,
  param('id').notEmpty().withMessage('El id de persona es requerido').isMongoId().withMessage('ID de persona inválido'),
  remove
)
