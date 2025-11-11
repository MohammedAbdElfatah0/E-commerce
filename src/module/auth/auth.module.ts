import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserMongoModule } from 'src/shared';

@Module({
  imports: [UserMongoModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
