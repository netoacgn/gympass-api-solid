import fastify from "fastify";
import { ZodError } from "zod";
import fastifyJwt from "@fastify/jwt";

import { checkInsRoutes } from "./http/controllers/check-ins/routes";
import { usersRoutes } from "./http/controllers/users/routes";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { env } from "./env";

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
})

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: 'Validation error.', issue: error.format() })
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error);
    } else {
        // TODO: Should log to an external tool like DataDog/NewRelic
    }

    return reply.status(500).send({ message: 'Internal server error.' })
})
