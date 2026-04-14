import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../../app.js'
import { prisma } from '../../../lib/prisma.js'

describe('Refresh Token (e2e)', () => {
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

  it('should be able to refresh token', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })
    
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const cookies = authResponse.headers['set-cookie']

    if (!cookies) {
      throw new Error('Cookies not found')
    }

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(expect.objectContaining({
      refreshToken: expect.any(String),
    }))
    expect(response.get('set-cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})