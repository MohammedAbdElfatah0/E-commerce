import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenRepository, User } from '@model/index';
import { Types } from 'mongoose';


@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService,
        private readonly tokenRepo: TokenRepository,
    ) { }

    // ---------------------------
    // Generate Access Token (No DB)
    // ---------------------------
    generateAccessToken(payload: Partial<User>) {
        return this.jwtService.sign(payload, {
            secret: this.config.get('token').access,
            expiresIn: '15m',
        });
    }

    // ---------------------------
    // Generate Refresh Token + Save to DB
    // ---------------------------
    async generateRefreshToken(userId: Types.ObjectId, payload: Partial<User>) {
        const token = this.jwtService.sign(payload, {
            secret: this.config.get('token').refresh,
            expiresIn: '7d',
        });

        await this.tokenRepo.create({
            userId,
            token,
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return token;
    }

    // ---------------------------
    // Verify Any Token
    // ---------------------------
    verifyToken(token: string, type: 'access' | 'refresh') {
        const secret =
            type === 'access'
                ? this.config.get('token').access
                : this.config.get('token').refresh;

        return this.jwtService.verify(token, { secret });
    }

    // ---------------------------
    // Decode Without Verify
    // ---------------------------
    decode(token: string) {
        return this.jwtService.decode(token);
    }

    // ---------------------------
    // Revoke refresh token
    // ---------------------------
    async revokeRefreshToken(token: string) {
        await this.tokenRepo.revoke(token);
        return true;
    }
}
