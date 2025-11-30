import slugify from "slugify";
import { CreateProductDto } from "../dto/create-product.dto";
import { Product } from "../entities/product.entity";
import { User } from "src/DB/model/index";
import { Types } from "mongoose";
import { UpdateProductDto } from "../dto/update-product.dto";
import { DiscountType } from "@common/utils";

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
        product.discountAmount = createProductDto.discountAmount;
        product.discountType = createProductDto.discountType;
        product.stock = createProductDto.stock;
        product.sold = 0;

        product.colors = createProductDto.colors;
        product.sizes = createProductDto.sizes;

        return product;

    }
    public updateProduct(updateProductDto: UpdateProductDto, productExist: Product, user: User) {
        const product = new Product();
        product.name = updateProductDto.name as string ?? productExist.name;
        product.slug = slugify(product.name, { replacement: '_', trim: true, lower: true });
        product.description = updateProductDto.description as string ?? productExist.description;

        product.categoryId = new Types.ObjectId(updateProductDto.categoryId) ?? productExist.categoryId;
        product.BrandId = new Types.ObjectId(updateProductDto.BrandId) ?? productExist.BrandId;
        product.updatedBy = user._id;

        product.price = updateProductDto.price as number ?? productExist.price;
        product.discountAmount = updateProductDto.discountAmount as number ?? productExist.discountAmount;
        product.discountType = updateProductDto.discountType as DiscountType ?? productExist.discountAmount;
        product.stock = updateProductDto.stock as number ?? productExist.stock;

        product.colors = updateProductDto.colors as string[] ?? productExist.colors;
        product.sizes = updateProductDto.sizes as string[] ?? productExist.sizes;

        return product;
    }
}