import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

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
}
