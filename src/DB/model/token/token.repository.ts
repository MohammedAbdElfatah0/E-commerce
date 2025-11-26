import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "../abstract.repository";
import { Token } from "./token.schema";
@Injectable()
export class TokenRepository extends AbstractRepository<Token> {
    constructor(
        @InjectModel(Token.name)private readonly token: Model<Token>,
    ) {
        super(token);
    }

     revoke(token: string) {
    return this.token.updateOne({ token }, { isRevoked: true });
  }
}
