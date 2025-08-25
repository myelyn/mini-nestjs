import { HttpStatus } from '@nestjs/common'

export class HttpException extends Error {
  public readonly status: number
  public readonly response: string | object
  constructor(response: string | object, status: number) {
    super()
    this.status = status
    this.response = response
  }
  public getResponse(): string | object {
    return this.response
  }
  public getStatus(): HttpStatus {
    return this.status
  }
}

export class BadRequestException extends HttpException {
  constructor(response: string | object) {
    super(response, HttpStatus.BAD_REQUEST)
  }
}

export class UnauthorizedException extends HttpException {
  constructor(response: string | object) {
    super(response, HttpStatus.UNAUTHORIZED)
  }
}

export class ForbiddenException extends HttpException {
  constructor(response: string | object) {
    super(response, HttpStatus.FORBIDDEN)
  }
}

export class NotFoundException extends HttpException {
  constructor(response: string | object) {
    super(response, HttpStatus.NOT_FOUND)
  }
}
