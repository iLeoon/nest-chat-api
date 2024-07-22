import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Conversation } from 'src/typeorm/index';
import { MongoRepository } from 'typeorm';
import { initSession } from './testUtils';

describe('ConversationController (e2e)', () => {
  let app: INestApplication;
  let repo: MongoRepository<Conversation>;
  let cookie = '';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    initSession(app);
    repo = moduleFixture.get<MongoRepository<Conversation>>(
      getRepositoryToken(Conversation, 'MongoDB'),
    );
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await repo.deleteMany({});
    app.close();
  });

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

  describe('create', () => {
    it('(POST) should create a conversation and store it in the db', () => {
      return request(app.getHttpServer())
        .post('/conversations/create')
        .set('Cookie', cookie)
        .send({ recipient: 'leon@yahoo.com' })
        .expect(201);
    });

    it('(POST) should throw an error because this conversation already exists', () => {
      return request(app.getHttpServer())
        .post('/conversations/create')
        .set('Cookie', cookie)
        .send({ recipient: 'leon@yahoo.com' })
        .expect(400);
    });

    it('(POST) should throw an error because the recipient can not be the same as the authenticated user', () => {
      return request(app.getHttpServer())
        .post('/conversations/create')
        .set('Cookie', cookie)
        .send({ recipient: 'ahmed@yahoo.com' })
        .expect(400);
    });

    it('(POST) should throw an error because the recipient is not a valid email or empty string', () => {
      return request(app.getHttpServer())
        .post('/conversations/create')
        .set('Cookie', cookie)
        .send({ recipient: '' })
        .expect(400);
    });

    it('(POST) should throw an error because the recipient does not exist in the db', () => {
      return request(app.getHttpServer())
        .post('/conversations/create')
        .set('Cookie', cookie)
        .send({ recipient: 'leooo@gamil.com' })
        .expect(404);
    });
  });

  describe('getAuthUserConversations', () => {
    it('(GET) should return an array of the conversations of the auth user', () => {
      return request(app.getHttpServer())
        .get('/conversations')
        .set('Cookie', cookie)
        .expect(200);
    });

    it('(GET) should return an error if there are no conversations for the auth user', async () => {
      await repo.deleteMany({});
      return request(app.getHttpServer())
        .get('/conversations')
        .set('Cookie', cookie)
        .expect(404);
    });
  });
});
