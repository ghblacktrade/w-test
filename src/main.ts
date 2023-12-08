import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerModule
} from "@nestjs/swagger";
import { ConfigService } from '@nestjs/config'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.enableCors()
  const configService = app.get(ConfigService)

  const dbHost = configService.get<string>('DB_HOST', 'localhost');
  const dbPort = configService.get<number>('DB_PORT', 5432);
  const dbUsername = configService.get<string>('DB_USERNAME', 'postgres');
  const dbPassword = configService.get<string>('DB_PASSWORD', 'postgres');
  const dbName = configService.get<string>('DB_NAME', 'postgres');

  const config = new DocumentBuilder()
      .setTitle('Weather')
      .setDescription('Get Weather')
      .setVersion('1.0')
      .addBearerAuth({ type: 'apiKey', name: 'DB_HOST', in: 'header' })
      .addBearerAuth({ type: 'apiKey', name: 'DB_PORT', in: 'header' })
      .addBearerAuth({ type: 'apiKey', name: 'DB_USERNAME', in: 'header' })
      .addBearerAuth({ type: 'apiKey', name: 'DB_PASSWORD', in: 'header' })
      .addBearerAuth({ type: 'apiKey', name: 'DB_NAME', in: 'header' })
      .addBearerAuth({ type: 'apiKey', name: 'JWT_SECRET', in: 'header' })
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
