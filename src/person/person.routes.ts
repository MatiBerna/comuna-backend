import { Router } from 'express'
import { add, findAll, findOne, remove, sanitizePersonInput, update } from './person.controller.js'
import { checkAdminAuth } from '../auth/auth.middleware.js'

export const personRouter = Router()

personRouter.get('/', checkAdminAuth, findAll)
personRouter.get('/:id', findOne)
personRouter.post('/', sanitizePersonInput, add)
personRouter.put('/:id', sanitizePersonInput, update)
personRouter.patch('/:id', sanitizePersonInput, update)
personRouter.delete('/:id', remove)
