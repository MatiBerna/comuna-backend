import { Router } from 'express'
import { add, findAll, findOne, remove, sanitizeAdminInput, update } from './admin.controller.js'

export const adminRouter = Router()

adminRouter.get('/', findAll)
adminRouter.get('/:id', findOne)
adminRouter.post('/', sanitizeAdminInput, add)
adminRouter.put('/:id', sanitizeAdminInput, update)
adminRouter.patch('/:id', sanitizeAdminInput, update)
adminRouter.delete('/:id', remove)
