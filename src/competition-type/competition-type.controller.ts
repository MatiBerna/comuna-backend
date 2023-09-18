import { Response, Request, NextFunction } from 'express'
import { CompetitionTypeRepository } from './competition-type.repository.js'
import { CompetitionType } from './competition-type.entity.js'

const repository = new CompetitionTypeRepository()

export function sanitizePersonInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    description: req.body.description,
    rules: req.body.rules,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

export async function findAll(req: Request, res: Response) {
  const competitionTypes = await repository.findAll()
  res.json({ data: competitionTypes })
}

export async function findOne(req: Request, res: Response) {
  const id = parseInt(req.params.id)
  const competitionType = await repository.findOne({ id })

  if (!competitionType) {
    return res.status(404).send({ message: 'Competition Type not found' })
  }
  res.json({ data: competitionType })
}

export async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const competitionTypeInput = new CompetitionType(input.description, input.rules)

  const competitionType = await repository.add(competitionTypeInput)
  return res.status(201).json({ message: 'Competition Type created', data: competitionType })
}

export async function update(req: Request, res: Response) {
  const id = parseInt(req.params.id)

  const competitionType = await repository.update(req.body.sanitizedInput, id)

  if (!competitionType) {
    return res.status(404).send({ message: 'Competition Type not found' })
  }

  return res.status(200).send({ message: 'Competition Type updated', data: competitionType })
}

export async function remove(req: Request, res: Response) {
  const id = parseInt(req.params.id)

  const competitionType = await repository.delete({ id })

  if (!competitionType) {
    return res.status(404).send({ message: 'Competition Type not found' })
  }
  return res.status(200).send({ message: 'Competition Type deleted', data: competitionType })
}
