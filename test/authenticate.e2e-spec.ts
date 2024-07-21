import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import sessionConfig from 'src/sessions/session.config';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
    await app.init();
  });

  describe('login', () => {
    it('(POST) should login a user and create a session in the database', () => {
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'eihab@yahoo.com', password: 'ahmed@123' })
        .expect(201);
    });

    it('(POST) should fail if the user email does not exist', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'leooo@yahoo.com', password: 'ahmed@123' })
        .expect(404);
    });

    it('(POST) should fail if the user password is wrong', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'eihab@yahoo.com', password: 'ahd@123' })
        .expect(401);
    });
  });

  describe('logout', () => {
    it('(GET) should logout and delete the session from the database', () => {
      return request(app.getHttpServer()).get('/auth/logout').expect(200);
    });
  });
});
