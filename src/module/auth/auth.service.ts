import { compereHash, emailType, expiredOtp, generatedHash, generateOtp, TokenService, userProvider } from '@common/utils';
import { TokenRepository, User, UserRepository } from '@model/index';
import { EmailService } from '@module/index';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { OAuth2Client } from "google-auth-library";
import { Types } from 'mongoose';
import { ConfirmEmailDto, LoginDto, ResendOtpDto, ResetPasswordDto } from './dto';
import { Customer, RegisterResponse } from './entities';

@Injectable()
export class AuthService {
    private readonly googleClient: OAuth2Client;
    constructor(
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
        private readonly tokenRepo: TokenRepository,
        // @Inject(forwardRef(() => EmailService)) // solve import from index if email next auth 
        private readonly sendMail: EmailService,
        private readonly configService: ConfigService,
    ) {
        this.googleClient = new OAuth2Client(this.configService.get('google').clientId);
    }


    private checkUser = async (email: string): Promise<User> => {
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
                throw new ConflictException("Invalid email type");
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



    public async register(customer: Customer): Promise<RegisterResponse> {
        const customerExist = await this.userRepository.getOne({
            email: customer.email
        });
        if (customerExist) throw new ConflictException("user already exist");
        const createdCustomer = await this.userRepository.create({ ...customer, otp: await generatedHash(customer.otp) });
        await this.sendMail.sendEmail(
            {
                to: customer.email,
                subject: "confirm Email",
                html: `<h1>your Otp is ${customer.otp}</h1>`
            });
        const repsonseCutomer = JSON.parse(JSON.stringify(createdCustomer));

        // return result;
        const response = plainToInstance(RegisterResponse, repsonseCutomer);
        return response;

    }

    public async resendOtp(resendOtpDto: ResendOtpDto): Promise<{ message: string }> {

        //check user exist
        const customerExist = await this.checkUser(resendOtpDto.email);
        //calcalate time to expire
        const now = new Date();
        if (customerExist.otpExpiry > now) {
            const secondsLeft = Math.floor((customerExist.otpExpiry.getTime() - now.getTime()) / 1000);
            throw new UnauthorizedException(`OTP is not expired yet,wait to expire,${secondsLeft} seconds left`)
        };
        //generate new otp
        customerExist.otp = generateOtp().toString();
        customerExist.otpExpiry = expiredOtp(5);
        //save otp
        await this.userRepository.updateOne(
            { _id: customerExist._id },
            { $set: { otp: await generatedHash(customerExist.otp), otpExpiry: customerExist.otpExpiry } });

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
        if (!await compereHash(confirmEmailDto.otp, customerExist.otp)) throw new UnauthorizedException("Invalid OTP");
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

        const customerExist = await this.checkUser(loginDto.email);
        if (!customerExist.isVerified) {
            throw new UnauthorizedException("pls confirm account")
        }
        const match = await compereHash(loginDto.password, customerExist?.password || '');
        if (!customerExist || !match) throw new UnauthorizedException("Invalid credentials");
        const payload = {
            _id: customerExist._id,
        }
        return await this.generateTokens({ id: customerExist._id, payload });
    }

    public async logout(token: string): Promise<string> {

        const tokenExists = await this.tokenRepo.getOne({ token: token });
        if (!tokenExists || tokenExists.isRevoked) throw new UnauthorizedException('Invalid refresh token');

        const dbToken = await this.tokenService.revokeRefreshToken(token);
        if (!dbToken) throw new UnauthorizedException('Invalid refresh token');
        return 'Logged out successfully';
    }

    public async refreshToken(token: string) {
        let payload: User;
        try {
            payload = this.tokenService.verifyToken(token, 'refresh');
        } catch (err) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        const dbToken = await this.tokenRepo.getOne({ token: token });
        if (!dbToken || dbToken.isRevoked) throw new UnauthorizedException('Refresh token revoked');
        const accessToken = this.tokenService.generateAccessToken({ _id: payload._id });
        return { accessToken };
    }

    async googleLogin(idToken: string): Promise<{ accessToken: string, refreshToken: string }> {

        try {
            // const clientIds = this.configService.get<string>('GOOGLE_CLIENT_ID').split(',');
            const ticket = await this.googleClient.verifyIdToken({
                idToken,
            });

            const payload = ticket.getPayload();
            if (!payload) {
                throw new UnauthorizedException('Invalid Google token payload');
            }

            const { email, given_name, family_name, email_verified } = payload;

            if (!email_verified) {
                throw new UnauthorizedException('Google email not verified');
            }

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
                return this.generateTokens({ id: user._id, payload: { _id: user._id } });
            }
            return this.generateTokens({ id: user._id, payload: { _id: user._id } });
        } catch (error) {
            throw new UnauthorizedException(`Invalid or expired Google token ${error.message}`);
        }
    }
    //reset password 
    public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
        const customerExist = await this.checkUser(resetPasswordDto.email);

        if (!await compereHash(resetPasswordDto.otp, customerExist.otp)) throw new UnauthorizedException("Invalid OTP");

        if (customerExist.otpExpiry! < new Date()) throw new UnauthorizedException("OTP expired,pls resend otp");

        const hashedPassword = await generatedHash(resetPasswordDto.newPassword);
        await this.userRepository.updateOne(
            { _id: customerExist._id },
            { $set: { password: hashedPassword, changeCredentialsTime: Date.now() }, $unset: { otp: 1, otpExpiry: 1 } });
        return "Password reset successfully";
    }

}
