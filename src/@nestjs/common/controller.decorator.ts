import 'reflect-metadata'
export function Controller (prefix: string = '') {
  return function(constructor) {
    Reflect.defineMetadata('prefix', prefix, constructor)
  }
}