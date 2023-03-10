import * as yup from "yup"

export const todoCreateSchema = yup.object({
  title: yup.string().required("title cannot be null"),
  activity_group_id: yup.number().required("activity_group_id cannot be null"),
})

export const todoUpdateSchema = yup.object({})
