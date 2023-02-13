import * as yup from "yup"

export const activityCreateSchema = yup.object({
  title: yup.string().required("title cannot be null"),
})


export const activityUpdateSchema = yup.object({
  title: yup.string().required("title cannot be null"),
})
