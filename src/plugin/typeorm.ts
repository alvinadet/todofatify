import fp from "fastify-plugin"
import { Connection, ConnectionOptions, createConnection } from "typeorm"

declare namespace fastifyTypeorm {
  interface FastifyTypeormNestedObject {
    [name: string]: Connection
  }

  interface FastifyTypeormOpts {
    connection?: Connection
    /**
     * Namespace
     */
    namespace?: string
  }
  type FastifyTypeormOptions = ConnectionOptions | FastifyTypeormOpts
}

declare module "fastify" {
  export interface FastifyInstance {
    orm: Connection & fastifyTypeorm.FastifyTypeormNestedObject
  }
}

export const fastifyTypeormPlugin = fp(
  async (fastify, options: fastifyTypeorm.FastifyTypeormOptions) => {
    // @ts-ignore
    const { namespace } = options
    // @ts-ignore
    delete options.namespace

    let connection
    // @ts-ignore
    if (options.connection) {
      // @ts-ignore
      connection = options.connection
    } else if (Object.keys(options).length) {
      // @ts-ignore
      connection = await createConnection(options)
    } else {
      connection = await createConnection()
    }

    fastify.log.info(
      `connect ${connection.options.type} database name = ${connection.options.database}`
    )
    if (namespace) {
      if (!fastify.orm) {
        fastify.decorate("orm", {})
      }

      if (fastify.orm[namespace]) {
        throw new Error(`Typeorm namespace already used: ${namespace}`)
      }

      fastify.orm[namespace] = connection

      fastify.addHook("onClose", async (instance, done) => {
        await instance.orm[namespace].close()
        done()
      })
    } else {
      fastify
        .decorate("orm", connection)
        .addHook("onClose", async (instance, done) => {
          await instance.orm.close()
          done()
        })
    }
  }
)
