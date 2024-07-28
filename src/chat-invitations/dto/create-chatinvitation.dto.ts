import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateChatInvitationDto {
  @IsNotEmpty()
  @IsEmail()
  receiver: string;
}
