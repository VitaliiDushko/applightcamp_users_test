import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' }) // Define schema and table name explicitly
export class UserEntity {
  @PrimaryGeneratedColumn('uuid') // Use 'uuid' for UUID primary key
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;
}
