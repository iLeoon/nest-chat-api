import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import {
  mocknAuthUser,
  mockConversations,
  mockConversationServices,
  mockCreatedConversation,
  mockAuthConversations,
} from '../../__mocks__/index';

describe('ConversationsController', () => {
  let controller: ConversationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationsController],
      providers: [
        {
          provide: ConversationsService,
          useValue: mockConversationServices,
        },
      ],
    }).compile();

    controller = module.get<ConversationsController>(ConversationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getConversations', () => {
    it('should return an array of conversations', async () => {
      await expect(controller.getConversations()).resolves.toEqual(
        mockConversations,
      );
    });
  });

  describe('createConv', () => {
    it('should create a conversation and return the created conversation', async () => {
      const conversation = controller.createConv(mocknAuthUser, {
        recipient: 'eihab@yahoo.com',
      });

      await expect(conversation).resolves.toEqual(mockCreatedConversation);
    });
  });

  describe('getAuthConversations', () => {
    it('should return an array of the authenticated user conversations', async () => {
      await expect(
        controller.getAuthUserConversations(mocknAuthUser),
      ).resolves.toEqual(mockAuthConversations);
    });
  });
});
