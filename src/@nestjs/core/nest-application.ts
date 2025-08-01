import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction} from 'express'
import 'reflect-metadata'
import path from 'path'
import { Logger } from '@nestjs/core'
export class NestApplication {
  private readonly app:Express = express()
  private readonly module: any
  constructor(module: any) {
    this.module = module
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: true}))
  }
  use(middleware: (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => void) {
    this.app.use(middleware)
  }
  init() {
    // 获取通过装饰器传入的控制器元数据
    const controllers = (Reflect.getMetadata('controllers', this.module)) || []
    for(const Controller of controllers) {
      // 获取控制器类的元数据，拿到前缀
      const prefix = Reflect.getMetadata('prefix', Controller)
      const controller = new Controller()
      const controllerPrototype = Reflect.getPrototypeOf(controller)
      // 通过控制器实例拿到控制器原型对象上的所有实例方法的名称
      for(const methodName of Object.getOwnPropertyNames(controllerPrototype)) {
        // 从类的原型获取到该名称对应的方法，并读取元数据，拿到请求方法和请求路径
        const prototypeMethod = controllerPrototype[methodName]
        if (prototypeMethod) {
          const methodMetadata = Reflect.getMetadata('method', prototypeMethod)
          const pathMetadata =  Reflect.getMetadata('path', prototypeMethod)
          const redirectUrl = Reflect.getMetadata('redirectUrl', prototypeMethod)
          const redirectStatusCode =  Reflect.getMetadata('redirectStatusCode', prototypeMethod)
          const httpCode =  Reflect.getMetadata('statusCode', prototypeMethod)
          const headers = Reflect.getMetadata('headers', prototypeMethod)
          // 过滤掉没有加请求方法装饰器的方法
          if (methodMetadata) {
            const routePath = path.posix.join('/', prefix, pathMetadata)
            // 注册路由
            console.log('注册路由:', methodMetadata, routePath)
            this.app[methodMetadata.toLowerCase()](routePath, async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
              const args = this.resolveParams(controller, methodName, req, res, next)
              const result = await prototypeMethod.call(controller, ...args)
              if (redirectUrl) {
                res.redirect(redirectStatusCode, redirectUrl)
                return
              }
              if (httpCode) {
                res.status(httpCode)
              }
              headers?.forEach(header => {
                res.setHeader(header.name, header.value)
              });
              // 如果不存在Response或者Res装饰器，或者传了passthrough参数，则直接响应。否则交给用户手动处理响应。
              const responseMeta = this.getResponseMetadata(controller, methodName)
              if (!responseMeta || responseMeta.data?.passthrough) return res.send(result)
            })
          }
        }
      }
    }
  }
  private getResponseMetadata (instance: any, methodName: string): any {
    const paramMetadata = Reflect.getMetadata('params', instance, methodName) ?? []
    return paramMetadata.find(param => ['Response', 'Res'].includes(param.key))
  }
  private resolveParams (instance: any, methodName: string, req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
    const paramMetadata = Reflect.getMetadata('params', instance, methodName) ?? []
    const ctx = {
      switchToHttp: () => ({
        getRequest: () => req,
        getReponse: () => res,
        getNext: () => next
      })
    }
    return paramMetadata.map((item: any) => {
      const { key, data } = item
      switch(key) {
        case 'Request':
        case 'Req':
          return req
        case 'Query':
          return data ? req.query[data] : req.query
        case 'Headers':
          return data ? req.headers[data] : req.headers
        case 'Session':
          return req.session
        case 'Ip':
          return req.ip
        case 'Param':
          return data ? req.params[data] : req.params
        case 'Body':
          return data ? req.body[data] : req.body
        case 'Response':
        case 'Res':
          return res
        case 'DecoratorFactory':
          return item.factory(data, ctx)
        default:
          return null
      }
    })
  }
  listen(port: number) {
    this.init()
    this.app.listen(port, () => {
      Logger.log(`Application is running on: http://localhost:${port}`, 'NestApplication');
    })
  }
}