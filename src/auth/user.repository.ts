import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentilasDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /**
   *
   * @param authCredentilasDto
   */
  async signUp(authCredentilasDto: AuthCredentilasDto): Promise<void> {
    const { username, password } = authCredentilasDto;

    const user = this.create();

    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentilasDto: AuthCredentilasDto,
  ): Promise<string> {
    const { username, password } = authCredentilasDto;

    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    }

    return null;
  }
  /**
   *
   * @param password
   * @param salt
   */
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
