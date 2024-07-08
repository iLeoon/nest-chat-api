import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import sessionConfig from './sessions/session.config';
import { ExceptionLogger } from './filters/logger.filter';
import { AuthenticatedSocketIoAdapter } from './gateway/gateway.adaptar';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [`${process.env.NEXT_API_URL}`],
    credentials: true,
  });

  const sessions = session({
    name: 'chat-app',
    secret: process.env.SESSION_SECRET_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(process.env.SESSION_MAX_AGE),
    },
    store: MongoStore.create(sessionConfig),
  });
  const authenticatedSocketAdaptar = new AuthenticatedSocketIoAdapter(
    sessions,
    app,
  );
  app.use(sessions);
  app.use(passport.initialize());
  app.use(passport.session());
  app.useWebSocketAdapter(authenticatedSocketAdaptar);

  const customOptions = {
    customSiteTitle: 'My Custom Chat API Docs',
    customCss: '.swagger-ui .topbar { background-color: #f0f0f0; }', // Example CSS customization
  };

  const config = new DocumentBuilder()
    .setTitle('Chat Api')
    .setDescription('NestJs Chat Api')
    .setVersion('1.0')
    .addTag('chat')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, customOptions);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ExceptionLogger());

  await app.listen(3000);
}
bootstrap();
