import { Controller, Get } from "@nestjs/common"
import { LoggerService } from "./common/services/logger.service"
@Controller()
export class AppController {
  constructor(private readonly loggerService: LoggerService) {}
  @Get()
  getHello(): string {
    this.loggerService.log('Getting hello...')
    return 'Hello World'
  }
}