import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user.js'

describe('Search Gym (e2e)', () => {
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


  it('should be able to search gyms for title', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
       title: "JavaScript Gym",
       description: 'A gym for JavaScript developers',
       phone: '123456789',
       latitude: -27.2092852,
       longitude: -49.6401091,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
       title: "TypeScript Gym",
       description: 'A gym for TypeScript developers',
       phone: '123456789',
       latitude: -27.2092852,
       longitude: -49.6401091,
      })

    const profileResponse = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'JavaScript',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.gyms).toHaveLength(1)
    expect(profileResponse.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})