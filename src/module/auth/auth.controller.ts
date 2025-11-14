import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { AuthFactoryService } from './factory/index';
import { LoginDto } from './dto/login-auth.dto';
import { AuthGuard } from '@common/guard';

@Controller('auth')


export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFactoryService: AuthFactoryService,
  ) { }

  @Post('/register')
  public async register(@Body() registerDto: RegisterDto) {
    const customer = await this.authFactoryService.createCustomer(registerDto);
    const createCustomer = await this.authService.register(customer);
    return {
      message: "done created User and send email",
      success: true,
      date: createCustomer
    };
  }
  //todo  confirm email


  @Post('/login')
  public async login(@Body() loginDto: LoginDto) {
    const { accessToken, refreshToken } = await this.authService.login(loginDto);
    return {
      message: "login successfully",
      success: true,
      data: { accessToken, refreshToken }
    }
  }


}
