
import { PUBLIC } from '@common/decorator';
import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@model/index';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly JwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly UserRepository: UserRepository,
        private readonly reflector: Reflector
    ) { }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        //public service
        const Public = this.reflector.get(PUBLIC, context.getHandler);
        if (Public) return true;


        //user token
        const { authorization } = request.headers;
        if (!authorization) throw new BadRequestException("authorization is required")
        const payload = this.JwtService.verify<{ _id: string, role: string, email: string }>(authorization, { secret: this.configService.get("token").access })
        //check user exist:
        const userExist =await this.UserRepository.getOne({ _id: payload._id });
        if (!userExist) throw new UnauthorizedException("user not found");
        request.user = userExist;
        //todo:: refresh


        return true;
    }
}
