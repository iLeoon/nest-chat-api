import { ObjectId } from 'mongodb';
import { Account, User } from 'src/typeorm';
import { ConversationRequestData } from 'src/utils/types';
import { mocknAuthUser, mockRecipient } from '../../__mocks__/users/user.mocks';

export const mockCreatedConversation = {
  _id: new ObjectId('66090b00edce27048b10cabc'),
  creator: mocknAuthUser,
  recipient: mockRecipient,
};

export const mockConversations = [
  {
    _id: new ObjectId('66090b00edce27048b10cabc'),
    creator: mocknAuthUser,
    recipient: mockRecipient,
  },
  {
    _id: new ObjectId('66090b00edce27048b10cabc'),
    creator: {
      _id: new ObjectId('66090b00edce27048b10cabc'),
      name: 'mohamed',
      email: 'mohamed@yahoo.com',
      image: null,
      password: '123',
    },
    recipient: mocknAuthUser,
  },
  {
    _id: new ObjectId('66090b00edce27048b10cabc'),
    creator: mockRecipient,
    recipient: {
      _id: new ObjectId('66090b00edce27048b10cabc'),
      name: 'mohamed',
      email: 'mohamed@yahoo.com',
      image: null,
      password: '123',
    },
  },
];

export const mockAuthUserConversations = [
  {
    _id: new ObjectId('66090b00edce27048b10cabc'),
    creator: mocknAuthUser,
    recipient: mockRecipient,
  },
  {
    _id: new ObjectId('66090b00edce27048b10cabc'),
    creator: {
      _id: new ObjectId('66090b00edce27048b10cabc'),
      name: 'mohamed',
      email: 'mohamed@yahoo.com',
      image: null,
      password: '123',
    },
    recipient: mocknAuthUser,
  },
];

export const mockConversationServices = {
  createConversation: jest
    .fn()
    .mockImplementation((request: ConversationRequestData) => {
      const recipient = {
        ...mockRecipient,
        email: request.recipient,
      };
      return Promise.resolve({
        _id: new ObjectId('66090b00edce27048b10cabc'),
        creator: request.user,
        recipient,
      });
    }),

  getAllConversations: jest.fn().mockResolvedValue(mockConversations),

  getAuthConversations: jest.fn().mockImplementation((user: User | Account) => {
    return Promise.resolve(
      mockConversations.filter(
        (conversation) =>
          conversation.creator.email === user.email ||
          conversation.recipient.email === user.email,
      ),
    );
  }),

  getConversationById: jest.fn().mockImplementation((id: string) => {
    return Promise.resolve({
      _id: new ObjectId(id), //must be in object id format in order to be found in the database
      creator: mocknAuthUser,
      recipient: mockRecipient,
    });
  }),
};
