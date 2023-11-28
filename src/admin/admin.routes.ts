import { Router } from 'express'
import { add, findAll, findOne, remove, update } from './admin.controller.js'
import { checkAdminAuth } from '../auth/auth.middleware.js'

export const adminRouter = Router()

adminRouter.get('/', checkAdminAuth, findAll)
adminRouter.get('/:id', checkAdminAuth, findOne)
adminRouter.post('/', checkAdminAuth, add)
adminRouter.put('/:id', checkAdminAuth, update)
adminRouter.patch('/:id', checkAdminAuth, update)
adminRouter.delete('/:id', checkAdminAuth, remove)
