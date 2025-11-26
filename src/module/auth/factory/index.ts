import { expiredOtp, generateOtp, generatedHash } from '@common/index';
import { Injectable } from '@nestjs/common';
import { Customer } from '../entities/auth.entity';
import { RegisterDto } from './../dto';
@Injectable()
export class AuthFactoryService {


    public async createCustomer(registerDto: RegisterDto) {
        const customer = new Customer();

        customer.firstName = registerDto.firstName;
        customer.lastName = registerDto.lastName;
        customer.email = registerDto.email;
        customer.password = await generatedHash(registerDto.password);
        customer.otp = generateOtp().toString();
        customer.otpExpiry = expiredOtp(5);
        customer.isVerified = false;
        customer.dob = registerDto.dob;
        customer.role = registerDto.role || 'Customer'//todo const enum

        return customer;
    }
}