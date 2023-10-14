import { Request, Response } from 'express'
import { PersonRepository } from '../person/person.repository.js'
import { comparePassword } from '../helpers/handleBcrypt.js'
import { adminTokenSign, tokenSign } from '../helpers/generateToken.js'
import { AdminRepository } from '../admin/admin.repository.js'

const personRepository = new PersonRepository()
const adminRepository = new AdminRepository()

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    const user = await personRepository.findByEmail({ email })
    console.log(user)

    if (!user) {
      return res.status(404).send({ message: 'Nombre de usuario o contraseña incorrectos' })
    }

    const checkPassword = await comparePassword(password, user.password)

    const tokenSession = await tokenSign(user)

    if (checkPassword) {
      const { password, ...userWPass } = user
      return res.json({ data: userWPass, tokenSession })
    } else {
      return res.status(409).send({ message: 'Nombre de usuario o contraseña incorrectos' })
    }
  } catch (err) {
    console.log(err)
  }
}

export async function loginAdmin(req: Request, res: Response) {
  const { username, password } = req.body

  const admin = await adminRepository.findByUsername({ username })

  if (!admin) {
    return res.status(404).send({ message: 'Nombre de usuario o contraseña invalidos' })
  }

  const checkPassword = await comparePassword(password, admin?.password)

  const tokenSession = await adminTokenSign(admin)

  if (checkPassword) {
    const { password, ...adminWPass } = admin
    return res.json({ data: adminWPass, tokenSession })
  } else {
    return res.status(409).send({ message: 'Nombre de usuario o contraseña incorrectos' })
  }
}
