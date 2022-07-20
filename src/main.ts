import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MSG } from './config/constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Class-validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        exposeDefaultValues: true,
      },
      exceptionFactory: (errs) => {
        return new BadRequestException(errs, MSG.RESPONSE.BAD_REQUEST);
      },
    }),
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Ahihi')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  app.enableCors();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const PORT = parseInt(`${process.env.PORT}`) || 5000;
  await app.listen(PORT);
}
bootstrap();
