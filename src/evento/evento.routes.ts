import { Router } from 'express'
import { add, findAll, findOne, remove, update } from './evento.controller.js'

export const eventoRouter = Router()

eventoRouter.get('/', findAll)
eventoRouter.get('/:id', findOne)
eventoRouter.post('/', add)
eventoRouter.put('/:id', update)
eventoRouter.patch('/:id', update)
eventoRouter.delete('/:id', remove)
