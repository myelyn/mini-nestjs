import { Module } from "@nestjs/common"
import { CommonModule } from "./common/common.module"
import { UserModule } from "./user/user.module"
import { AppController } from "./app.controller"
@Module({
  imports: [CommonModule, UserModule],
  controllers: [AppController]
})
export class AppModule {}

