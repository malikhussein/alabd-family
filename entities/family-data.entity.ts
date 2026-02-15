import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('family_data')
export class FamilyData {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_FAMILY_DATA_ID' })
  id!: number;

  @Column({ name: 'family_name' })
  familyName!: string;

  @Column({ name: 'family_info', type: 'text', nullable: true })
  familyInfo?: string;
}
