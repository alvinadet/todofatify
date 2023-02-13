import { TodoEntity } from "../databases"

export interface TodoDto extends TodoEntity {}

export interface TodoUpdateDto
  extends Omit<TodoDto, "created_at" | "updated_at" | "activity_group"> {
  activity_group_id: number
}

export interface TodoCreateDto extends Omit<TodoUpdateDto, "id"> {}
