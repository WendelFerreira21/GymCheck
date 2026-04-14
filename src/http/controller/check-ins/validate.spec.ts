import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user.js'

describe('Validate checkin (e2e)', () => {
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

  it('should be able to validate a checkin', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
        data: {
          title: "JavaScript Gym",
          latitude: -27.2092852,
          longitude: -49.6401091,
        }
    })

    let checkIn = await prisma.checkIn.create({
        data: {
          gym_id: gym.id,
          user_id: user.id,
        }
    })

    const profileResponse = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(204)

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      }
    })

    expect(checkIn.validation_at).toEqual(expect.any(Date))
  })
})