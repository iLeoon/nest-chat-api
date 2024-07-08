import { BadRequestException } from '@nestjs/common';
import { ValidateMongoIdPipe } from './validate-mongoid.pipe';

describe('ValidateMongoIdPipe', () => {
  let pipe: ValidateMongoIdPipe;

  beforeEach(() => {
    pipe = new ValidateMongoIdPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('unsuccessful id format', () => {
    it('should throw an error if the id is not a valid mongo id', () => {
      const badId = '123456';
      const errorPipe = () => pipe.transform(badId);

      expect(errorPipe).toThrow(BadRequestException);
      expect(errorPipe).toThrow('Not a valid mongo id');
    });
  });

  describe('successful id format', () => {
    it('should let the id pass', () => {
      const validId = '66090b00edce27048b10cabc';

      expect(pipe.transform(validId)).toEqual(validId);
    });
  });
});
