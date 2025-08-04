import { Module } from "@nestjs/common"
import { TestService } from "./user/test.service";

@Module({
  providers: [
    {
      provide: TestService,
      useClass: TestService
    },
    {
      provide: 'testServiceToken',
      useValue: new TestService('value1')
    }
  ],
  exports: [TestService, 'testServiceToken']
})
export class TestModule{}