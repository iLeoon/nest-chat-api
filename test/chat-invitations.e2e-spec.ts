import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChatInvitation } from 'src/typeorm/index';
import { MongoRepository } from 'typeorm';
import { initSession } from './testUtils';
import { ObjectId } from 'mongodb';

describe('ChatInvitationController (e2e)', () => {
  let app: INestApplication;
  let repo: MongoRepository<ChatInvitation>;
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
    repo = moduleFixture.get<MongoRepository<ChatInvitation>>(
      getRepositoryToken(ChatInvitation, 'MongoDB'),
    );

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  /* afterAll(async () => {
    await repo.deleteMany({});
    app.close();
  }); */

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

  describe('createInvitation', () => {
    it('(POST) should create an invitation and save it in the db', () => {
      return request(app.getHttpServer())
        .post('/invitations/create')
        .set('Cookie', cookie)
        .send({ receiver: 'leon@yahoo.com' })
        .expect(201);
    });

    it('(POST) should throw an error if the email does not exist in the db', () => {
      return request(app.getHttpServer())
        .post('/invitations/create')
        .set('Cookie', cookie)
        .send({ receiver: 'pop@yahoo.com' })
        .expect(404);
    });

    it('(POST) should throw an error if the email is invalid', () => {
      return request(app.getHttpServer())
        .post('/invitations/create')
        .set('Cookie', cookie)
        .send({ receiver: 'pop' })
        .expect(400);
    });
  });

  describe('getInvitation', () => {
    it('(POST) should login a user', (done) => {
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'leon@yahoo.com', password: 'ahmed@123' })
        .expect(201)
        .end((err, res) => {
          cookie = res.headers['set-cookie'];
          done();
        });
    });

    it('(GET) should return an array of the invitations of the authenticated user', () => {
      return request(app.getHttpServer())
        .get('/invitations')
        .set('Cookie', cookie)
        .expect(200);
    });

    it('(GET) should throw an error if there is no invitations for the authenticated user', async () => {
      await repo.deleteMany({});
      return request(app.getHttpServer())
        .get('/invitations')
        .set('Cookie', cookie)
        .expect(400);
    });
  });

  describe('deleteInvitation', () => {
    it('(DELETE) should delete the invitation', async () => {
      const tempInvitation = await repo.save(
        repo.create({ sender: user, receiver: recipient }),
      );

      return request(app.getHttpServer())
        .delete(`/invitations/delete/${tempInvitation._id.toString()}`)
        .set('Cookie', cookie)
        .expect(200);
    });
  });
});
