import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AuthCodeType {
  VERIFY_EMAIL = 'verify_email',
  RESET_PASSWORD = 'reset_password',
}

@Entity('auth_codes')
export class AuthCode extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_AUTH_CODE_ID' })
  id!: number;

  @Column()
  email!: string;

  @Column()
  code!: string;

  @Column({ type: 'enum', enum: AuthCodeType })
  type!: AuthCodeType;

  @Column({ type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  usedAt!: Date;
}
