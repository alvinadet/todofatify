import fastify from "fastify"
import { ActivityEntity } from "./databases"
import { env } from "./env/env"
import {
  cors,
  fastifyErrorHandlerPlugin,
  fastifyValidatorCompiler,
} from "./plugin"
import { fastifyTypeormPlugin } from "./plugin/typeorm"
import { activityRoute } from "./route/activity.route"

const server = fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
})

export const app = () => {
  // Register Plugin
  server.register(cors)

  server.register(fastifyValidatorCompiler)

  server.register(fastifyErrorHandlerPlugin)

  server.register(fastifyTypeormPlugin, {
    host: env.MYSQL_HOST,
    type: "mysql",
    port: env.MYSQL_PORT,
    username: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DBNAME,
    synchronize: false,
    entities: [ActivityEntity],
  })

  server.register(activityRoute)

  server.get("/", () => {
    return "Hello World"
  })
  return server
}
