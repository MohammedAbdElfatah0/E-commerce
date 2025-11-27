import { BadRequestException, Body, Controller, Headers, Patch, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmEmailDto, LoginDto, RegisterDto, ResendOtpDto, ResetPasswordDto } from './dto';
import { AuthFactoryService } from './factory/index';

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
      data: createCustomer
    };
  }

  @Patch('/confirm-email')
  public async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    await this.authService.confirmEmail(confirmEmailDto);
    return {
      message: "Email confirmed successfully",
    };
  }
  @Patch('/resend-otp')
  public async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    await this.authService.resendOtp(resendOtpDto);
    return {
      message: "OTP resent successfully",
    };
  }


  @Post('/login')
  public async login(@Body() loginDto: LoginDto,) {

    const { accessToken, refreshToken } = await this.authService.login(loginDto);
    return {
      message: "login successfully",
      data: { accessToken, refreshToken }
    }
  }
  @Patch('logout')
  @UsePipes(new ValidationPipe({ validateCustomDecorators: true }))
  public async logout(@Headers('Authorization') authorization: string) {
    if (!authorization) {
      throw new BadRequestException("Authorization header is missing");
    }


    const message = await this.authService.logout(authorization);
    return {
      message
    };
  }
  @Put('/refresh-token')
  public async refreshToken(@Headers('Authorization') authorization: string) {
    if (!authorization) {
      throw new BadRequestException("Authorization header is missing");
    }
    const { accessToken } = await this.authService.refreshToken(authorization);
    return {
      message: "token refreshed successfully",
      data: { accessToken }
    }

  }
  //LOGIN WITH GOOGLE AND SIGN UP WITH GOOGLE ONE METHOD SERVICE ::
  @Post('/google/login')
  public async googleLogin(@Body('idToken') idToken: string) {
    const { accessToken, refreshToken } = await this.authService.googleLogin(idToken);
    return {
      message: "login with google successfully",
      data: { accessToken, refreshToken }
    }
  }
  @Patch('/reset-password')
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {

    const message = await this.authService.resetPassword(resetPasswordDto);
    return {
      message,
    };
  }


}
