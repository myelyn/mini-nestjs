import { ArgumentsHost, ExceptionFilter } from '@nestjs/common'

export class GlobalFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    response.status(501).json({
      statusCode: 'ErrorXXX',
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    })
  }
}
