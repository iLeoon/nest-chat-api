import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ValidateMongoIdPipe implements PipeTransform {
  transform(value: string) {
    if (ObjectId.isValid(value)) {
      if (String(new ObjectId(value)) === value) return value;
      throw new BadRequestException();
    }
    throw new BadRequestException('Not a valid mongo id');
  }
}
