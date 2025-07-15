import 'reflect-metadata'

interface MetaData {
  controllers?: Function[]
}
export function Module(metadata: MetaData) {
  return (constructor: Function) => {
    Reflect.defineMetadata('controllers', metadata.controllers, constructor)
  }
}