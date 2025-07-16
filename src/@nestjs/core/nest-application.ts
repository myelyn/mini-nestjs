import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction} from 'express'
import 'reflect-metadata'
import path from 'path'
import { Logger } from '@nestjs/core'
export class NestApplication {
  private readonly app:Express = express()
  private readonly module: any
  constructor(module: any) {
    this.module = module
  }
  init() {
    // 获取通过装饰器传入的控制器元数据
    const controllers = (Reflect.getMetadata('controllers', this.module)) || []
    for(const Controller of controllers) {
      // 获取控制器类的元数据，拿到前缀
      const prefix = Reflect.getMetadata('prefix', Controller)
      const controller = new Controller()
      const controllerPrototype = Reflect.getPrototypeOf(controller)
      // 通过控制器实例拿到控制器原型对象上的所有方法的名称
      for(const methodName of Object.getOwnPropertyNames(controllerPrototype)) {
        // 从类的原型获取到该名称对应的方法，并读取元数据，拿到请求方法和请求路径
        const prototypeMethod = controllerPrototype[methodName]
        if (prototypeMethod) {
          const methodMetadata = Reflect.getMetadata('method', prototypeMethod)
          const pathMetadata =  Reflect.getMetadata('path', prototypeMethod)
          // 过滤掉没有加请求方法装饰器的方法
          if (methodMetadata) {
            const routePath = path.posix.join('/', prefix, pathMetadata)
            this.app[methodMetadata.toLowerCase()](routePath, async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
              const result = await prototypeMethod.call(controller)
              res.send(result)
            })
          }
        }
      }
    }
  }
  listen(port: number) {
    this.init()
    this.app.listen(port, () => {
      Logger.log(`Application is running on: http://localhost:${port}`, 'NestApplication');
    })
  }
}