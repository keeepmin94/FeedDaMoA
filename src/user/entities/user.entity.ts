import { IsEmail } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  username: string;

  @IsEmail()
  @Column({ length: 50 })
  email: string;

  @Column()
  password: string;

  @Column()
  verificationCode: string;

  @Column({ default: false })
  isVerified: boolean;
}
