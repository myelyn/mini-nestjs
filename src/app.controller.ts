import { Controller, Get, UseFilters } from '@nestjs/common'
import { LoggerService } from './common/services/logger.service'
import { CustomFilter } from './custom-filter'
import { ForbiddenException } from '@nestjs/common'
@Controller()
export class AppController {
  constructor(private readonly loggerService: LoggerService) {}
  @Get()
  getHello(): string {
    this.loggerService.log('Getting hello...')
    return 'Hello World'
  }
  @Get('user')
  getUser(): string {
    throw new ForbiddenException('forbidden')
  }
  @Get('test-error')
  @UseFilters(new CustomFilter())
  getErrorr(): string {
    throw new ForbiddenException('forbidden')
  }
}
