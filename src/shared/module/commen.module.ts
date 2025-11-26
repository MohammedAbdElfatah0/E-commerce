import { TokenService } from "@common/utils/token/token.service";
import { tokenModel, TokenRepository } from "@model/index";
import { Global, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Global()
@Module({
    imports:[tokenModel],
    providers: [JwtService,TokenService, TokenRepository],
    exports: [JwtService,TokenService, TokenRepository],
})
export class CommenModule {

}