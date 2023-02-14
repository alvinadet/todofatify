import { FastifyPluginAsync } from "fastify"
import { TodoEntity } from "../databases"
import { TodoCreateDto, TodoDto } from "../dto/todo.dto"
import { ResponseStatusMessageDto, responseSuccess } from "../lib"
import { todoCreateSchema, todoUpdateSchema } from "../schema/todo.schema"

export const todoRoute: FastifyPluginAsync = async (fastify) => {
  const parentRouter = "/todo-items"
  // Repo Activity Entity
  const todoRepo = fastify.orm.getRepository(TodoEntity)

  fastify.get(`${parentRouter}`, async (req, res) => {
    // @ts-ignore
    const { activity_group_id } = req.query

    const qb = todoRepo
      .createQueryBuilder("q")
      .loadRelationIdAndMap("activity_group_id", "q.activity_group")

    if (activity_group_id) {
      qb.where("q.activity_group = :activity_group_id", { activity_group_id })
    }

    const data = (await qb.getMany()).map((t) => {
      return {
        // @ts-ignore
        activity_group_id: t.activity_group_id,
        created_at: t.created_at,
        id: t.todo_id,
        is_active: t.is_active,
        priority: t.priority,
        title: t.title,
        updated_at: t.updated_at,
      } as TodoDto
    })

    const resData = responseSuccess(data)
    return res.status(200).send(resData)
  })

  fastify.get(`${parentRouter}/:id`, async (req, res) => {
    // @ts-ignore
    const { id } = req.params

    const qb = todoRepo
      .createQueryBuilder("q")
      .loadRelationIdAndMap("activity_group_id", "q.activity_group")
      .where("q.todo_id = :id", { id })

    const data = await qb.getOne()

    if (!data) {
      return res.status(404).send({
        status: "Not Found",
        message: `Todo with ID ${id} Not Found`,
      } as ResponseStatusMessageDto)
    }

    const resData = responseSuccess({
      // @ts-ignore
      activity_group_id: data.activity_group_id,
      created_at: data.created_at,
      id: data.todo_id,
      is_active: data.is_active,
      priority: data.priority,
      title: data.title,
      updated_at: data.updated_at,
    } as TodoDto)

    return res.status(200).send(resData)
  })

  fastify.post(
    `${parentRouter}`,
    {
      schema: { body: todoCreateSchema },
    },
    async (req, res) => {
      const { is_active, title, priority, activity_group_id } =
        req.body as TodoCreateDto

      const payload = todoRepo.create({
        activity_group: Number(activity_group_id) as any,
        is_active: is_active ? is_active : true,
        priority: priority ? priority : "very-high",
        title,
      })

      const data = await todoRepo.save(payload)
      const resData = responseSuccess({
        activity_group_id,
        created_at: data.created_at,
        id: data.todo_id,
        is_active: data.is_active,
        priority: data.priority,
        title: data.title,
        updated_at: data.updated_at,
      } as TodoDto)

      return res.status(201).send(resData)
    }
  )

  fastify.patch(
    `${parentRouter}/:id`,
    {
      schema: { body: todoUpdateSchema },
    },
    async (req, res) => {
      // @ts-ignore
      const { id } = req.params
      const { is_active, title, priority } = req.body as TodoCreateDto

      const qb = todoRepo
        .createQueryBuilder("q")
        .loadRelationIdAndMap("activity_group_id", "q.activity_group")
        .where("q.todo_id = :id", { id })
      const data = await qb.getOne()
      if (!data) {
        return res.status(404).send({
          status: "Not Found",
          message: `Todo with ID ${id} Not Found`,
        })
      }

      const schema = new Object({
        title: data.title,
        priority: data.priority,
        is_active: data.is_active,
      }) as TodoDto

      if (title) {
        schema.title = title
      }

      if (priority) {
        schema.priority = priority
      }

      if (is_active) {
        schema.is_active = is_active
      }

      await todoRepo.update(id, schema)

      const now = new Date().toISOString() as unknown as Date
      const resData = responseSuccess({
        activity_group_id: (data as unknown as { activity_group_id: number })
          .activity_group_id,
        created_at: data?.created_at,
        id: data.todo_id,
        is_active: schema.is_active,
        priority: schema?.priority,
        title: schema?.title,
        updated_at: now,
      } as TodoDto)

      return res.status(200).send(resData)
    }
  )

  fastify.delete(`${parentRouter}/:id`, async (req, res) => {
    // @ts-ignore
    const { id } = req.params

    const data = await todoRepo.findOne({ where: { todo_id: id } })
    if (!data) {
      return res.status(404).send({
        status: "Not Found",
        message: `Todo with ID ${id} Not Found`,
      })
    }

    await todoRepo.delete(id)

    return res.status(200).send(responseSuccess({}))
  })
}
