import { Router } from 'express'
import { add, findAll, findOne, remove, update } from './competition.controller.js'

export const competetitionRouter = Router()

competetitionRouter.get('/', findAll)
competetitionRouter.get('/:id', findOne)
competetitionRouter.post('/', add)
competetitionRouter.put('/:id', update)
competetitionRouter.delete('/:id', remove)
