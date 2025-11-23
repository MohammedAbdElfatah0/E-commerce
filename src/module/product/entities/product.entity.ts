import { DiscountType } from "@common/utils/enum";
import { Types } from "mongoose";

export class Product {
    readonly _id;
    name: string;
    slug: string;
    description: string;
    // ==================
    categoryId: Types.ObjectId
    BrandId: Types.ObjectId
    createdBy: Types.ObjectId
    updatedBy: Types.ObjectId
    //=================
    price: number;
    finalPrice: number;//*virtual field
    discountAmount: number;
    discountType: DiscountType;
    stock: number;
    sold: number;
    //=========

    colors: string[];
    sizes: string[];
}
