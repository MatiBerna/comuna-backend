import { Router } from 'express'
import { add, findAll, findOne, remove, update } from './competition-type.controller.js'
import { checkAdminAuth } from '../auth/auth.middleware.js'

export const competitionTypeRouter = Router()

competitionTypeRouter.get('/', findAll)
competitionTypeRouter.get('/:id', findOne)
competitionTypeRouter.post('/', checkAdminAuth, add)
competitionTypeRouter.put('/:id', checkAdminAuth, update)
competitionTypeRouter.patch('/:id', checkAdminAuth, update)
competitionTypeRouter.delete('/:id', checkAdminAuth, remove)
