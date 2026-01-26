import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Unique('UQ_like_post_user', ['postId', 'userId'])
@Index('IDX_like_post', ['postId'])
@Index('IDX_like_user', ['userId'])
@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_LIKE_ID' })
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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
