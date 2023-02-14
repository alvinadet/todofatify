import fp from "fastify-plugin"

export const fastifyErrorHandlerPlugin = fp(async (fastify, options) => {
  fastify.setErrorHandler((err, req, res) => {
    if (err?.statusCode === 400) {
      return res.status(400).send({
        status: "Bad Request",
        message: err.message,
      })
    }

    console.error(err)

    return err
  })
})
