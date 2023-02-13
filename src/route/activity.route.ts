import { FastifyPluginAsync } from "fastify"
import { ActivityEntity } from "../databases"
import { ActivityCreateDto } from "../dto"
import { ResponseStatusMessageDto, responseSuccess } from "../lib"
import {
  activityCreateSchema,
  activityUpdateSchema,
} from "../schema/activity.schema"

export const activityRoute: FastifyPluginAsync = async (fastify) => {
  const parentRouter = "/activity-groups"
  // Repo Activity Entity
  const activityRepo = fastify.orm.getRepository(ActivityEntity)

  fastify.get(`${parentRouter}`, async (_req, res) => {
    const data = await activityRepo.find()

    const resData = responseSuccess(data)
    return res.status(200).send(resData)
  })

  fastify.get(`${parentRouter}/:id`, async (req, res) => {
    // @ts-ignore
    const { id } = req.params
    const data = await activityRepo.findOne(id)

    if (!data) {
      return res.status(404).send({
        status: "Not Found",
        message: `Activity with ID ${id} Not Found`,
      } as ResponseStatusMessageDto)
    }
    const resData = responseSuccess(data)
    return res.status(200).send(resData)
  })

  fastify.post(
    `${parentRouter}`,
    {
      schema: { body: activityCreateSchema },
    },
    async (req, res) => {
      const { email, title } = req.body as ActivityCreateDto

      const data = await activityRepo.save({ email: email ? email : "", title })

      const resData = responseSuccess(data)

      return res.status(201).send(resData)
    }
  )

  fastify.patch(
    `${parentRouter}/:id`,
    {
      schema: { body: activityUpdateSchema },
    },
    async (req, res) => {
      // @ts-ignore
      const { id } = req.params
      const { email, title } = req.body as ActivityCreateDto

      const data = await activityRepo.findOne({ where: { activity_id: id } })
      if (!data) {
        return res.status(404).send({
          status: "Not Found",
          message: `Activity with ID ${id} Not Found`,
        })
      }

      await activityRepo.update(id, {
        title,
        email: email ? email : "",
      })

      const resDataUpdate = await activityRepo.findOne({
        where: { activity_id: id },
      })

      const resData = responseSuccess(resDataUpdate)

      return res.status(200).send(resData)
    }
  )

  fastify.delete(`${parentRouter}/:id`, async (req, res) => {
    // @ts-ignore
    const { id } = req.params

    const data = await activityRepo.findOne({ where: { activity_id: id } })
    if (!data) {
      return res.status(404).send({
        status: "Not Found",
        message: `Activity with ID ${id} Not Found`,
      })
    }

    await activityRepo.delete(id)

    return res.status(200).send(responseSuccess({}))
  })
}
