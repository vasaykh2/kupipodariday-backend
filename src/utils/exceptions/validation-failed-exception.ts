import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationFailedException extends HttpException {
  constructor() {
    super('Ошибка валидации переданных значений', HttpStatus.BAD_REQUEST);
  }
}
