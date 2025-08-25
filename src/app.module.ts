import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { CommonModule } from './common/common.module'
import { UserModule } from './user/user.module'
import { AppController } from './app.controller'
import { LoggerMiddleware } from './logger.middleware'
import { GlobalFilter } from './global.filter'
@Module({
  imports: [CommonModule, UserModule],
  controllers: [AppController],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: GlobalFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '/user', method: RequestMethod.ALL })
  }
}
