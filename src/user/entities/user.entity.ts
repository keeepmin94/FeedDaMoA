import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm"
@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  accepted: boolean
}
