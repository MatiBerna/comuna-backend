import { Router } from 'express'
import { add, findAll, findOne, remove, update } from './admin.controller.js'

export const adminRouter = Router()

adminRouter.get('/', findAll)
adminRouter.get('/:id', findOne)
adminRouter.post('/', add)
adminRouter.put('/:id', update)
adminRouter.patch('/:id', update)
adminRouter.delete('/:id', remove)
