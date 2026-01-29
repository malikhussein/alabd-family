import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum PostStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('posts')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_POST_ID' })
  id!: number;

  @Column()
  text!: string;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.PENDING,
  })
  status!: PostStatus;

  @Column({ name: 'author_id' })
  authorId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt!: Date | null;

  @Column({ type: 'text', nullable: true })
  imageKey?: string | null;

  @Column({ type: 'text', nullable: true })
  imageUrl?: string | null;
}
