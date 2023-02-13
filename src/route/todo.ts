import { FastifyPluginAsync } from "fastify"
import { ActivityEntity } from "../databases"

export const todoRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get("/todo", async (req, res) => {
    fastify.addHook('preValidation',() => {})
    const data = await fastify.orm.getRepository(ActivityEntity).find()
    return data
  })

  fastify.post("/todo",async (req, res) => {
    
  })
}
