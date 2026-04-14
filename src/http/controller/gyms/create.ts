import { z } from 'zod'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeCreateGymUseCase } from '../../../use-cases/factories/make-create-gym-use-case.js'


export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) < 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) < 180
    }),
  })

  const { title, phone, description, latitude, longitude } = createBodySchema.parse(request.body)

  
  const createGymUseCase = makeCreateGymUseCase()
  
  await createGymUseCase.execute({ title, phone, description, latitude, longitude })
  

  return reply.status(201).send()
}