import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('applications')
export class ApplicationDao {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: string;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'status', type: 'varchar' })
  status: string;
}
