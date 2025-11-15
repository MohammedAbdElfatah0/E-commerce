import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "../abstract.repository";
import { Product } from "./product.schema";
@Injectable()
export class ProductRepository extends AbstractRepository<Product> {
    constructor(
        @InjectModel(Product.name) product: Model<Product>
    ) {
        super(product);
    }
}