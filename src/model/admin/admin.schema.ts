//create schema of user and include sub schema

import { Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, discriminatorKey: "role", toJSON: { virtuals: true } })
export class Admin {

    name: string

    email: string

    password: string
}
//
export const sellerSchema = SchemaFactory.createForClass(Admin);               