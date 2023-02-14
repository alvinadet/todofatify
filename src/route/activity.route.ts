import { FastifyPluginAsync } from "fastify"
import { ActivityEntity } from "../databases"
import { ActivityCreateDto, ActivityDto } from "../dto"
import { ResponseStatusMessageDto, responseSuccess } from "../lib"
import {
  activityCreateSchema,
  activityUpdateSchema,
  ParamIdSchema,
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
    const { id } = req.params as { id: string }
    const data = await activityRepo.findOne(id)
    if (!data) {
      return res.status(404).send({
        status: "Not Found",
        message: `Activity with ID ${id} Not Found`,
      } as ResponseStatusMessageDto)
    }

    const resData = responseSuccess({
      created_at: data?.created_at,
      id: data?.activity_id,
      title: data?.title,
      email: data?.email,
      updated_at: data?.updated_at,
    })
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
      const resData = responseSuccess({
        created_at: data?.created_at,
        id: data?.activity_id,
        title: data?.title,
        email: data?.email,
        updated_at: data?.updated_at,
      })

      return res.status(201).send(resData)
    }
  )

  fastify.patch(
    `${parentRouter}/:id`,
    {
      schema: { body: activityUpdateSchema, params: ParamIdSchema },
    },
    async (req, res) => {
      const { id } = req.params as { id: string }
      const { email, title } = req.body as ActivityCreateDto
      const data = await activityRepo.findOne({ where: { activity_id: id } })
      if (!data) {
        return res.status(404).send({
          status: "Not Found",
          message: `Activity with ID ${id} Not Found`,
        })
      }

      const updatedEmail = email ? email : data.email
      await activityRepo.update(id, {
        title,
        email: updatedEmail,
      })

      const now = new Date().toISOString() as unknown as Date
      const resData = responseSuccess({
        id: Number(id),
        title,
        email: updatedEmail,
        created_at: data.created_at,
        updated_at: now,
      } as ActivityDto)
      return res.status(200).send(resData)
    }
  )

  fastify.delete(`${parentRouter}/:id`, async (req, res) => {
    const { id } = req.params as { id: string }

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
