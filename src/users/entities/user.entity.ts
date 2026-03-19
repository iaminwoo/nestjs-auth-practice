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

  @Column({ nullable: true })
  refreshToken: string;
}
