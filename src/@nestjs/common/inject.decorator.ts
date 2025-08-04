import 'reflect-metadata'
import { INJECTED_TOKENS } from './constants'
export const Inject = (token: string): ParameterDecorator => {
  // 修饰constructor的参数时，这个target是类本身
  return (target, propertyKey, paramIndex) => {
    const existingParams = Reflect.getMetadata(INJECTED_TOKENS, target) ?? []
    existingParams[paramIndex] = token
    Reflect.defineMetadata(INJECTED_TOKENS, existingParams, target)
  }
}