import { MongoRepository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from 'src/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountsService } from 'src/accounts/accounts.service';
import * as utils from '../utils/bcrypt';
import { mockAccount, mockAuthUser, mockHashedUser } from '../../__mocks__';

describe('UserService', () => {
  let service: UsersService;
  let repo: MongoRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User, 'MongoDB'),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockReturnValue(mockHashedUser),
            save: jest.fn(),
          },
        },

        {
          provide: AccountsService,
          useValue: {
            getAccount: jest.fn().mockResolvedValue(mockAccount),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<MongoRepository<User>>(
      getRepositoryToken(User, 'MongoDB'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and encode the password', async () => {
      const encodedPass = jest
        .spyOn(utils, 'hashPassword')
        .mockResolvedValueOnce('hashed');

      await expect(
        service.create({
          name: 'ahmed',
          email: 'ahmed@yahoo.com',
          password: '123',
        }),
      ).resolves.toEqual(mockHashedUser);

      expect(encodedPass).toHaveBeenCalledWith('123');
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user with the specified email', async () => {
      const repoSpy = jest
        .spyOn(repo, 'findOne')
        .mockResolvedValue(mockAuthUser as User);

      await expect(service.getUserByEmail('ahmed@yahoo.com')).resolves.toEqual(
        mockAuthUser,
      );

      expect(repoSpy).toHaveBeenCalledWith({
        where: { email: 'ahmed@yahoo.com' },
      });
    });

    it('should return an account if a user not found with the specified email', async () => {
      expect(service.getUserByEmail('ahmed240@gamil.com')).resolves.toEqual(
        mockAccount,
      );
    });
  });
});
