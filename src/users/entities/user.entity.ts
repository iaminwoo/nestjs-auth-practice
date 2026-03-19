import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../common/enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: Role.User })
  role: Role;

  @Column({ type: 'varchar', nullable: true })
  refreshToken?: string | null;
}
