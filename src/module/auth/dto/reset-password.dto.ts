import { IsNotEmpty, IsString } from "class-validator";
import { ConfirmEmailDto } from "./confrim.email-auth.dto";

export class ResetPasswordDto extends ConfirmEmailDto {

    @IsNotEmpty({ message: "It's required" })
    @IsString({ message: "it's must be string " })
    newPassword: string;
}