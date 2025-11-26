//create schema of user and include sub schema

import { userGender, userProvider } from "@common/utils";
import { Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose"
import { Types, HydratedDocument } from "mongoose"

@Schema({ strictQuery: true, timestamps: true, discriminatorKey: "role", toJSON: { virtuals: true } })
export class User {
    readonly _id: Types.ObjectId;

    @Prop({ type: String, required: true })
    firstName: string;

    @Prop({ type: String, required: true })
    lastName: string;
    @Virtual({
        get: function (): string {
            return this.firstName + ' ' + this.lastName;
        },
        set: function (value: string) {
            const [firstName, lastName] = value.split(' ') || [];
            this.set({ firstName, lastName });

        },
    })
    userName: string;


    @Prop({ type: String, required: true, unique: true, })
    email: string;

    @Prop({ type: Date, required: false, })
    confirmEmail: Date;


    @Prop({ type: Date, required: false, default: Date.now })
    changeCredentialsTime: Date;

    @Prop({
        type: String,
        required: function (this: User) {
            return this.provider === userProvider.SYSTEM;
        }
    })
    password: string;

    @Prop({ type: String, enum: userProvider, default: userProvider.SYSTEM })
    provider: userProvider;

    @Prop({ type: String, enum: userGender, default: userGender.MALE })
    gender: userGender;

    @Prop({ type: String })
    otp: string;
    @Prop({ type: Date })
    otpExpiry: Date;
    @Prop({ type: Boolean, default: false })
    isVerified: boolean;
}
//
export const userSchema = SchemaFactory.createForClass(User);
export type UserModel = HydratedDocument<User>;
