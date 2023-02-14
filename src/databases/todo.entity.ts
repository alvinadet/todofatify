import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { ActivityEntity } from "./activity.entity"

@Entity({ name: "todos" })
export class TodoEntity {
  @PrimaryGeneratedColumn("increment")
  todo_id!: number

  @Column({ type: "text", name: "title", nullable: true })
  title?: string

  @ManyToOne(() => ActivityEntity, (t) => t.activity_id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "activity_group_id" })
  activity_group!: ActivityEntity

  @Column({ name: "is_active", type: "boolean", nullable: true, default: true })
  is_active!: boolean

  @Column({ name: "priority", type: "varchar", nullable: true })
  priority?: string

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date

  @UpdateDateColumn({ name: "updated_at", nullable: true })
  updated_at?: Date
}
