import type { FastifyInstance } from "fastify";
import { profile } from "./profile.js";
import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { authenticate } from "./authenticate.js";
import { register } from "./register.js";
import { refresh } from "./refresh.js";

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  app.get('/me',{ onRequest: verifyJWT },profile)
}