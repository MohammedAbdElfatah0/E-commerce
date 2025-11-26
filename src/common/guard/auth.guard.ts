
import { PUBLIC } from '@common/decorator';
import { TokenService } from '@common/utils/token/token.service';
import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRepository } from 'src/DB/model/index';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly reflector: Reflector,
        private readonly tokenService: TokenService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // public
        const isPublic = this.reflector.get(PUBLIC, context.getHandler());
        if (isPublic) return true;

        // get token
        const { authorization }: { authorization: string } = request.headers;
        if (!authorization) {
            throw new BadRequestException("authorization is required");
        }

        const token = authorization.replace("Bearer ", "");

        let data;

        try {
            // verify ACCESS Token
            data = this.tokenService.verifyToken(token, 'access');

        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new UnauthorizedException("ACCESS_TOKEN_EXPIRED");
            }

            throw new UnauthorizedException("INVALID_ACCESS_TOKEN");
        }

        // verify user exists
        const user = await this.userRepo.getOne({ _id: data._id });
        if (!user) throw new UnauthorizedException("user not found");

        request.user = user;
        return true;
    }
}
