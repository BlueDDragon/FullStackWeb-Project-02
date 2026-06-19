import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { domainConstants, portConstants, uploadConstants } from './common/constants';
import { mkdirSync } from 'fs';

async function bootstrap() {
  // Upload Dir
  mkdirSync(uploadConstants.dir, { recursive: true });
  mkdirSync(uploadConstants.profileDir, { recursive: true });
  mkdirSync(uploadConstants.headerDir, { recursive: true });
  mkdirSync(uploadConstants.postDir, { recursive: true });

  const app = await NestFactory.create(AppModule);

  // Validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Echo API Document")
    .setDescription("텍스트 중심 SNS 에코의 API 안내 문서")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, config));

  // CORS
  app.enableCors({
    origin: `${domainConstants.domain}:${portConstants.clientPort}`,
    credentials: true,
  });

  await app.listen(portConstants.port);

  console.log(`Start to Server: ${domainConstants.domain}:${portConstants.port} (swagger: /docs)`);
}
bootstrap();
