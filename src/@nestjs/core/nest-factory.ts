import { NestApplication } from "./nest-application";

export class NestFactory {
  static create(module) {
    const app = new NestApplication(module)
    return app
  }
}