import { Product } from "@model/product/product.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({ timestamps: true })
export class Category {
    readonly _id: Types.ObjectId;
    @Prop({ type: String, required: true, unique: true, trim: true })
    name: string;
    @Prop({ type: String, required: true, unique: true, trim: true })
    slug: string;
    @Prop({ type: SchemaTypes.ObjectId, ref: "Admin", required: true })
    createdBy: Types.ObjectId;
    @Prop({ type: SchemaTypes.ObjectId, ref: "Admin", required: true })
    updatedBy: Types.ObjectId;
    @Prop({ type: Date })
    deletedAt: Date;
    @Prop({ type: Types.ObjectId, ref: 'Admin' })
    deletedBy: Types.ObjectId;

    logo: object;

}
export const categorySchema = SchemaFactory.createForClass(Category);
categorySchema.index({ deletedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

categorySchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate() as any;
        const query = this.getQuery();

        if (!update.deletedAt && !update.$set?.deletedAt) {
            return next();
        }

        const categoryId = query._id;
        if (!categoryId) return next();
        const productModel = (this as any).model.db.model(Product.name); // same connection via current query's connection
        const categoryIdObjectId = categoryId instanceof Types.ObjectId ? categoryId : new Types.ObjectId(categoryId as any);
        await productModel.deleteMany({
            $or: [
                { categoryId: categoryIdObjectId },
                { categoryId: categoryIdObjectId.toString() as any }
            ]
        });

        next();
    } catch (error) {
        next(error);
    }
});