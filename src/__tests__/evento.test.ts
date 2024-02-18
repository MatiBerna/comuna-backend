import { app, server } from '../app'
import request from 'supertest'
import { dbConect } from '../shared/db/conn'
import mongoose from 'mongoose'

jest.mock('bcrypt-ts', () => ({
  compareSync: jest.fn((content: string, hash: string) => content === hash),
}))

describe('TESTs evento endpoint', () => {
  // it('should store a evento', async () => {
  //   const result = await request(app)
  //     .post('/api/evento')
  //     .send({
  //       description: 'Dia en el que se testa en el back',
  //       fechaHoraIni: '2024-03-15T20:00:00.000Z',
  //       fechaHoraFin: '2024-03-16T06:00:00.000Z',
  //       image: 'https://th.bing.com/th/id/OIP.ilYLV5PpOl26myue6J2l4wHaFO?rs=1&pid=ImgDetMain',
  //     })
  //     .set('Accept', 'application/json  ')
  //     .expect(201)

  //   expect(result.body.message).toEqual('Evento creado')
  // })

  it('should return elements', async () => {
    const result = await request(app).get('/api/evento').expect(200)

    expect(result.body).toBeTruthy()
  })

  it('should return a list of eventos with pagination (10 elements)', async () => {
    const result = await request(app).get('/api/evento?page=1&prox=true').expect(200)

    expect(result.body.limit).toEqual(10)
  })
})

afterAll(async () => {
  server.close()
  await mongoose.disconnect()
})
