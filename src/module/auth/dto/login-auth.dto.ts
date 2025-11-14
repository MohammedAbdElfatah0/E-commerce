import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty({ message: "It's required" })
    email: string;
    @IsString({ message: "it's must be string " })
    @IsNotEmpty({ message: "It's required" })
    password: string;
}