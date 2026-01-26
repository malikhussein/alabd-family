import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Post } from './post.entity';
import { User } from './user.entity';

@Unique('UQ_comment_post_user', ['postId', 'userId'])
@Index('IDX_comment_post', ['postId'])
@Index('IDX_comment_user', ['userId'])
@Entity('comments')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_COMMENT_ID' })
  id!: string;

  @Column()
  postId!: number;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post!: Post;

  @Column()
  userId!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'text' })
  content!: string;
}
