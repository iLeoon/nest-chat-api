import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Account } from 'src/typeorm/entities/account.entity';
import { Conversation } from 'src/typeorm/entities/conversation.entity';
import { Message } from 'src/typeorm/entities/message.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { filterObject } from 'src/utils/functions/deleteObjectKey';
import { ConversationRequestData } from 'src/utils/types';
import { MongoRepository } from 'typeorm';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation, 'MongoDB')
    private readonly conversationRepo: MongoRepository<Conversation>,
    private readonly userService: UsersService,
  ) {}

  async createConversation(request: ConversationRequestData) {
    const recipient = await this.userService.getUserByEmail(request.recipient);
    if (recipient.email === request.user.email)
      throw new HttpException(
        "You can't create a conversation with yourself",
        HttpStatus.BAD_REQUEST,
      );

    const conversation = this.conversationRepo.create({
      creator: request.user,
      recipient: recipient,
    });
    return await this.conversationRepo.save(conversation);
  }

  async getAuthConversations(authUser: User | Account) {
    const conversations = await this.conversationRepo.find({
      where: {
        $or: [{ creator: authUser }, { recipient: authUser }],
      },
    });
    if (conversations.length === 0) {
      throw new NotFoundException('This user does not have any conversations.');
    }
    return conversations;
  }

  async getConversationById(conversationId: string) {
    const conversation = await this.conversationRepo.findOne({
      where: { _id: new ObjectId(conversationId) },
    });

    if (!conversation) {
      throw new NotFoundException(
        'There is no conversation found with that Id.',
      );
    }
    const newConversation = filterObject<Conversation>(
      conversation,
      'password',
    );
    return newConversation;
  }

  async updateConversationMessages(
    conversation: Conversation,
    message: Message,
  ) {
    if (!conversation.messages) {
      return await this.conversationRepo.updateOne(
        { _id: conversation._id },
        { $set: { messages: [message] } },
      );
    }

    return await this.conversationRepo.updateOne(
      { _id: conversation._id },
      { $push: { messages: message } as any },
    );
  }

  async updateLastMessageSent(conversation: Conversation, message: Message) {
    return await this.conversationRepo.updateOne(
      {
        _id: conversation._id,
      },
      { $set: { lastMessageSent: message } },
    );
  }
}
