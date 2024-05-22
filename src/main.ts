import config from 'config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './modules/app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import { CustomLogger, requestLogger } from '@opengeekslab_llc/nest-custom-logger';

async function bootstrap() {
  const logger = CustomLogger('NEST');

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.use(requestLogger);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,

  });
  app.use(helmet());

  app.use(session({
    secret: 'hello-world',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },
  }));
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NFT service')
    .setDescription('NFT service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.use('/api-docs', (req, res) => res.send(document));

  await app.listen(config.port);

  logger.log(`app is listening on port ${config.port}`);
}

bootstrap();

const systemLogger = CustomLogger('System');

process.on('uncaughtException', err => {
  systemLogger.error(`${err.name}: ${err.message}`, err.stack);
});
