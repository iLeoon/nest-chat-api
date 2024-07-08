import { ObjectId } from 'mongodb';
import { User, Account } from 'src/typeorm';

export const mocknAuthUser: User | Account = {
  _id: new ObjectId('66090b00edce27048b10cabc'),
  name: 'ahmed',
  email: 'ahmed@yahoo.com',
  image: null,
  password: '123',
};

export const mockRecipient: User | Account = {
  _id: new ObjectId('66090b00edce27048b10cabc'),
  name: 'eihab',
  email: 'eihab@yahoo.com',
  image: null,
  password: '123',
};
export const mockUserServcices = {
  getUserByEmail: jest.fn().mockImplementation((email: string) => {
    return Promise.resolve({
      ...mocknAuthUser,
      email,
    });
  }),
};
