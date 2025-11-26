import { IsNotEmpty, IsString } from "class-validator";
import { ResendOtpDto } from "./resend.otp-auth.dto";

export class LoginDto extends ResendOtpDto {
    //*include email 
    @IsString({ message: "it's must be string " })
    @IsNotEmpty({ message: "It's required" })
    password: string;
}