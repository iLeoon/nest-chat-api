import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The content of the message',
    type: String,
    required: true,
  })
  content: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    description: 'The targeted conversation',
    type: IsMongoId,
    required: true,
  })
  conversationId: string;
}
