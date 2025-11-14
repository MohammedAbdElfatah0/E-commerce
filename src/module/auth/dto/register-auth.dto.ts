import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Min, MinLength } from "class-validator";


export class RegisterDto {

    @IsString({ message: "it's must be string " })
    @IsNotEmpty({ message: "It's required" })
    @MinLength(3, { message: "min character is 3", })
    userName: string;

    @IsEmail()
    @IsNotEmpty({ message: "It's required" })
    email: string;

    @IsString({ message: "it's must be string " })
    @IsNotEmpty({ message: "It's required" })
    password: string;

    @Type(() => Date)
    @IsDate({ message: "It's Date type" })
    @IsNotEmpty({ message: "It's required" })
    dob: Date;
    
    @IsEnum(['Admin', 'Seller', 'Customer'])
    @IsOptional()
    role: string
}

