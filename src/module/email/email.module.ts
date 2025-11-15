import { forwardRef, Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { AuthModule } from "@module/auth/auth.module";

@Module({
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule { }