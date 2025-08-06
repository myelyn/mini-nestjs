import 'reflect-metadata'

interface MetaData {
  controllers?: Function[]
  providers?: any[]
  imports?: any[]
  exports?: any[]
}
export function Module(metadata: MetaData) {
  return (target: Function) => {
    Reflect.defineMetadata('isModule', true, target)
    Reflect.defineMetadata('controllers', metadata.controllers, target)
    defineModule(target, metadata.controllers)
    Reflect.defineMetadata('providers', metadata.providers, target)
    defineModule(target, metadata.providers)
    Reflect.defineMetadata('imports', metadata.imports, target)
    Reflect.defineMetadata('exports', metadata.exports, target)
  }
}

export function defineModule(module: Function, targets=[]) {
  targets.forEach(target => {
    Reflect.defineMetadata('module', module, target)
  })
}

export function Global() {
  return (target: Function) => {
    Reflect.defineMetadata('isGlobal', true, target)
  }
}