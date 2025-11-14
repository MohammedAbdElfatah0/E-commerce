import { hashPassword } from '@common/helper/hash.helper';
import { Customer } from '../entities/auth.entity';
import { RegisterDto } from './../dto/register-auth.dto';
import { expiredOtp, generateOtp } from '@common/helper';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AuthFactoryService {


    public async createCustomer(registerDto: RegisterDto) {
        const customer = new Customer();

        customer.userName = registerDto.userName;
        customer.email = registerDto.email;
        customer.password = await hashPassword(registerDto.password);
        customer.otp = generateOtp().toString();
        customer.otpExpiry = expiredOtp(10);
        customer.isVerified = false;
        customer.dob = registerDto.dob;
        customer.role = registerDto.role || 'Customer'//todo const enum

        return customer;
    }
}