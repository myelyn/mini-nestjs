import { createParamDecorator } from '@nestjs/common/param.decorator'

export const UrlDecorator = (options) => createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest()
  return request[data]
})(options)