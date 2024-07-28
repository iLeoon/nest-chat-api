import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { InvitationData } from 'src/utils/types';
import { UsersService } from 'src/users/users.service';
import { isPending } from 'src/utils/chat-invitations/isPending';
import { Account, User, ChatInvitation, Conversation } from 'src/typeorm';
import { ObjectId } from 'mongodb';
import { doesExist } from 'src/utils/conversations/doesExist';

@Injectable()
export class ChatInviationService {
  constructor(
    @InjectRepository(ChatInvitation, 'MongoDB')
    private readonly chatInvitationRepo: MongoRepository<ChatInvitation>,
    @InjectRepository(Conversation, 'MongoDB')
    private readonly conversationRepo: MongoRepository<Conversation>,
    private readonly usersService: UsersService,
  ) {}

  async createRequest(invitaionData: InvitationData) {
    const receiver = await this.usersService.getUserByEmail(
      invitaionData.receiver,
    );
    if (receiver.email === invitaionData.sender.email) {
      throw new BadRequestException("You can't send a request to  yourself");
    }

    await isPending(invitaionData.sender, receiver, this.chatInvitationRepo);
    const existedConversation = await doesExist(
      invitaionData.sender,
      receiver,
      this.conversationRepo,
    );

    if (existedConversation)
      throw new HttpException(
        'You already have a conversation with that user.',
        HttpStatus.BAD_REQUEST,
      );

    const requestedInvitation = this.chatInvitationRepo.create({
      ...invitaionData,
      receiver,
    });
    return await this.chatInvitationRepo.save(requestedInvitation);
  }

  async getChatInvitationByUser(authUser: User | Account) {
    const invitations = await this.chatInvitationRepo.find({
      where: {
        receiver: authUser,
      },
    });
    if (invitations.length === 0) {
      throw new BadRequestException(
        'No chat invitations were found for that user',
      );
    }

    return invitations;
  }

  async getChatInvitationByid(id: string) {
    const invitation = await this.chatInvitationRepo.findOne({
      where: {
        _id: new ObjectId(id),
      },
    });

    if (!invitation) {
      throw new BadRequestException('No invitation was found with that id');
    }

    return invitation;
  }

  async deleteChatInvitation(user: User | Account, id: string) {
    const invitation = await this.getChatInvitationByid(id);
    if (
      invitation.receiver.email === user.email ||
      invitation.sender.email === user.email
    ) {
      return await this.chatInvitationRepo.findOneAndDelete({
        _id: new ObjectId(id),
      });
    }

    throw new BadRequestException(
      'You are not allowed to delete this invitation',
    );
  }
}
