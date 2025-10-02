import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

type ForgotPasswordDto = {
  email: string;
};
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  register(@Body() body: { name: string; email: string; password: string }) {
    console.log(body);
    return this.authService.register(body.name, body.email, body.password);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }
}
