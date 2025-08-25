import 'reflect-metadata'

export function Catch(...exceptions: any[]): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata('catch', exceptions, target)
  }
}
