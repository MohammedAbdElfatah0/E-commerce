
import { Product } from "@model/product/product.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({ timestamps: true })
export class Brand {
    readonly _id: Types.ObjectId;
    @Prop({ type: String, required: true, unique: true, trim: true })
    name: string;
    @Prop({ type: String, required: true, unique: true, trim: true })
    slug: string;
    @Prop({ type: SchemaTypes.ObjectId, ref: 'Admin', required: true })
    createdBy: Types.ObjectId;
    @Prop({ type: SchemaTypes.ObjectId, ref: 'Admin', required: true })
    updatedBy: Types.ObjectId;
    @Prop({ type: Date })
    deletedAt: Date;
    @Prop({ type: Types.ObjectId, ref: 'Admin' })
    deletedBy: Types.ObjectId;

    logo: Object;//interceptor
}

export const brandSchema = SchemaFactory.createForClass(Brand);
brandSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });
///delete soft == findoneandupdate
//before it delete any product 
// brandSchema.pre("findOneAndUpdate", async function (next) {
//     try {
//         const query = this.getQuery();         // اللي بنعمله update brand id
//         const update = (this.getUpdate() || {}) as any;      // التحديثات اللي هتحصل
//         const brandId = query._id;
//         console.log({ query, update, brandId })
//         if (update.deletedAt || update.$set?.deletedAt) {
//             await ProductModel.deleteMany({ BrandId: brandId });
//             console.log("تم حذف كل المنتجات الخاصة بالبراند:", brandId);
//         }
//         next();

//     } catch (err) {
//         next(err);
//     }
// });
// brand.schema.ts

// d:/Node.js/project/e-commerce/src/DB/model/brand/brand.schema.ts
// import { ProductModel } from "@model/product/product.schema";  // REMOVE this line

brandSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate() as any;
        const query = this.getQuery();

        if (!update.deletedAt && !update.$set?.deletedAt) {
            return next();
        }

        const brandId = query._id;
        if (!brandId) return next();
        const productModel = (this as any).model.db.model(Product.name); // same connection via current query's connection
        const brandObjectId = brandId instanceof Types.ObjectId ? brandId : new Types.ObjectId(brandId);
        await productModel.deleteMany({
            $or: [
                { BrandId: brandObjectId },
                { BrandId: brandObjectId.toString() as any }
            ]
        });

        next();
    } catch (error) {
        next(error);
    }
});