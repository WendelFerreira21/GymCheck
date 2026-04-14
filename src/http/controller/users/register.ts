import { z } from 'zod'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeRegisterUseCase } from '../../../use-cases/factories/make-register-use-case.js'
import { UsersAlreadyExistsError } from '../../../use-cases/error/users-already-exists-error.js'


export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()
  
    await registerUseCase.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UsersAlreadyExistsError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }

  return reply.status(201).send()
}
