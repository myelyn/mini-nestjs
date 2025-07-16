import 'reflect-metadata'
export function Controller (prefix?) {
  return function(constructor) {
    Reflect.defineMetadata('prefix', prefix, constructor)
  }
}