import { EmailModule } from '@module/index';
import { Module } from '@nestjs/common';
import { UserMongoModule } from '@shared/index';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthFactoryService } from './factory';

@Module({
  imports: [UserMongoModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, AuthFactoryService, ],
})
export class AuthModule { }
