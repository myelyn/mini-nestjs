import { Injectable } from "@nestjs/common"
@Injectable()
export class LoggerService {
  log(msg) {
    console.log(msg)
    return msg  // 返回日志消息，便于链式调用
  }
}