import { Account } from 'src/typeorm/entities/account.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { ObjectId } from 'typeorm';

export type AccountCredentials = {
  displayName: string;
  email: string;
  image: string;
  provider: string;
  id: string;
  accessToken: string;
};

export type UserCredentials = {
  name: string;
  password: string;
  email: string;
};

export type MessageRequestData = {
  content: string;
  conversationId: ObjectId;
  author: User | Account;
};

export type ConversationRequestData = {
  recipient: string;
  user: User | Account;
};

export enum RequestStatus {
  accepted = 'accepted',
  pending = 'pending',
}

export type InvitationData = {
  sender: User | Account;
  receiver: string;
};
