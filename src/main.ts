import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfing = config.get('server');

  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: serverConfing.origin });
    logger.log(`Accepting request from origin ""${serverConfing.origin}`);
  }

  const port = process.env.PORT || serverConfing.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
