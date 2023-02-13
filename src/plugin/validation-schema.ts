import fp from "fastify-plugin"

const yupDefaultOptions = {
  strict: false,
  abortEarly: false,
  stripUnknown: true,
  recursive: true,
}
const createYupValidatorCompiler =
  (yupOptions = yupDefaultOptions) =>
  // @ts-ignore
  ({ schema }) =>
  // @ts-ignore
  (data) => {
    try {
      const result = schema.validateSync(data, yupOptions)
      return { value: result }
    } catch (error) {
      return { error: error }
    }
  }

export const fastifyValidatorCompiler = fp(async (fastify, options) => {
  // @ts-ignore
  const yupValidatorCompiler = createYupValidatorCompiler(options)
  // @ts-ignore
  fastify.setValidatorCompiler(yupValidatorCompiler)
})
