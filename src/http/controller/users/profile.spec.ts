import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'
import { createAndAuthenticateUser } from '../../../utils/test/create-and-authenticate-user.js'

describe('Profile (e2e)', () => {
   beforeAll(async () => {
     await app.ready()
   })

   beforeEach(async () => {
     await prisma.checkIn.deleteMany()
     await prisma.user.deleteMany()
   })

   afterAll(async () => {
     await app.close()
   })

  it('should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(expect.objectContaining({
      email: 'johndoe@example.com',
    }))
  })
})