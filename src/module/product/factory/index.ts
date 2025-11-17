import slugify from "slugify";
import { CreateProductDto } from "../dto/create-product.dto";
import { Product } from "../entities/product.entity";
import { User } from "@model/index";
import { Types } from "mongoose";

export class ProdcutFactoryService {
    public createProduct(createProductDto: CreateProductDto, user: User) {
        const product = new Product();
        product.name = createProductDto.name;
        product.slug = slugify(product.name, { replacement: '_', trim: true, lower: true });
        product.description = createProductDto.description;

        product.categoryId = new Types.ObjectId(createProductDto.categoryId);
        product.BrandId = new Types.ObjectId(createProductDto.BrandId);
        product.createdBy = user._id;
        product.updatedBy = user._id;

        product.price = createProductDto.price;
        product.discountAmount=createProductDto.discountAmount;
        product.discountType=createProductDto.discountType;
        product.stock=createProductDto.stock;
        product.sold=0;

        product.colors=createProductDto.colors;
        product.sizes=createProductDto.sizes;

        return product;

    }
}