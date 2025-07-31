import { NestApplication } from '@nestjs/core'
export class NestFactory {
  static async create(module: any): Promise<NestApplication> {
    const app = new NestApplication(module)
    return app
  }
}
