import { Router } from 'express'
import { add, findAll, findOne, remove, sanitizePersonInput, update } from './competition-type.controller.js'

export const competitionTypeRouter = Router()

competitionTypeRouter.get('/', findAll)
competitionTypeRouter.get('/:id', findOne)
competitionTypeRouter.post('/', sanitizePersonInput, add)
competitionTypeRouter.put('/:id', sanitizePersonInput, update)
competitionTypeRouter.patch('/:id', sanitizePersonInput, update)
competitionTypeRouter.delete('/:id', remove)
