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
    Reflect.defineMetadata('providers', metadata.providers, target)
    Reflect.defineMetadata('imports', metadata.imports, target)
    Reflect.defineMetadata('exports', metadata.exports, target)
  }
}