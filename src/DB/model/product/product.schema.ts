import { DiscountType } from "@common/utils/enum/index";
import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument, model, SchemaTypes, Types } from "mongoose";



@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Product {
    readonly _id: Types.ObjectId;
    @Prop({ type: String, required: true, trim: true })
    name: string;
    @Prop({ type: String, required: true, trim: true })
    slug: string;
    @Prop({ type: String, required: true, trim: true })
    description: string;
    // ==================
    @Prop({ type: SchemaTypes.ObjectId, ref: "Category", required: true })
    categoryId: Types.ObjectId
    @Prop({ type: SchemaTypes.ObjectId, ref: "Brand", required: true })
    BrandId: Types.ObjectId
    @Prop({ type: SchemaTypes.ObjectId, ref: "User", required: true })
    createdBy: Types.ObjectId
    @Prop({ type: SchemaTypes.ObjectId, ref: "User", required: true })
    updatedBy: Types.ObjectId
    //=================
    @Prop({ type: Number, required: true, min: 1 })
    price: number;
    @Virtual({
        get: function (this: Product) {
            if (this.discountType == DiscountType.fixed_amount)
                return this.price - this.discountAmount;
            return this.price - (this.price * this.discountAmount) / 100;
        }
    })
    finalPrice: number;//*virtual field
    @Prop({ type: Number, default: 0, min: 0 })

    discountAmount: number;
    @Prop({ type: String, enum: DiscountType, default: DiscountType.fixed_amount })
    discountType: DiscountType;
    @Prop({ type: Number, default: 1, min: 0 })//defealt create 1 ,why min :0 >> for buy 1? 0
    stock: number;
    @Prop({ type: Number, min: 0 })
    sold: number;
    //=========
    @Prop({ type: [String] })
    colors: string[];
    @Prop({ type: [String] })
    sizes: string[];
    //===========
    @Prop({ type: Date })
    deletedAt: Date;
    @Prop({ type: Types.ObjectId, ref: 'User' })
    deletedBy: Types.ObjectId;
}

export const productSchema = SchemaFactory.createForClass(Product);
productSchema.index({ "deletedAt": 1 }, { expireAfterSeconds: 5 * 60 });

//module
export const productModule = MongooseModule.forFeature(
    [
        { name: Product.name, schema: productSchema },
    ]
);