import { NestFactory } from "@nestjs/core";
import session from 'express-session'
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(session({
    secret: 'my-test-secret',
    resave: false,
    saveUninitialized: false
  }))
  app.listen(3000)
}

bootstrap()