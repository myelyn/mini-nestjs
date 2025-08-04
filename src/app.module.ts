import { Module } from "@nestjs/common"
import { AppController } from './app.controller'
import { CommonModule } from "./common.module"
@Module({
  controllers: [AppController],
  imports: [CommonModule]
})
export class AppModule {}

