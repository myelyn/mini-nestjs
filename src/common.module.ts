import { Module } from "@nestjs/common"
import { TestModule } from "./test.module"
import { UserModule } from "./user/user.module"
@Module({
  imports: [TestModule, UserModule],
  exports: [TestModule, UserModule]
})
export class CommonModule {}

