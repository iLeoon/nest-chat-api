import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticatedGuard } from 'src/guards/auth.guard';
import { LoggerInterceptor } from 'src/interceptors/logger.interceptor';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Account } from 'src/typeorm/entities/account.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { AuthUser } from 'src/decorators/auth.decorator';

@UseInterceptors(LoggerInterceptor)
@UseGuards(AuthenticatedGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Post('create')
  async createMessage(
    @AuthUser() author: User | Account,
    @Body() messageBody: CreateMessageDto,
  ) {
    const message = await this.messageService.createMessage({
      ...messageBody,
      author,
    });
    return message;
  }

  @Get()
  async getAllMessages() {
    return await this.messageService.getMessages();
  }
}
