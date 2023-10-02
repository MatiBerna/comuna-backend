import { Router } from "express";
import { sanitizePersonInput, add, findOne, remove, update, findAll } from "./event.controller.js";

export const eventRouter = Router()

eventRouter.get('/', findAll)
eventRouter.get('/:id', findOne)
eventRouter.post('/', sanitizePersonInput, add)
eventRouter.put('/:id', sanitizePersonInput, update)
eventRouter.patch('/:id', sanitizePersonInput, update)
eventRouter.delete('/:id', remove)