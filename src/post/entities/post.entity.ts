import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from './tag.entity';
import { SocialMediaType } from '../types/post.enum';

@Entity('posts')
export class Post extends BaseEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({
    type: 'enum',
    enum: SocialMediaType,
    default: SocialMediaType.Facebook, // 선택적으로 기본값 설정
  })
  type: SocialMediaType;

  @Column({ type: 'varchar', length: 30, nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'int', nullable: false })
  viewCount: number;

  @Column({ type: 'int', nullable: false })
  likeCount: number;

  @Column({ type: 'int', nullable: false })
  shareCount: number;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @ManyToMany(() => Tag, { cascade: true })
  @JoinTable({
    name: 'post_tag',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];
}
