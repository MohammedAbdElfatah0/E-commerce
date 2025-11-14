import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Seller, sellerSchema, User, userSchema, Customer, customerSchema, SellerRepository, CustomerRepository } from "src/model";

import { UserRepository } from './../../model/common/user.repository';
@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: userSchema,
                discriminators: [
                    { name: Seller.name, schema: sellerSchema },
                    { name: Customer.name, schema: customerSchema }
                    // {name:Admin.name,schema:adminSchema},
                ]
            }
        ])
    ],
    providers: [SellerRepository, CustomerRepository, UserRepository],
    controllers: [],
    exports: [SellerRepository, CustomerRepository, UserRepository],
})
export class UserMongoModule { }