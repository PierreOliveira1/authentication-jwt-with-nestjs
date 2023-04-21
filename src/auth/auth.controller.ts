import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() user: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(user);
  }

  @Post('signin')
  signIn(@Body() user: SignInDto): Promise<{ token: string }> {
    return this.authService.signIn(user);
  }
}
