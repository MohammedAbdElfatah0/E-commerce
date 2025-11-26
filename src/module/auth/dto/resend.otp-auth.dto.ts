import { IsEmail, IsNotEmpty } from "class-validator";

export class ResendOtpDto {
       @IsEmail()
       @IsNotEmpty({ message: "It's required" })
       email: string;
}