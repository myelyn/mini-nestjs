import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

@Catch()
export class CustomFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    response.status(301).json({
      statusCode: 'Error001',
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    })
  }
}
