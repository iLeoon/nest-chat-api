import { mocknAuthUser } from '../../__mocks__/conversations/conversation.mocks';

export const mockUserServcices = {
  getUserByEmail: jest.fn().mockImplementation((email: string) => {
    return Promise.resolve({
      ...mocknAuthUser,
      email,
    });
  }),
};
