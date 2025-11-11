import { Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, discriminatorKey: "role", toJSON: { virtuals: true } })
export class Customer {

    name: string

    email: string

    password: string


    
}
//
export const customerSchema = SchemaFactory.createForClass(Customer); 