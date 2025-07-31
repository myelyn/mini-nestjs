import { 
  Controller, 
  Get, Post, Redirect, HttpCode, Header,
  Request, Req, Query, Headers, Session, Ip, Param, Body,
  Response, Res
} from "@nestjs/common";

import { UrlDecorator } from '../url.decorator'

@Controller('user')
export class UserController {
  @Get('info')
  getUserInfo() {
    return 'getuserinfo'
  }
  @Get('test/:id')
  handleRequest(@Request() request, @Req() req, @Query('id') query, @Headers() headers, @Session() session, @Ip() ip, @Param('id') param) {
    console.log(param)
    return 'handle request'
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