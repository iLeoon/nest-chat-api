import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import {
  mockAuthUser,
  mockConversations,
  mockConversationServices,
  mockNewConversation,
  mockAuthUserConversations,
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

  describe('createConv', () => {
    it('should create a conversation and return the created conversation', async () => {
      const conversation = controller.createConv(mockAuthUser, {
        recipient: 'eihab@yahoo.com',
      });

      await expect(conversation).resolves.toEqual(mockNewConversation);
    });
  });

  describe('getAuthConversations', () => {
    it('should return an array of the authenticated user conversations', async () => {
      await expect(
        controller.getAuthUserConversations(mockAuthUser),
      ).resolves.toEqual(mockAuthUserConversations);
    });
  });

  describe('getConversation', () => {
    it('should return the conversation by the specified id', async () => {
      const id = '66090b00edce27048b10cabc';
      await expect(
        controller.getConversation(mockAuthUser, id),
      ).resolves.toEqual(mockConversations[0]);
    });
  });
});
