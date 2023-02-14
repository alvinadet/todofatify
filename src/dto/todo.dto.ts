import { TodoEntity } from "../databases"

export interface TodoDto extends TodoEntity {
  activity_group_id: number
}

export interface TodoUpdateDto
  extends Omit<TodoDto, "created_at" | "updated_at" | "activity_group"> {}

export interface TodoCreateDto extends Omit<TodoUpdateDto, "id"> {}
