import { Controller, Get } from '@nestjs/common'

@Controller('')
export class AppController{
  @Get()
  index(): string {
    return 'hello'
  }
  @Get('list')
  list(): string {
    return 'list'
  }
}