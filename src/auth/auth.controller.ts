import { Request, Response } from 'express'
import { comparePassword } from '../helpers/handleBcrypt'
import { adminTokenSign, tokenSign, verifyToken } from '../helpers/generateToken'
import Person from '../person/person.model'
import Admin from '../admin/admin.model'

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body

    const user = await Person.findOne({ email: username })

    if (!user) {
      return res.status(401).send({ message: 'Nombre de usuario o contraseña incorrectos' })
    }

    const checkPassword = await comparePassword(password, user.password)

    const tokenSession = await tokenSign(user)

    if (checkPassword) {
      const userObject = user.toObject()
      const { password, ...userWPass } = userObject
      return res.json({ data: userWPass, tokenSession })
    } else {
      return res.status(401).send({ message: 'Nombre de usuario o contraseña incorrectos' })
    }
  } catch (err) {
    console.log(err)
  }
}

export async function loginAdmin(req: Request, res: Response) {
  const { username, password } = req.body

  //const admin = await adminRepository.findByUsername({ username })
  const admin = await Admin.findOne({ username: username })

  if (!admin) {
    return res.status(401).send({ message: 'Nombre de usuario o contraseña invalidos' })
  }

  const checkPassword = await comparePassword(password, admin?.password!)

  if (checkPassword) {
    const adminObject = admin.toObject()
    const { password, ...adminWPass } = adminObject
    const tokenSession = await adminTokenSign(adminWPass)
    return res.json({ data: adminWPass, tokenSession })
  } else {
    return res.status(401).send({ message: 'Nombre de usuario o contraseña incorrectos' })
  }
}
