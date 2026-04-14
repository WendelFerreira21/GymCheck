import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user.js'

describe('Checkins history (e2e)', () => {
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

  it('should be able to list checkins history', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
        data: {
          title: "JavaScript Gym",
          latitude: -27.2092852,
          longitude: -49.6401091,
        }
    })

    await prisma.checkIn.createMany({
        data: [
            {
              gym_id: gym.id,
              user_id: user.id,
            },
            { 
              gym_id: gym.id,
              user_id: user.id,
            },
        ]
    })

    const profileResponse = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
    ])
  })
})