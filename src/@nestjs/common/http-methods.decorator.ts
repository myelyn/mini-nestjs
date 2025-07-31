export function Get(path: string = ''): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata('path', path, descriptor.value)
    Reflect.defineMetadata('method', 'GET', descriptor.value)
  }
}

export function Post(path: string = ''): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata('path', path, descriptor.value)
    Reflect.defineMetadata('method', 'POST', descriptor.value)
  }
}

export function Redirect(url: string = '/', statusCode: number = 302): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata('redirectUrl', url, descriptor.value)
    Reflect.defineMetadata('redirectStatusCode', statusCode, descriptor.value)
  }
}

export function HttpCode(statusCode: number): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata('statusCode', statusCode, descriptor.value)
  }
}

export function Header(name: string, value: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const existingHeaders = Reflect.getMetadata('headers', descriptor.value) ?? []
    existingHeaders.push({ name, value })
    Reflect.defineMetadata('headers', existingHeaders, descriptor.value)
  }
}