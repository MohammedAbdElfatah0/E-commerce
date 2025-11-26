import { compereHash, emailType, expiredOtp, generatedHash, generateOtp, userProvider } from '@common/utils';
import { TokenService } from '@common/utils/token/token.service';
import { EmailService } from '@module/index';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TokenRepository, User, UserRepository } from 'src/DB/model/index';
import { ConfirmEmailDto } from './dto';
import { LoginDto } from './dto/login-auth.dto';
import { ResendOtpDto } from './dto/resend.otp-auth.dto';
import { Customer } from './entities/auth.entity';
import { RegisterResponse } from './entities/response/register.response';
import { console } from 'inspector';
import { OAuth2Client } from "google-auth-library"
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    private readonly googleClient: OAuth2Client;
    constructor(
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
        private readonly tokenRepo: TokenRepository,
        // @Inject(forwardRef(() => EmailService)) // solve import from index if email next auth 
        private readonly sendMail: EmailService,
        private readonly oAuth2: OAuth2Client,
        private readonly configService: ConfigService,
    ) {
        // const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID')?.split(',');
        // const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET'); // مش ضروري للـ ID token بس عادي

        this.googleClient = new OAuth2Client();
    }
    private checkUser = async (email: string) => {
        const customerExist = await this.userRepository.getOne({ email });
        if (!customerExist) throw new UnauthorizedException("Invalid credentials");
        return customerExist;
    }
    private async sendOtpEmail(type: string, email: string, otp: string): Promise<void> {
        switch (type) {
            case emailType.CONFIRM_EMAIL: await this.sendMail.sendEmail({
                to: email,
                subject: "Confirm Email",
                html: `<h1>Your OTP is ${otp}</h1>`
            });

                break;
            case emailType.RESET_PASSWORD: await this.sendMail.sendEmail({
                to: email,
                subject: "Reset Password",
                html: `<h1>Your OTP is ${otp}</h1>`
            });
                break;
            default:
                throw new Error("Invalid email type");
        }
    }
    private async generateTokens({ id, payload }: { id: Types.ObjectId, payload: Partial<User> }):
        Promise<{ accessToken: string, refreshToken: string }> {
        const accessToken =
            this.tokenService.generateAccessToken(payload);
        const refreshToken =
            await this.tokenService.generateRefreshToken(id, payload);
        return { accessToken, refreshToken };
    }


    //todo hash otp
    public async register(customer: Customer): Promise<RegisterResponse> {
        const customerExist = await this.userRepository.getOne({
            email: customer.email
        });
        if (customerExist) throw new ConflictException("user already exist");
        const createdCustomer = await this.userRepository.create(customer);
        await this.sendMail.sendEmail(
            {
                to: customer.email,
                subject: "confirm Email",
                html: `<h1>your Otp is ${customer.otp}</h1>`
            });
        const repsonseCutomer = JSON.parse(JSON.stringify(createdCustomer));

        // return result;
        const response = plainToInstance(RegisterResponse, repsonseCutomer);
        console.log({ response });
        return response;

    }
    //todo RESEND OTP
    public async resendOtp(resendOtpDto: ResendOtpDto): Promise<{ message: string }> {

        //check user exist
        const customerExist = await this.checkUser(resendOtpDto.email);
        console.log({ customerExist });
        //calcalate time to expire
        const now = new Date();
        const expire = customerExist.otpExpiry?.getTime() ?? now.getTime() - now.getTime();
        const time = Math.floor(expire / 1000);
        //otp is expired

        if (customerExist.otpExpiry! > now) throw new UnauthorizedException(`OTP is not expired yet,wait to expire,${time} seconds left`);
        //generate new otp
        customerExist.otp = generateOtp().toString();
        customerExist.otpExpiry = expiredOtp(5);
        //save otp
        await this.userRepository.updateOne(
            { _id: customerExist._id },
            { $set: { otp: customerExist.otp, otpExpiry: customerExist.otpExpiry } });

        //send email
        if (customerExist.isVerified) {
            await this.sendOtpEmail(emailType.RESET_PASSWORD, customerExist.email, customerExist.otp);
        } else {
            await this.sendOtpEmail(emailType.CONFIRM_EMAIL, customerExist.email, customerExist.otp);
        }
        //return message
        return { message: 'OTP resent successfully' };
    }

    public async confirmEmail(confirmEmailDto: ConfirmEmailDto) {
        const customerExist = await this.userRepository.getOne({ email: confirmEmailDto.email, isVerified: { $exists: true } });
        if (!customerExist) throw new UnauthorizedException("Invalid credentials or email already verified");
        if (customerExist.isVerified) throw new UnauthorizedException("Email already verified");
        //otp match
        if (customerExist.otp !== confirmEmailDto.otp) throw new UnauthorizedException("Invalid OTP");
        //otp not expired
        if (customerExist.otpExpiry! < new Date()) throw new UnauthorizedException("OTP expired");
        return await this.userRepository.updateOne(
            { _id: customerExist._id },
            {
                $set: { isVerified: true, confirmEmail: new Date(Date.now()), },
                $unset: { otp: "", otpExpiry: "" },
            });
    }

    public async login(loginDto: LoginDto): Promise<{ accessToken: string, refreshToken: string }> {
        //check user exist
        const customerExist = await this.checkUser(loginDto.email);
        //isVerify 
        //compere password
        const match = await compereHash(loginDto.password, customerExist?.password || '');
        if (!customerExist || !match) throw new UnauthorizedException("Invalid credentials");
        const payload = {
            _id: customerExist._id,
        }
        //generate token 

        return await this.generateTokens({ id: customerExist._id, payload });
    }

    public async logout(token: string) {

        const tokenExists = await this.tokenRepo.getOne({ token: token });
        //check token from db ma be expire or not by system
        // check token is revoke or not
        if (!tokenExists || tokenExists.isRevoked) throw new UnauthorizedException('Invalid refresh token');

        const dbToken = await this.tokenService.revokeRefreshToken(token);
        if (!dbToken) throw new UnauthorizedException('Invalid refresh token');
        return 'Logged out successfully';
    }
    // todo logOut all devices

    public async refreshToken(token: string) {
        let payload: User;
        try {
            payload = this.tokenService.verifyToken(token, 'refresh');
        } catch (err) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        const dbToken = await this.tokenRepo.getOne({ token: token });
        if (!dbToken || dbToken.isRevoked) throw new UnauthorizedException('Refresh token revoked');
        // generate new access token
        const accessToken = this.tokenService.generateAccessToken({ _id: payload._id });
        return { accessToken };
    }
    //LOGIN WITH GOOGLE AND SIGN UP WITH GOOGLE ONE METHOD SERVICE ::
    async googleLogin(idToken: string) {
        console.log('Verifying Google ID token...');

        try {
            // const clientIds = this.configService.get<string>('GOOGLE_CLIENT_ID').split(',');
            const ticket = await this.googleClient.verifyIdToken({
                idToken,
                audience: [
                    '495019556896-sh758oq4brqktu9l72f6bae2jgjbrqi3.apps.googleusercontent.com',  // Web الجديد
                    '495019556896-6cki0urpueqin3nbdmap1bevkjkbs5eg.apps.googleusercontent.com',     // Android
                    '495019556896-7pcfi6a0tkuvojn3etjl51u0kgsota26.apps.googleusercontent.com', // القديم (اللي لسه التوكن صادر له)
                ], // مهم جدًا يكون نفس الـ client_id اللي في Google Console
            });

            const payload = ticket.getPayload();
            console.log({ payload });
            if (!payload) {
                throw new UnauthorizedException('Invalid Google token payload');
            }

            const { email, given_name, family_name, sub, email_verified } = payload;

            if (!email_verified) {
                throw new UnauthorizedException('Google email not verified');
            }

            // الباقي زي ما هو (جيب اليوزر أو اعمله create)
            // get or create user
            let user = await this.userRepository.getOne({ email });

            if (!user) {
                user = await this.userRepository.create({
                    email,
                    firstName: given_name,
                    lastName: family_name,
                    provider: userProvider.GOOGLE,
                    isVerified: true,
                    confirmEmail: new Date(),
                });
                const dataPayload = user;
                return this.generateTokens({ id: user._id, payload: dataPayload });
            }
            return this.generateTokens({ id: user._id, payload });
        } catch (error) {
            console.error('Google token verification failed:', error.message);
            throw new UnauthorizedException(`Invalid or expired Google token ${error.message}`);
        }
    }
    //reset password 
    public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
        //data ---=> email otp new password
        const { email, otp, newPassword } = resetPasswordDto;
        //check user exist
        const customerExist = await this.checkUser(email);
        //otp match
        if (customerExist.otp !== otp) throw new UnauthorizedException("Invalid OTP");
        //otp not expired
        if (customerExist.otpExpiry! < new Date()) throw new UnauthorizedException("OTP expired,pls resend otp");
        //hash new password
        const hashedPassword = await generatedHash(newPassword);
        //save new password
        await this.userRepository.updateOne(
            { _id: customerExist._id },
            { $set: { password: hashedPassword }, $unset: { otp: 1, otpExpiry: 1 } });
        return "Password reset successfully";
    }




}
