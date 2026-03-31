import { UnauthorizedException, BadRequestException } from '@nestjs/common';
export class InvalidCredentialsException extends UnauthorizedException {
    constructor() {
        super('invalid email or password');
    }
}
export class EmailAlreadyExistsException extends BadRequestException {
  constructor() {
    super('Email already registered');
  }
}