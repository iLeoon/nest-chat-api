import { INestApplication } from '@nestjs/common';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import sessionConfig from 'src/sessions/session.config';

export function initSession(app: INestApplication) {
  const sessions = session({
    name: 'chat-app-testing',
    secret: process.env.SESSION_SECRET_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(process.env.SESSION_MAX_AGE),
    },
    store: MongoStore.create(sessionConfig),
  });
  app.use(sessions);
  app.use(passport.initialize());
  app.use(passport.session());
}
