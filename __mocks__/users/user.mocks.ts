import { ObjectId } from 'mongodb';
import { User, Account } from 'src/typeorm';

export const mockAuthUser: User | Account = {
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

export const mockHashedUser = {
  _id: new ObjectId('66090b00edce27048b10cabc'),
  name: 'ahmed',
  email: 'ahmed@yahoo.com',
  password: 'hashed',
};

export const mockAccount = {
  name: 'Ahmed',
  email: 'ahmed240@gmail.com',
  image: 'https://image',
  provider: 'google',
  id: '222',
  accessToken: 'helloworld',
};

export const mockUsers = [
  {
    _id: new ObjectId('66090b00edce27048b10cabc'),
    name: 'ahmed',
    email: 'ahmed@yahoo.com',
    image: null,
    password: '123',
  },
  {
    _id: new ObjectId('66090b00edce27048b10cabc'),
    name: 'eihab',
    email: 'eihab@yahoo.com',
    image: null,
    password: '123',
  },
];

export const mockUserServcices = {
  getUserByEmail: jest.fn().mockImplementation((email: string) => {
    const user = mockUsers.filter((usr) => usr.email === email);
    return Promise.resolve(user[0]);
  }),

  create: jest.fn().mockResolvedValue(mockAuthUser),

  findOneById: jest.fn().mockResolvedValue(mockAuthUser),
};
