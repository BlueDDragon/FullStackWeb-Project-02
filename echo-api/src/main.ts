import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Echo API Document")
    .setDescription("반응형 SNS 에코의 API 안내 문서")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  SwaggerModule.setup("docs", app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Start to Server: http://localhost:${process.env.PORT ?? 3000} (swagger: /docs)`);
}
bootstrap();
