import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction} from 'express'
import 'reflect-metadata'
export class NestApplication {
  private readonly app:Express = express()
  private readonly module: any
  constructor(module: any) {
    this.module = module
  }
  init() {
    const controllers = (Reflect.getMetadata('controllers', this.module))
    for(const controller of controllers) {
      for (const method of Object.getOwnPropertyNames(controller.prototype)) {
        console.log(method)
      }
    }
  }
  listen(port: number) {
    this.init()
    this.app.listen(port, () => {
      console.log(`Application is running on: http://localhost:${port}`, 'NestApplication');
    })
  }
}