import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/guards/auth.guard';
import { LoggerInterceptor } from 'src/interceptors/logger.interceptor';
import { AuthUser } from 'src/decorators/auth.decorator';
import { Account, User } from 'src/typeorm';

@Controller('users')
@UseGuards(AuthenticatedGuard)
@UseInterceptors(LoggerInterceptor)
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiParam({ name: 'CreateUserDto', required: true })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get(':email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiParam({ name: 'email', required: true })
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.getUserByEmail(email);
    return user;
  }

  @Get('/authorized/user')
  getAuthenticatedUser(@AuthUser() user: User | Account) {
    return { name: user.name, image: user.image, email: user.email };
  }
}
