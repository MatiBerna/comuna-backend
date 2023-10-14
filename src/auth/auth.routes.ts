import { Router } from 'express'
import { login, loginAdmin } from './auth.controller.js'

export const authRouter = Router()

authRouter.post('/user/login', login)
authRouter.post('/register')

authRouter.post('/admin/login', loginAdmin)
