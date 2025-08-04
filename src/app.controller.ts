import { Controller, Get, Inject } from "@nestjs/common";
import { TestService } from "./user/test.service";
import { UserService } from "./user/user.service";
@Controller('')
export class AppController{
  constructor(
    private readonly testService: TestService,
    @Inject('testServiceToken') private readonly testServiceToken: TestService,
    private readonly userService: UserService
  ){}
  @Get('test')
  testHandler() {
    return this.testService.getTestValue()
  }
  @Get('testtoken')
  testTokenHandler() {
    return this.testServiceToken.getInjectValue()
  }
  @Get('getuser')
  userHandler() {
    return this.userService.getUser()
  }
}