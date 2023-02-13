import fp from "fastify-plugin"

export const fastifyErrorHandlerPlugin = fp(async (fastify, options) => {
  fastify.setErrorHandler((err, req, res) => {
    if (err?.statusCode === 400) {
      return res.status(400).send({
        error: "Bad Request",
        message: err.message,
      })
    }

    return err
  })
})
