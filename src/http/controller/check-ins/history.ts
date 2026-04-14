import { z } from 'zod'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { makefetchUserCheckInsHistoryUseCase } from '../../../use-cases/factories/make-fetch-user-check-ins-history-use-case.js'


export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.number().min(1).default(1)
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  
  const fetchUserCheckInsHistoryUseCase = makefetchUserCheckInsHistoryUseCase()
  
    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({ 
     userId: request.user.sub,
     page,
    })
  

  return reply.status(200).send({ checkIns })
}