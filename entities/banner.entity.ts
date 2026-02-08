import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('banners')
export class Banner extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_BANNER_ID' })
  id!: number;

  @Column({ type: 'text' })
  text!: string;

  @Column({ name: 'image_key', type: 'text' })
  imageKey!: string;

  @Column({ name: 'image_url', type: 'text' })
  imageUrl!: string;
}
