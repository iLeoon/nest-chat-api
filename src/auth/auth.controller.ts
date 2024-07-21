import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SessionGuard } from 'src/guards/session.guard';
import { LoggerInterceptor } from 'src/interceptors/logger.interceptor';
import { ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { TwitterAuthGuard } from 'src/guards/twitter-auth.guard';
import {
  GoogleLoginResponse,
  TwitterLoginResponse,
} from 'src/swagger/auth-swagger';
@UseInterceptors(LoggerInterceptor)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    type: CreateUserDto,
    required: true,
    description: 'The user to create',
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async signup(@Body() createUserDto: CreateUserDto, @Req() req) {
    const user = await this.authService.signup(createUserDto);
    req.login(user, (err) => {
      if (err) throw err;
    });
    return user;
  }

  @UseGuards(SessionGuard)
  @ApiBody({
    type: LoginDto,
    required: true,
    description: 'The user to login',
  })
  @Post('login')
  async login(@Req() req) {
    const { name, email, image } = req.user;
    return { name, email, image };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google/login')
  @ApiOperation({ summary: 'Login with Google' })
  @ApiResponse({
    status: 200,
    description: 'Redirected to Twitter',
    type: GoogleLoginResponse,
  })
  handleGoogleLogin(@Req() req) {
    console.log(req);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/users')
  handleGoogleRedirect(@Req() req) {
    const { name, image, email } = req.user;
    return { name, image, email };
  }

  @Get('logout')
  logout(@Req() req, @Res() res) {
    req.session.destroy(function () {
      res.clearCookie('chat-app');
      res.send('Ok');
    });
  }

  @UseGuards(TwitterAuthGuard)
  @Get('/twitter/login')
  @ApiOperation({ summary: 'Login with Twitter' })
  @ApiResponse({
    status: 200,
    description: 'Redirected to Twitter',
    type: TwitterLoginResponse,
  })
  handleTwitterLogin(@Req() req) {
    console.log(req);
  }

  @UseGuards(TwitterAuthGuard)
  @ApiResponse({ status: 200, description: 'Redirected to the app' })
  @Get('/twitter/callback')
  handleTwitterRedirect(@Req() req) {
    const { name, image, email } = req.user;
    return { name, image, email };
  }
}
