import fastify from 'fastify';
import {check, ZodError} from 'zod';
import { env } from './env/index.js';
import fastifyJwt from '@fastify/jwt';
import { usersRoutes } from './http/controller/users/routes.js';
import { gymsRoutes } from './http/controller/gyms/routes.js';
import { checkInsRoutes } from './http/controller/check-ins/routes.js';
import fastifyCookie from '@fastify/cookie';

export const app = fastify() 

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: 'refreshToken',
      signed: false,
    },
    sign: {    
      expiresIn: '10m',
    }
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)


app.setErrorHandler(async (error,_, reply) => {
    if(error instanceof ZodError) {
        return reply
        .status(400)
        .send({message: 'Validation error.', issues: error.format()})
    }

    if(env.NODE_ENV !== 'production') {
        console.error(error)
    }
    return reply.status(500).send({message: 'Internal server error.'})
});