import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';

const bodyParser = require('body-parser');
import { MyLogger } from './shared/logger/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
const port = process.env.APP_PORT;
const pjson = require('../package.json');

async function bootstrap() {
  const setVersion = pjson.version; // API version
  const _logger = new MyLogger();

  //ตั้งค่าให้ NestJS ใช้ Express Platform
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());
  // const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), { logger: new MyLogger() });

  // ตั้งค่า CORS
  app.enableCors({
    origin: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    credentials: true,
  });

  // ตั้งค่า Body Parser
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Set global prefix
  app.setGlobalPrefix('v1');

  // Set Swagger
  // Swagger option
  const swaggerCustomOptions = {
    swaggerOptions: { docExpansion: 'list', defaultModelsExpandDepth: -1, filter: true },
  };

  // swagger builder
  const options = new DocumentBuilder()
    .addServer(`${process.env.APP_HOST}`, `[${process.env.APP_SERVTYPE}] ${process.env.APP_NAME}`) // Set server url
    .setTitle(`${process.env.APP_NAME}`) // Set api title
    .setDescription(`${process.env.APP_DESC}`) // Set api description
    .setVersion(setVersion) // Set api version
    .addBearerAuth() // Set api authentication type
    .setContact(process.env.APP_NAME, `${process.env.APP_HOST}`, `${process.env.APP_EMAIL}`) // Set api contact to developer or staff
    .addTag('Authentication & Access') // Set api default tags.
    .build();

  // create swagger
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document, swaggerCustomOptions);

  // Expose port
  await app.listen(port);
  await _logger.log("==============================");
  await _logger.log(`Server running on [${process.env.APP_SERVTYPE}][v${setVersion}] : ${await app.getUrl()}`, 'Bootstrap');
  await _logger.log("==============================");
}
bootstrap();
