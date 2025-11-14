import { comperePassword } from '@common/index';
import { UserRepository } from '@model/index';
import { EmailService } from '@module/index';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { Customer } from './entities/auth.entity';
// import { ConfigService } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly sendMail: EmailService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    public async register(customer: Customer): Promise<Customer> {
        const customerExist = await this.userRepository.getOne({
            email: customer.email
        });
        if (customerExist) throw new ConflictException("user already exist");
        const createdCustomer = await this.userRepository.create(customer);
        //todo send email
        await this.sendMail.sendEmail(
            {
                to: customer.email,
                subject: "confirm Email",
                html: `<h1>your Otp is ${customer.otp}</h1>`
            });
        const { password, otp, otpExpiry, ...result } = JSON.parse(JSON.stringify(createdCustomer));
        return result;
    }
    //TODO CONFIRM EMAIL

    public async login(loginDto: LoginDto) {
        const customerExist = await this.userRepository.getOne({ email: loginDto.email, isVerified: true });
        //check user exist
        //isVerify 
        //compere password
        const match = await comperePassword(loginDto.password, customerExist?.password || '');
        if (!customerExist || !match) throw new UnauthorizedException("Invalid credentials");
        const payload = {
            _id: customerExist._id,
            email: customerExist.email,
        }
        //generate token 
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('token').access,
            expiresIn: "15m",
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('token').refresh,
            expiresIn: "15m",
        });
        return { accessToken, refreshToken };

    }
}
