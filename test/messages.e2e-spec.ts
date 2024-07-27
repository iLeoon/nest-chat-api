import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Conversation, Message } from 'src/typeorm/index';
import { MongoRepository } from 'typeorm';
import { initSession } from './testUtils';
import { ObjectId } from 'mongodb';

describe('MessageController (e2e)', () => {
  let app: INestApplication;
  let conversationRepo: MongoRepository<Conversation>;
  let messageRepo: MongoRepository<Message>;

  let cookie = '';
  const user = {
    _id: new ObjectId('669e191f8b38d62dcfad803e'),
    name: 'ahmed',
    email: 'ahmed@yahoo.com',
    image: null,
    password: 'ahmed@123',
  };
  const recipient = {
    _id: new ObjectId('669e52710147e91a885952d1'),
    name: 'leon',
    email: 'leon@yahoo.com',
    image: null,
    password: 'ahmed@123',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    initSession(app);

    conversationRepo = moduleFixture.get<MongoRepository<Conversation>>(
      getRepositoryToken(Conversation, 'MongoDB'),
    );

    messageRepo = moduleFixture.get<MongoRepository<Message>>(
      getRepositoryToken(Message, 'MongoDB'),
    );

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await messageRepo.deleteMany({});
    await conversationRepo.deleteMany({});
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

  describe('createMessage', () => {
    it('(POST) it creates a message and save it in the db', async () => {
      const tempConversation = await conversationRepo.save(
        conversationRepo.create({ creator: user, recipient }),
      );
      return request(app.getHttpServer())
        .post('/messages/create')
        .set('Cookie', cookie)
        .send({
          content: 'hello world',
          conversationId: `${tempConversation._id.toString()}`,
        })
        .expect(201);
    });

    it('(POST) it should throw an error if the conversation id is invalid mongo id', () => {
      return request(app.getHttpServer())
        .post('/messages/create')
        .set('Cookie', cookie)
        .send({
          content: 'hello world',
          conversationId: 'abcd',
        })
        .expect(400);
    });

    it('(POST) it should throw an error if the conversation id does not exist in the db', () => {
      return request(app.getHttpServer())
        .post('/messages/create')
        .set('Cookie', cookie)
        .send({
          content: 'hello world',
          conversationId: '6606cc37956d3aa4b05a2360',
        })
        .expect(404);
    });
  });
});
