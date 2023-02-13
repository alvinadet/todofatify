import { ActivityEntity } from "../databases"

export interface ActivityDto extends ActivityEntity {}

export interface ActivityUpdateDto
  extends Omit<ActivityDto, "created_at" | "updated_at" | "deleted_at"> {}

export interface ActivityCreateDto
  extends Omit<ActivityUpdateDto, "activity_id"> {}
