import { IsNotEmpty, IsString, Length } from "class-validator";
import { ResendOtpDto } from "./resend.otp-auth.dto";

export class ConfirmEmailDto extends ResendOtpDto {
    //* includer email
    @IsString({ message: "it's must be string " })
    @IsNotEmpty({ message: "It's required" })
    @Length(5, 5, { message: "OTP must be 5 characters long" })
    otp: string;
}