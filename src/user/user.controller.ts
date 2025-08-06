import { 
  Controller, 
  Get, Post, Redirect, HttpCode, Header,
  Request, Req, Query, Headers, Session, Ip, Param, Body,
  Response, Res,
  Inject
} from "@nestjs/common";

import { UrlDecorator } from '../url.decorator'
import { UserService } from "./user.service";
import { LoggerService } from "../common/services/logger.service";

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly loggerService: LoggerService
  ) {}
  @Get('getuser')
  getUser() {
    this.loggerService.log('Getting user...')
    return this.userService?.getUser()
  }
  @Post('create')
  createUser(@Body() createUserDto, @Body('username') username, @Response({passthrough: true}) response, @Res() res) {
    console.log(createUserDto)
    console.log(response === res)
    // res.send('Custom response')
    return 'passthrough'
  }
  // 重定向
  @Get('redirect')
  @Redirect('info', 301)
  testRedirect() {
    return 'redirect'
  }
  // 响应码、响应头
  @Get('setcode')
  @HttpCode(201)
  @Header('Cache-Control', 'none')
  @Header('Set-Cookie', 'test-token')
  testCode() {
    return 'setcode 201'
  }
  // 自定义参数装饰器
  @Get('custom')
  customDecorator(@UrlDecorator('url') url: any) {
    console.log(url)
    return 'custom decorator'
  }
}