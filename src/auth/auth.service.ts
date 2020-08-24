import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentilasDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('Authservice');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  /**
   *
   * @param authCredentilasDto
   */
  signUp(authCredentilasDto: AuthCredentilasDto): Promise<void> {
    return this.userRepository.signUp(authCredentilasDto);
  }

  /**
   *
   * @param authCredentilasDto
   */
  async signIn(
    authCredentilasDto: AuthCredentilasDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentilasDto,
    );
    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const jwtPayload: JwtPayload = { username };

    const accessToken = await this.jwtService.sign(jwtPayload);
    this.logger.debug(
      `Generated jwt token with payload: ${JSON.stringify(jwtPayload)}`,
    ); // bad idea to log token just playing here
    return { accessToken };
  }
}
