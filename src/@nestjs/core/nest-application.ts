import express, { Express, Request as ExpressRequest, Response as ExpressResponse, NextFunction} from 'express'
import 'reflect-metadata'
import path from 'path'
import { Logger } from '@nestjs/core'
import { DESIGN_PARAMETERS, INJECTED_TOKENS } from '@nestjs/common/constants';
export class NestApplication {
  private readonly app:Express = express()
  private readonly module: any
  // 隔离模块的提供者
  private readonly providerInstances = new Map()
  private readonly globalProviderTokens = new Set()
  private readonly moduleProviderTokens = new Map()
  constructor(module: any) {
    this.module = module
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: true}))
    this.initProviders()
    this.initControllersRecursively(this.module)
  }
  use(middleware: (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => void) {
    this.app.use(middleware)
  }

  private initControllersRecursively(module) {
    this.initControllers(module)
    const imports = (Reflect.getMetadata('imports', module)) ?? []
    for(const importedModule of imports) {
      this.initControllersRecursively(importedModule)
    }
  }

  private initControllers(moduleClass) {
    const controllers = (Reflect.getMetadata('controllers', moduleClass)) || []
    for(const Controller of controllers) {
      // 拿到构造函数参数类型
      const dependencies = this.resolveDependencies(Controller)
      // 获取控制器类的元数据，拿到前缀
      const prefix = Reflect.getMetadata('prefix', Controller)
      const controller = new Controller(...dependencies)
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
  private isModule (token) {
    return token && token instanceof Function && Reflect.getMetadata('isModule', token)
  }
  private initProviders() {
    // 注册导入的模块的提供者
    const imports = (Reflect.getMetadata('imports', this.module)) ?? []
    for(const importedModule of imports) {
      this.registModuleProviders(importedModule, this.module)
    }
    // 注册根模块的提供者
    const providers = (Reflect.getMetadata('providers', this.module)) || []
    for(const provider of providers) {
      this.addProvider(provider, this.module)
    }
    console.log('moduleProviderTokens',this.moduleProviderTokens)
    console.log('globalProviderTokens',this.globalProviderTokens)
  }
  private registModuleProviders(module, ...parentModules) {
    const isGlobal = Reflect.getMetadata('isGlobal', module)
    // 除了根模块，其他模块的提供者都来自exports
    const providers = Reflect.getMetadata('providers', module) ?? []
    const exports = (Reflect.getMetadata('exports', module)) ?? []
    for(const exportToken of exports) {
      if (this.isModule(exportToken)) {
        // 如果导出的是模块，则递归注册该模块的提供者
        this.registModuleProviders(exportToken, module, ...parentModules)
      } else {
        // 如果导出的是提供者，则注册该提供者
        const provider = providers.find(provider => provider === exportToken || provider.provide === exportToken)
        if (provider) {
          // 注册提供者到模块和父模块
          [module, ...parentModules].forEach(module => {
            this.addProvider(provider, module, isGlobal)
          })
        }
      }
    }
  }
  private addProvider(provider, module, isGlobal = false) {
    const providers = isGlobal ? this.globalProviderTokens : this.moduleProviderTokens.get(module) ?? new Set()
    if (!this.moduleProviderTokens.has(module)) {
      this.moduleProviderTokens.set(module, providers)
    }
    if (provider.provide && provider.useClass) {
      // 如果提供者是类（useClass），则创建实例
      const dependencies = this.resolveDependencies(provider.useClass)
      const classInstance = new provider.useClass(...dependencies)
      this.providerInstances.set(provider.provide, classInstance)
      providers.add(provider.provide)
    } else if (provider.provide && provider.useValue) {
      // 如果提供者是值，则直接设置
      this.providerInstances.set(provider.provide, provider.useValue)
      providers.add(provider.provide)
    } else if (provider.provide && provider.useFactory) {
      // 如果提供者是工厂函数，则调用工厂函数获取值
      const inject = provider.inject??[]
      const injectedValues = inject.map((injectedToken) => this.getProviderByToken(injectedToken, module))
      const value = provider.useFactory(...injectedValues)
      this.providerInstances.set(provider.provide, value)
      providers.add(provider.provide)
    }else {
      // 如果提供者是类，则创建实例
      const dependencies = this.resolveDependencies(provider)
      this.providerInstances.set(provider, new provider(...dependencies))
      providers.add(provider)
    } 
  }
  private getProviderByToken (token, module) {
    if (this.providerInstances.has(token)) {
      return this.providerInstances.get(token)
    } else if (this.moduleProviderTokens.get(module)?.has(token)) {
      return this.providerInstances.get(token)
    }
  }
  private getResponseMetadata (instance: any, methodName: string): any {
    const paramMetadata = Reflect.getMetadata('params', instance, methodName) ?? []
    return paramMetadata.find(param => ['Response', 'Res'].includes(param.key))
  }
  private resolveDependencies(target: any) {
    const injectedTokens = Reflect.getMetadata(INJECTED_TOKENS, target) ?? []
    const designParams = Reflect.getMetadata(DESIGN_PARAMETERS, target) ?? []
    return designParams.map((param, index) => {
      const token = injectedTokens[index] ?? param
      const module = Reflect.getMetadata('module', target)
      return this.getProviderByToken(token, module)
    })
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
    this.app.listen(port, () => {
      Logger.log(`Application is running on: http://localhost:${port}`, 'NestApplication');
    })
  }
}
