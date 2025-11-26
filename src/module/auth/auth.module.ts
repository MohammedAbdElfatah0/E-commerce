import { EmailModule } from '@module/index';
import { Module } from '@nestjs/common';
import { UserMongoModule } from '@shared/index';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthFactoryService } from './factory';
import { TokenService } from '@common/utils/token/token.service';
import { tokenModel, TokenRepository } from '@model/index';
import { OAuth2Client } from 'google-auth-library';

@Module({
  imports: [UserMongoModule, EmailModule, tokenModel],
  controllers: [AuthController],
  providers: [AuthService, AuthFactoryService, TokenService, TokenRepository, OAuth2Client],
})
export class AuthModule { }
