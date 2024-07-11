import { ObjectId } from 'mongodb';
import { Account, Conversation, User } from 'src/typeorm';
import { mockAuthUser, mockRecipient } from '../../__mocks__/users/user.mocks';
import { mockNewMessage } from '../../__mocks__/messages/messages.mocks';

export const mockConversationById = {
  // the encrypted password is not being returned for the creator / recipient
  // as it should not be
  _id: new ObjectId('66090b00edce27048b10cabc'),
  creater: {
    _id: new ObjectId('66090b00edce27048b10cabc'),
    image: null,
    name: 'leon',
    email: 'leon@yahoo.com',
  },
  recipient: {
    _id: new ObjectId('66090b00edce27048b10cabc'),
    image: null,
    name: 'tal',
    email: 'tal@yahoo.com',
  },
};

export const mockNewConversation: Conversation = {
  _id: new ObjectId('66090b00edce27048b10cabc'),
  creator: mockAuthUser,
  recipient: mockRecipient,
  messages: null,
  lastMessageSent: null,
  created_at: new Date(),
};

export const mockUpdatedConversation: Conversation = {
  _id: new ObjectId('66090b00edce27048b10cabc'),
  creator: mockAuthUser,
  recipient: mockRecipient,
  messages: [mockNewMessage],
  lastMessageSent: mockNewMessage,
  created_at: new Date(),
};

export const mockMultipleMessagesConversation: Conversation = {
  _id: new ObjectId('66090b00edce27048b10cabc'),
  creator: mockAuthUser,
  recipient: mockRecipient,
  messages: [mockNewMessage, mockNewMessage],
  lastMessageSent: mockNewMessage,
  created_at: new Date(),
};

export const mockConversations = [
  {
    _id: new ObjectId('66090b00edce27048b10cabc'),
    creator: mockAuthUser,
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
    recipient: mockAuthUser,
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
    creator: mockAuthUser,
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
    recipient: mockAuthUser,
  },
];

export const mockConversationServices = {
  createConversation: jest.fn().mockResolvedValue(mockNewConversation),

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
      creator: mockAuthUser,
      recipient: mockRecipient,
    });
  }),
};
