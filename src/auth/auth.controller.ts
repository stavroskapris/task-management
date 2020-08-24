import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentilasDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentilasDto: AuthCredentilasDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentilasDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentilasDto: AuthCredentilasDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentilasDto);
  }

  // @Post('/test')
  // @UseGuards(AuthGuard())
  // test(@GetUser() user: User) {
  //   console.log(user);
  // }
}
