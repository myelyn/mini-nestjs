import { Controller, Get } from '@nestjs/common'

@Controller('home')
export class AppController{
  @Get()
  index(): string {
    console.log(this)
    return 'hello'
  }
  @Get('list')
  list(): string {
    return 'list'
  }
}