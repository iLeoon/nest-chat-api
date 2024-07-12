import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { mockAuthUser, mockUserServcices } from '../../__mocks__';

describe('UsersController', () => {
  let controller: UsersController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserServcices,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      await expect(
        controller.create({
          name: 'ahmed',
          email: 'ahmed@yahoo.com',
          password: '123',
        }),
      ).resolves.toEqual(mockAuthUser);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user with the specified email', async () => {
      await expect(
        controller.getUserByEmail('ahmed@yahoo.com'),
      ).resolves.toEqual(mockAuthUser);
    });
  });

  describe('getAuthenticatedUser', () => {
    it('should return the authenticated user', () => {
      expect(controller.getAuthenticatedUser(mockAuthUser)).toEqual({
        name: mockAuthUser.name,
        image: mockAuthUser.image,
        email: mockAuthUser.email,
      });
    });
  });
});
