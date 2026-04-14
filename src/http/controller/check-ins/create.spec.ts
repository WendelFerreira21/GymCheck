import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user.js'

describe('Create checkin (e2e)', () => {
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


  it('should be able to create a checkin', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
        data: {
          title: "JavaScript Gym",
          latitude: -27.2092852,
          longitude: -49.6401091,
        }
    })

    const profileResponse = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
       latitude: -27.2092852,
       longitude: -49.6401091,
      })

    expect(profileResponse.statusCode).toEqual(201)
  })
})