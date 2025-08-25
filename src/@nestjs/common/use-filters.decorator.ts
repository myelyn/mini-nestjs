import { ExceptionFilter } from './exception-filter.interface'

export function UseFilters(...filters: ExceptionFilter[]): ClassDecorator & MethodDecorator {
  return (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    if (propertyKey) {
      Reflect.defineMetadata('filters', filters, descriptor.value)
    } else {
      Reflect.defineMetadata('filters', filters, target)
    }
  }
}
