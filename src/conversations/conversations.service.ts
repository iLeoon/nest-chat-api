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
import { doesExist } from 'src/utils/conversations/doesExist';
import { ConversationRequestData } from 'src/utils/types';
import { MongoRepository } from 'typeorm';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation, 'MongoDB')
    private readonly conversationRepo: MongoRepository<Conversation>,
    private readonly userService: UsersService,
  ) {}

  async getAllConversations() {
    return await this.conversationRepo.find();
  }
  async createConversation(request: ConversationRequestData) {
    const recipent = await this.userService.getUserByEmail(request.recipient);
    if (recipent.email === request.user.email)
      throw new HttpException(
        "You can't create a conversation with yourself",
        HttpStatus.BAD_REQUEST,
      );

    const existedConversation = await doesExist(
      request.user,
      recipent,
      this.conversationRepo,
    );
    if (existedConversation)
      throw new HttpException(
        'Conversation already exists',
        HttpStatus.BAD_REQUEST,
      );
    const conversation = this.conversationRepo.create({
      creator: request.user,
      recipent: recipent,
    });
    return await this.conversationRepo.save(conversation);
  }

  async getConversations(authUser: User | Account) {
    console.log(authUser);
    const conversations = await this.conversationRepo.find({
      where: {
        $or: [{ creator: authUser }, { recipent: authUser }],
      },
    });
    console.log(conversations);
    if (conversations.length === 0) {
      throw new NotFoundException('This user does not have any conversations.');
    }
    return conversations;
  }

  async getConversationById(conversationId: ObjectId) {
    const conversation = await this.conversationRepo.findOne({
      where: { _id: new ObjectId(conversationId) },
    });
    return conversation;
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
}
