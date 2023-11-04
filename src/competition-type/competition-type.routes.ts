import { Router } from 'express'
import { add, findAll, findOne, remove, sanitizePersonInput, update } from './competition-type.controller.js'
import { checkAdminAuth } from '../auth/auth.middleware.js'

export const competitionTypeRouter = Router()

competitionTypeRouter.get('/', findAll)
competitionTypeRouter.get('/:id', findOne)
competitionTypeRouter.post('/', checkAdminAuth, sanitizePersonInput, add)
competitionTypeRouter.put('/:id', checkAdminAuth, sanitizePersonInput, update)
competitionTypeRouter.patch('/:id', checkAdminAuth, sanitizePersonInput, update)
competitionTypeRouter.delete('/:id', checkAdminAuth, remove)
