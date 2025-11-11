import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "../abstract.repository";
import { Seller } from "./seller.schema";
@Injectable()
export class SellerRepository extends AbstractRepository<Seller> {
    constructor(
        @InjectModel(Seller.name) seller: Model<Seller>
    ) {
        super(seller);
    }
}