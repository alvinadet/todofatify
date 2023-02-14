import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { TodoEntity } from "./todo.entity"

@Entity({ name: "activities" })
export class ActivityEntity {
  @PrimaryGeneratedColumn("increment")
  activity_id!: number

  @Column({ type: "text", name: "title" })
  title!: string

  @Column({ name: "email", type: "varchar", nullable: true })
  email?: string

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date

  @UpdateDateColumn({ name: "updated_at", nullable: true })
  updated_at?: Date

  @OneToMany(() => TodoEntity, (t) => t.activity_group, { cascade: true })
  todos?: TodoEntity[]
}
