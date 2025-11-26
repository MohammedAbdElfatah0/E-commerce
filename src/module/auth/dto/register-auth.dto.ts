import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Min, MinLength } from "class-validator";
import { LoginDto } from "./login-auth.dto";


export class RegisterDto extends LoginDto {
    //*include email and password 

    @IsString({ message: "it's must be string " })
    @IsNotEmpty({ message: "It's required" })
    @MinLength(3, { message: "min character is 3", })
    firstName: string;
    
    @IsString({ message: "it's must be string " })
    @IsNotEmpty({ message: "It's required" })
    @MinLength(3, { message: "min character is 3", })
    lastName: string;

    @Type(() => Date)
    @IsDate({ message: "It's Date type" })
    @IsNotEmpty({ message: "It's required" })
    dob: Date;
    
    @IsEnum(['Admin', 'Seller', 'Customer'])
    @IsOptional()
    role: string
}

