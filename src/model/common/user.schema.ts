//create schema of user and include sub schema

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

@Schema({ timestamps: true, discriminatorKey: "role", toJSON: { virtuals: true } })
export class User {
    @Prop({ type: String, required: true })
    name: string
    @Prop({ type: String, required: true, unique: true, })
    email: string
    @Prop({ type: String, required: true })
    password: string
}
//
export const userSchema = SchemaFactory.createForClass(User);