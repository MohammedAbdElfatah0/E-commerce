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
    logo: Object;//interceptor
}

export const brandSchema = SchemaFactory.createForClass(Brand);