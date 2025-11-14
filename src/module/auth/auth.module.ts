import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserMongoModule } from 'src/shared';
import { AuthFactoryService } from './factory';
import { EmailService } from '@model/email/email.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserMongoModule],
  controllers: [AuthController],
  providers: [AuthService, AuthFactoryService, EmailService, JwtService],
})
export class AuthModule { }
