import { Router } from 'express'
import { add, findAll, findOne, remove, update } from './person.controller.js'
//import { checkAdminAuth } from '../auth/auth.middleware.js'

export const personRouter = Router()

personRouter.get('/', findAll)
personRouter.get('/:id', findOne)
personRouter.post('/', add)
personRouter.put('/:id', update)
personRouter.patch('/:id', update)
personRouter.delete('/:id', remove)
