import { Exclude } from 'class-transformer';
export class RegisterResponse {
    userName: string;
    firstName: string
    lastName: string;
    email: string
    dob: Date;
    gender: string;

    @Exclude()
    password: string
    @Exclude()
    otp: string
    @Exclude()
    otpExpiry: Date
    @Exclude()
    __v: number;
    @Exclude()
    createdAt: Date;
    @Exclude()
    updatedAt: Date;
    @Exclude()
    isVerified: boolean;
    @Exclude()
    _id: string;
    @Exclude()
    confirmEmail: Date;
    @Exclude()
    provider: string;
    @Exclude()
    role: string;
}