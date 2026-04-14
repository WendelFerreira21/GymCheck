import { check, z } from 'zod'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeValidateCheckInUseCase } from '../../../use-cases/factories/make-validate-check-in-use-case.js'


export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkinId: z.string().uuid(),
  })

  
  const { checkinId } = validateCheckInParamsSchema.parse(request.params)
  

  
  const ValidateCheckInUseCase = makeValidateCheckInUseCase()
  
   await ValidateCheckInUseCase.execute({ 
     checkinId,
    })
  

  return reply.status(204).send()
}