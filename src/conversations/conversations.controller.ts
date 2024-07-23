import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { User } from 'src/typeorm/entities/user.entity';
import { Account } from 'src/typeorm/entities/account.entity';
import { ConversationsService } from './conversations.service';
import { AuthenticatedGuard } from 'src/guards/auth.guard';
import { LoggerInterceptor } from 'src/interceptors/logger.interceptor';
import { AuthUser } from 'src/decorators/auth.decorator';
import { ValidateMongoIdPipe } from 'src/pipes/validate-mongoid.pipe';

@UseInterceptors(LoggerInterceptor)
@UseGuards(AuthenticatedGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationService: ConversationsService) {}

  @Post('/create')
  async createConv(
    @AuthUser() user: User | Account,
    @Body() ConversationData: CreateConversationDto,
  ) {
    const conversation = await this.conversationService.createConversation({
      ...ConversationData,
      user,
    });

    return conversation;
  }

  @Get()
  async getAuthUserConversations(@AuthUser() user: User | Account) {
    return await this.conversationService.getAuthConversations(user);
  }

  @Get(':id')
  async getConversation(
    @AuthUser() user: User | Account,
    @Param('id', ValidateMongoIdPipe) id: string,
  ) {
    return await this.conversationService.getConversationById(id, user);
  }
}
