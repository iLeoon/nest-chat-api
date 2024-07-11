import { mockAuthUser } from '../../__mocks__/users/user.mocks';
import { Message } from 'src/typeorm';
import { ObjectId } from 'mongodb';

export const mockNewMessage: Message = {
  _id: new ObjectId('65e74ef3fc6ca7c855538d22'),
  content: 'new message',
  author: mockAuthUser,
  created_at: new Date(),
};
