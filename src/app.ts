import fastify from "fastify"
import { ActivityEntity } from "./databases"
import { env } from "./env/env"
import { cors } from "./plugin"
import { fastifyTypeormPlugin } from "./plugin/typeorm"
import { todoRoute } from "./route/todo"

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

  server.register(todoRoute)

  server.get("/", () => {
    return "Hello World"
  })
  return server
}
