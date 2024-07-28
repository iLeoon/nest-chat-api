import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/typeorm/index';
import { MongoRepository } from 'typeorm';
import { initSession } from './testUtils';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let repo: MongoRepository<User>;
  let cookie = '';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    initSession(app);
    repo = moduleFixture.get<MongoRepository<User>>(
      getRepositoryToken(User, 'MongoDB'),
    );

    await app.init();
  });

  afterAll(async () => {
    await repo.delete({ email: 'vim@yahoo.com' });
    app.close();
  });

  describe('create', () => {
    it('(POST) should login a user', (done) => {
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'ahmed@yahoo.com', password: 'ahmed@123' })
        .expect(201)
        .end((err, res) => {
          cookie = res.headers['set-cookie'];
          done();
        });
    });

    it('(POST) create a new user and store it the db', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'vim',
          email: 'vim@yahoo.com',
          password: 'ahmed@123',
        })
        .set('Cookie', cookie)
        .expect(201);
    });

    it('(POST) should throw an error if the email already exists', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'vim',
          email: 'vim@yahoo.com',
          password: 'ahmed@123',
        })
        .set('Cookie', cookie)
        .expect(400);
    });
  });

  describe('getUserByEmail', () => {
    it('(GET) should return the user through the email', async () => {
      const user = await repo.findOne({ where: { email: 'leon@yahoo.com' } });
      const _id = user._id.toString();
      return request(app.getHttpServer())
        .get('/users/leon@yahoo.com')
        .set('Cookie', cookie)
        .expect({ ...user, _id });
    });

    it('(GET) should throw an error if the email is not in the database', () => {
      return request(app.getHttpServer())
        .get('/users/leoeee@yahoo.com')
        .set('Cookie', cookie)
        .expect(404);
    });
  });

  describe('getAuthenticatedUser', () => {
    it('(GET) should return the authorized user', () => {
      return request(app.getHttpServer())
        .get('/users/authorized/user')
        .set('Cookie', cookie)
        .expect({
          name: 'ahmed',
          email: 'ahmed@yahoo.com',
          image: null,
        });
    });
  });
});
