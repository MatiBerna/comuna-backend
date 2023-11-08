import { Router } from 'express'
import { add, findAll, findOne, update, remove } from './person.controller.js'
import { checkAdminAuth } from '../auth/auth.middleware.js'

export const personRouter = Router()

personRouter.get('/', checkAdminAuth, findAll)
personRouter.get('/:id', findOne)
personRouter.post('/', add)
personRouter.put('/:id', update)
personRouter.patch('/:id', update)
personRouter.delete('/:id', remove)
