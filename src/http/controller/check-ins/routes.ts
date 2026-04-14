import type { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt.js";
import { metrics } from "./metrics.js";
import { history } from "./history.js";
import { validate } from "./validate.js";
import { create } from "./create.js";
import { verifyUserRole } from "../../middlewares/verify-user-role.js";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  
  app.get('/check-ins/metrics', metrics)
  app.get('/check-ins/history', history)

  app.post('/gyms/:gymId/check-ins', create)
  app.patch('/check-ins/:checkinId/validate', { onRequest: [verifyUserRole('ADMIN')] },validate)

}