import { EmailService } from '@module/index';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserMongoModule } from '@shared/index';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthFactoryService } from './factory';

@Module({
  imports: [UserMongoModule],
  controllers: [AuthController],
  providers: [AuthService, AuthFactoryService, EmailService, JwtService],
})
export class AuthModule { }
