import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { ExceptionFilter } from './exception-filter.interface'

export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    console.log('GlobalHttpExceptionFilter', exception)
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const exceptionStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : 'Internal server error'

    if (typeof exceptionResponse === 'string') {
      response.status(exceptionStatus).json({
        statusCode: exceptionStatus,
        message: exceptionResponse,
      })
    } else {
      response.status(exceptionStatus).json(exceptionResponse)
    }
  }
}
