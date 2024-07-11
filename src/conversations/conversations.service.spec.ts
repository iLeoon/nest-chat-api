import { MongoRepository } from 'typeorm';
import { ConversationsService } from './conversations.service';
import { Conversation } from 'src/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import {
  mockAuthUserConversations,
  mockConversationById,
  mockAuthUser,
  mockNewConversation,
  mockUserServcices,
  mockNewMessage,
  mockUpdatedConversation,
  mockMultipleMessagesConversation,
} from '../../__mocks__';

describe('ConversationsService', () => {
  let service: ConversationsService;
  let repo: MongoRepository<Conversation>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Conversation, 'MongoDB'),
          useValue: {
            find: jest.fn().mockResolvedValue(mockAuthUserConversations),
            create: jest.fn().mockResolvedValue(mockNewConversation),
            save: jest.fn(),
            findOne: jest.fn().mockResolvedValue(mockConversationById),
            updateOne: jest.fn(),
          },
        },

        {
          provide: UsersService,
          useValue: mockUserServcices,
        },
        ConversationsService,
      ],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);
    repo = module.get<MongoRepository<Conversation>>(
      getRepositoryToken(Conversation, 'MongoDB'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('createConversation', () => {
    it('should create a conversation and save it to the db', async () => {
      const spyRepo = jest
        .spyOn(repo, 'save')
        .mockResolvedValue(mockNewConversation);

      await expect(
        service.createConversation({
          recipient: 'eihab@yahoo.com',
          user: mockAuthUser,
        }),
      ).resolves.toEqual(mockNewConversation);

      expect(spyRepo).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAuthConversations', () => {
    it('should returns an array of conversations for the authenticated user', async () => {
      await expect(service.getAuthConversations(mockAuthUser)).resolves.toEqual(
        mockAuthUserConversations,
      );
    });
  });

  describe('getConversationById', () => {
    it('should return the specified conversation with the id', async () => {
      await expect(
        service.getConversationById('66090b00edce27048b10cabc'),
      ).resolves.toEqual(mockConversationById);
    });
  });

  describe('updateConversationMessages', () => {
    it('should update the messages array for a conversation if null', async () => {
      const repoSpy = jest
        .spyOn(repo, 'updateOne')
        .mockResolvedValue(mockUpdatedConversation);

      await expect(
        service.updateConversationMessages(mockNewConversation, mockNewMessage),
      ).resolves.toEqual(mockUpdatedConversation);

      expect(repoSpy).toHaveBeenCalledWith(
        { _id: mockNewConversation._id },
        { $set: { messages: [mockNewMessage] } },
      );
    });
  });

  describe('updateConversationMessages', () => {
    it('should update the messages array for a conversation if not null', async () => {
      const repoSpy = jest
        .spyOn(repo, 'updateOne')
        .mockResolvedValueOnce(mockMultipleMessagesConversation);

      await expect(
        service.updateConversationMessages(mockNewConversation, mockNewMessage),
      ).resolves.toEqual(mockMultipleMessagesConversation);

      expect(repoSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateLastMessageSent', () => {
    it('should set the last message sent to the db', async () => {
      const repoSpy = jest
        .spyOn(repo, 'updateOne')
        .mockResolvedValueOnce(mockUpdatedConversation);

      await expect(
        service.updateLastMessageSent(mockNewConversation, mockNewMessage),
      ).resolves.toEqual(mockUpdatedConversation);
      expect(repoSpy).toHaveBeenCalledWith(
        {
          _id: mockNewConversation._id,
        },
        { $set: { lastMessageSent: mockNewMessage } },
      );
    });
  });
});
