import { ActivityEntity } from "../databases"

export interface ActivityDto extends Omit<ActivityEntity, "activity_id"> {
  id: number
}

export interface ActivityUpdateDto
  extends Omit<ActivityDto, "created_at" | "updated_at"> {}

export interface ActivityCreateDto
  extends Omit<ActivityUpdateDto, "activity_id"> {}
