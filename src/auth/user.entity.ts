import * as bcrypt from 'bcryptjs';
import { Task } from '../tasks/task.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';
@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;
  
  @OneToMany(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type => Task,
    task => task.user,
    { eager: true },
  )
  tasks: Task[];
  /**
   *
   * @param password
   */
  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);

    return hash === this.password;
  }
}
