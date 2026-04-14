import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app.js'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user.js'
import { prisma } from '../../../lib/prisma.js'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
   await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
   await prisma.checkIn.deleteMany()
   await prisma.gym.deleteMany()
   await prisma.user.deleteMany()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const profileResponse = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
       title: "JavaScript Gym",
       description: 'A gym for JavaScript developers',
       phone: '123456789',
       latitude: -27.2092852,
       longitude: -49.6401091,
      })

    expect(profileResponse.statusCode).toEqual(201)
  })
})