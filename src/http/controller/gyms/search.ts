import { z } from 'zod'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeSearchGymsUseCase } from '../../../use-cases/factories/make-search-gyms-use-case.js'


export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchQueryGymsSchema = z.object({
    q: z.string(),
    page: z.coerce.number().default(1)
  })

  const { q, page } = searchQueryGymsSchema.parse(request.query)

  
  const searchGymsUseCase = makeSearchGymsUseCase()
  
  const { gyms } = await searchGymsUseCase.execute({ query: q, page })
  

  return reply.status(200).send({ gyms })
}